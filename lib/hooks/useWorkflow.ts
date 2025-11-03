import useSWR from 'swr';
import { useCallback, useState } from 'react';
import { Node, Edge } from '@xyflow/react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface WorkflowData {
  workflow: {
    id: string;
    name: string;
    description: string | null;
    userId: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  nodes: Node[];
  edges: Edge[];
}

interface UseWorkflowResult {
  workflow: WorkflowData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  isSaving: boolean;
  mutate: () => void;
  saveWorkflow: (data: { 
    name?: string; 
    description?: string; 
    nodes: Node[]; 
    edges: Edge[] 
  }) => Promise<void>;
  updateMetadata: (data: { name?: string; description?: string }) => Promise<void>;
}

export function useWorkflow(workflowId: string | null): UseWorkflowResult {
  const [isSaving, setIsSaving] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<WorkflowData>(
    workflowId ? `/api/workflows/${workflowId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 0, 
    }
  );

  const saveWorkflow = useCallback(
    async (saveData: { 
      name?: string; 
      description?: string; 
      nodes: Node[]; 
      edges: Edge[] 
    }): Promise<void> => {
      if (!workflowId) {
        throw new Error('No workflow ID provided');
      }

      setIsSaving(true);

      try {
        const response = await fetch(`/api/workflows/${workflowId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: saveData.name || data?.workflow.name,
            description: saveData.description ?? data?.workflow.description,
            nodes: saveData.nodes,
            edges: saveData.edges,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save workflow');
        }

        // Revalidate the workflow data
        await mutate();
      } catch (error) {
        console.error('Error saving workflow:', error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [workflowId, data, mutate]
  );

  const updateMetadata = useCallback(
    async (metadata: { name?: string; description?: string }): Promise<void> => {
      if (!workflowId || !data) {
        throw new Error('No workflow data available');
      }

      await saveWorkflow({
        ...metadata,
        nodes: data.nodes,
        edges: data.edges,
      });
    },
    [workflowId, data, saveWorkflow]
  );

  return {
    workflow: data,
    isLoading,
    isError: !!error,
    error,
    isSaving,
    mutate,
    saveWorkflow,
    updateMetadata,
  };
}
