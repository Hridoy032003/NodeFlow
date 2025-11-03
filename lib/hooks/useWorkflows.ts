import useSWR from 'swr';
import { WorkflowWithCounts } from '@/lib/dal';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseWorkflowsResult {
  workflows: WorkflowWithCounts[];
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  mutate: () => void;
  createWorkflow: (data: { name: string; description?: string; isPublic?: boolean }) => Promise<WorkflowWithCounts>;
  deleteWorkflow: (id: string) => Promise<void>;
  updateWorkflowVisibility: (id: string, isPublic: boolean) => Promise<void>;
}

export function useWorkflows(): UseWorkflowsResult {
  const { data, error, isLoading, mutate } = useSWR<WorkflowWithCounts[]>(
    '/api/workflows',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const createWorkflow = async (workflowData: { name: string; description?: string; isPublic?: boolean }): Promise<WorkflowWithCounts> => {
    const response = await fetch('/api/workflows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflowData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create workflow');
    }

    const newWorkflow = await response.json();
    
    // Optimistic update
    mutate();
    
    return newWorkflow;
  };

  const deleteWorkflow = async (id: string): Promise<void> => {
    const response = await fetch(`/api/workflows/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete workflow');
    }

    // Optimistic update - remove from local cache
    mutate(
      (currentWorkflows) => currentWorkflows?.filter((w) => w.id !== id),
      false
    );
  };

  const updateWorkflowVisibility = async (id: string, isPublic: boolean): Promise<void> => {
    const previousData = data
      ? data.map((workflow) => ({ ...workflow }))
      : undefined;

    mutate(
      (currentWorkflows) =>
        currentWorkflows?.map((workflow) =>
          workflow.id === id ? { ...workflow, isPublic } : workflow
        ) ?? [],
      false
    );

    const response = await fetch(`/api/workflows/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isPublic }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      mutate(previousData, false);
      throw new Error(errorData.error || 'Failed to update workflow visibility');
    }

    await mutate();
  };

  return {
    workflows: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
    createWorkflow,
    deleteWorkflow,
    updateWorkflowVisibility,
  };
}
