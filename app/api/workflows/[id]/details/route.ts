import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/workflows/[id]/details - Update workflow name and description
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const workflow = await prisma.workflow.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found or unauthorized' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, isPublic } = body;

    const updatedWorkflow = await prisma.workflow.update({
      where: { id: id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic }),
      },
    });

    return NextResponse.json(updatedWorkflow);
  } catch (error) {
    console.error('Error updating workflow details:', error);
    return NextResponse.json(
      { error: 'Failed to update workflow details' },
      { status: 500 }
    );
  }
}
