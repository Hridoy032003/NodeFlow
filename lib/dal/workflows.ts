import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type WorkflowWithCounts = Prisma.WorkflowGetPayload<{
  select: {
    id: true;
    name: true;
    description: true;
    userId: true;
    isPublic: true;
    createdAt: true;
    updatedAt: true;
    _count: {
      select: {
        nodes: true;
        edges: true;
      };
    };
  };
}>;

export type WorkflowWithDetails = Prisma.WorkflowGetPayload<{
  include: {
    nodes: true;
    edges: true;
  };
}>;

/**
 * Data Access Layer for Workflow operations
 */
export const workflowDAL = {
  /**
   * Get all workflows for a user
   */
  async getUserWorkflows(userId: string): Promise<WorkflowWithCounts[]> {
    return await prisma.workflow.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        userId: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            nodes: true,
            edges: true,
          },
        },
      },
    });
  },

  /**
   * Get a single workflow by ID with all nodes and edges
   */
  async getWorkflowById(
    workflowId: string,
    userId?: string
  ): Promise<WorkflowWithDetails | null> {
    const where: Prisma.WorkflowWhereUniqueInput = {
      id: workflowId,
    };

    const workflow = await prisma.workflow.findUnique({
      where,
      include: {
        nodes: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        edges: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    // Check authorization if userId is provided
    if (workflow && userId && workflow.userId !== userId && !workflow.isPublic) {
      return null; // User doesn't have access
    }

    return workflow;
  },

  /**
   * Create a new workflow
   */
  async createWorkflow(data: {
    name: string;
    description?: string;
    userId: string;
    isPublic?: boolean;
  }) {
    return await prisma.workflow.create({
      data: {
        name: data.name,
        description: data.description,
        isPublic: data.isPublic || false,
        userId: data.userId,
      },
    });
  },

  /**
   * Update a workflow
   */
  async updateWorkflow(
    workflowId: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      isPublic?: boolean;
    }
  ) {
    // Verify ownership
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      select: { userId: true },
    });

    if (!workflow || workflow.userId !== userId) {
      throw new Error('Workflow not found or unauthorized');
    }

    return await prisma.workflow.update({
      where: { id: workflowId },
      data,
    });
  },

  /**
   * Delete a workflow
   */
  async deleteWorkflow(workflowId: string, userId: string) {
    // Verify ownership
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      select: { userId: true },
    });

    if (!workflow || workflow.userId !== userId) {
      throw new Error('Workflow not found or unauthorized');
    }

    return await prisma.workflow.delete({
      where: { id: workflowId },
    });
  },

  /**
   * Save complete workflow with nodes and edges
   */
  async saveWorkflowComplete(
    workflowId: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      nodes: Array<{
        nodeId: string;
        type: string;
        positionX: number;
        positionY: number;
        label: string;
        description?: string;
        icon?: string;
        data?: any;
      }>;
      edges: Array<{
        edgeId: string;
        source: string;
        target: string;
        sourceHandle?: string;
        targetHandle?: string;
        animated?: boolean;
        style?: any;
      }>;
    }
  ) {
    // Verify ownership
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      select: { userId: true },
    });

    if (!workflow || workflow.userId !== userId) {
      throw new Error('Workflow not found or unauthorized');
    }

    return await prisma.$transaction(async (tx) => {
      // Update workflow metadata if provided
      if (data.name || data.description) {
        await tx.workflow.update({
          where: { id: workflowId },
          data: {
            name: data.name,
            description: data.description,
            updatedAt: new Date(),
          },
        });
      }

      // Delete existing nodes and edges
      await tx.node.deleteMany({
        where: { workflowId },
      });
      await tx.edge.deleteMany({
        where: { workflowId },
      });

      // Create new nodes
      if (data.nodes.length > 0) {
        await tx.node.createMany({
          data: data.nodes.map((node) => ({
            workflowId,
            nodeId: node.nodeId,
            type: node.type,
            positionX: node.positionX,
            positionY: node.positionY,
            label: node.label,
            description: node.description,
            icon: node.icon,
            data: node.data ? JSON.parse(JSON.stringify(node.data)) : undefined,
          })),
        });
      }

      // Create new edges
      if (data.edges.length > 0) {
        await tx.edge.createMany({
          data: data.edges.map((edge) => ({
            workflowId,
            edgeId: edge.edgeId,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle,
            animated: edge.animated || false,
            style: edge.style ? JSON.parse(JSON.stringify(edge.style)) : undefined,
          })),
        });
      }

      // Return updated workflow
      return await tx.workflow.findUnique({
        where: { id: workflowId },
        include: {
          nodes: true,
          edges: true,
        },
      });
    });
  },

  /**
   * Get public workflows
   */
  async getPublicWorkflows(limit: number = 10): Promise<WorkflowWithCounts[]> {
    return await prisma.workflow.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        userId: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            nodes: true,
            edges: true,
          },
        },
      },
    });
  },

  /**
   * Duplicate a workflow
   */
  async duplicateWorkflow(
    workflowId: string,
    userId: string,
    newName?: string
  ) {
    const originalWorkflow = await this.getWorkflowById(workflowId, userId);

    if (!originalWorkflow) {
      throw new Error('Workflow not found or unauthorized');
    }

    return await prisma.$transaction(async (tx) => {
      // Create new workflow
      const newWorkflow = await tx.workflow.create({
        data: {
          name: newName || `${originalWorkflow.name} (Copy)`,
          description: originalWorkflow.description,
          isPublic: false,
          userId,
        },
      });

      // Copy nodes
      if (originalWorkflow.nodes.length > 0) {
        await tx.node.createMany({
          data: originalWorkflow.nodes.map((node) => ({
            workflowId: newWorkflow.id,
            nodeId: node.nodeId,
            type: node.type,
            positionX: node.positionX,
            positionY: node.positionY,
            label: node.label,
            description: node.description,
            icon: node.icon,
            data: node.data || undefined,
          })),
        });
      }

      // Copy edges
      if (originalWorkflow.edges.length > 0) {
        await tx.edge.createMany({
          data: originalWorkflow.edges.map((edge) => ({
            workflowId: newWorkflow.id,
            edgeId: edge.edgeId,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle,
            animated: edge.animated,
            style: edge.style || undefined,
          })),
        });
      }

      return await tx.workflow.findUnique({
        where: { id: newWorkflow.id },
        include: {
          nodes: true,
          edges: true,
        },
      });
    });
  },
};
