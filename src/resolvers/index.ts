import { DateTimeResolver } from 'graphql-scalars';
import { Context } from '../context';

const resolvers = {
  Query: {
    allUsers: (_parent: any, _args: any, context: Context) => context.prisma.user.findMany(),
    postById: (_parent: any, args: { id: number }, context: Context) => context
      .prisma
      .post
      .findUnique({
        where: { id: args.id || undefined },
      }),
    feed: (
      _parent: any,
      args: {
        searchString: string
        skip: number
        take: number
        orderBy: PostOrderByUpdatedAtInput
      },
      context: Context,
    ) => {
      const or = args.searchString
        ? {
          OR: [
            { title: { contains: args.searchString } },
            { content: { contains: args.searchString } },
          ],
        }
        : {};

      return context.prisma.post.findMany({
        where: {
          published: true,
          ...or,
        },
        take: args?.take,
        skip: args?.skip,
        orderBy: args?.orderBy,
      });
    },
    draftsByUser: (
      _parent: any,
      args: { userUniqueInput: UserUniqueInput },
      context: Context,
    ) => context.prisma.user
      .findUnique({
        where: {
          id: args.userUniqueInput.id || undefined,
          email: args.userUniqueInput.email || undefined,
        },
      })
      .posts({
        where: {
          published: false,
        },
      }),
  },
  Mutation: {
    signupUser: (
      _parent: any,
      args: { data: UserCreateInput },
      context: Context,
    ) => {
      const postData = args.data.posts?.map((post) => ({
        title: post.title,
        content: post.content || undefined,
      }));

      return context.prisma.user.create({
        data: {
          name: args.data.name,
          email: args.data.email,
          posts: {
            create: postData,
          },
        },
      });
    },
    createDraft: (
      _parent: any,
      args: { data: PostCreateInput; authorEmail: string },
      context: Context,
    ) => context.prisma.post.create({
      data: {
        title: args.data.title,
        content: args.data.content,
        author: {
          connect: { email: args.authorEmail },
        },
      },
    }),
    togglePublishPost: async (
      _parent: any,
      args: { id: number },
      context: Context,
    ) => {
      try {
        const post = await context.prisma.post.findUnique({
          where: { id: args.id || undefined },
          select: {
            published: true,
          },
        });

        return await context.prisma.post.update({
          where: { id: args.id || undefined },
          data: { published: !post?.published },
        });
      } catch (error) {
        throw new Error(
          `Post with ID ${args.id} does not exist in the database.`,
        );
      }
    },
    incrementPostViewCount: (
      _parent: any,
      args: { id: number },
      context: Context,
    ) => context.prisma.post.update({
      where: { id: args.id || undefined },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    }),
    deletePost: (_parent: any, args: { id: number }, context: Context) => context
      .prisma
      .post
      .delete({ where: { id: args.id } }),
  },
  DateTime: DateTimeResolver,
  Post: {
    author: (parent: any, _args: any, context: Context) => context.prisma.post
      .findUnique({
        where: { id: parent?.id },
      })
      .author(),
  },
  User: {
    posts: (parent: any, _args: any, context: Context) => context.prisma.user
      .findUnique({
        where: { id: parent?.id },
      })
      .posts(),
  },
};

enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

interface PostOrderByUpdatedAtInput {
  updatedAt: SortOrder
}

interface UserUniqueInput {
  id?: number
  email?: string
}

interface PostCreateInput {
  title: string
  content?: string
}

interface UserCreateInput {
  email: string
  name?: string
  posts?: PostCreateInput[]
}

export default resolvers;
