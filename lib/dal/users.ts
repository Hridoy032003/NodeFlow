import { prisma } from '@/lib/prisma';

/**
 * Data Access Layer for User operations
 */
export const userDAL = {
  /**
   * Get user by email
   */
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  /**
   * Create a new user
   */
  async createUser(data: {
    email: string;
    name?: string;
    password?: string;
    image?: string;
  }) {
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        image: data.image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  /**
   * Update user profile
   */
  async updateUser(
    userId: string,
    data: {
      name?: string;
      image?: string;
    }
  ) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  /**
   * Get user with workflow statistics
   */
  async getUserWithStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            workflows: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // Get additional statistics
    const workflows = await prisma.workflow.findMany({
      where: { userId },
      select: {
        _count: {
          select: {
            nodes: true,
            edges: true,
          },
        },
      },
    });

    const totalNodes = workflows.reduce((sum, w) => sum + w._count.nodes, 0);
    const totalEdges = workflows.reduce((sum, w) => sum + w._count.edges, 0);

    return {
      ...user,
      statistics: {
        totalWorkflows: user._count.workflows,
        totalNodes,
        totalEdges,
      },
    };
  },

  /**
   * Delete user account
   */
  async deleteUser(userId: string) {
    return await prisma.user.delete({
      where: { id: userId },
    });
  },
};
