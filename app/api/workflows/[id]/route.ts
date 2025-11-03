import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { userDAL, workflowDAL } from '@/lib/dal';

// GET /api/workflows/[id] - Get specific workflow with nodes and edges
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await userDAL.getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const workflow = await workflowDAL.getWorkflowById(id, user.id);

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    // Convert database nodes to React Flow format
    const nodes = workflow.nodes.map((node) => ({
      id: node.nodeId,
      type: node.type,
      position: { x: node.positionX, y: node.positionY },
      data: {
        label: node.label,
        description: node.description,
        icon: node.icon,
        ...((node.data as any) || {}),
      },
    }));

    // Convert database edges to React Flow format
    const edges = workflow.edges.map((edge) => ({
      id: edge.edgeId,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      animated: edge.animated,
      style: (edge.style as any) || {},
    }));

    return NextResponse.json({
      workflow: {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        userId: workflow.userId,
        isPublic: workflow.isPublic,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
      },
      nodes,
      edges,
    });
  } catch (error) {
    console.error('Error fetching workflow:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
      { status: 500 }
    );
  }
}

// PUT /api/workflows/[id] - Update workflow (save nodes and edges)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await userDAL.getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, nodes, edges } = body;

    // Prepare nodes data
    const nodesData = nodes?.map((node: any) => ({
      nodeId: node.id,
      type: node.type,
      positionX: node.position.x,
      positionY: node.position.y,
      label: node.data.label || 'Untitled',
      description: node.data.description,
      icon: node.data.icon,
      data: node.data,
    })) || [];

    // Prepare edges data
    const edgesData = edges?.map((edge: any) => ({
      edgeId: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      animated: edge.animated || false,
      style: edge.style || {},
    })) || [];

    const updatedWorkflow = await workflowDAL.saveWorkflowComplete(
      id,
      user.id,
      {
        name,
        description,
        nodes: nodesData,
        edges: edgesData,
      }
    );

    return NextResponse.json(updatedWorkflow);
  } catch (error) {
    console.error('Error updating workflow:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update workflow';
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message.includes('unauthorized') ? 403 : 500 }
    );
  }
}

// DELETE /api/workflows/[id] - Delete workflow
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await userDAL.getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await workflowDAL.deleteWorkflow(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete workflow';
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message.includes('unauthorized') ? 403 : 500 }
    );
  }
}
