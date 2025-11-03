import { useSetRecoilState, useRecoilValue } from 'recoil';
import {
  currentWorkflowAtom,
  workflowNodesAtom,
  workflowEdgesAtom,
  isSavingAtom,
  Workflow,
} from '../store/atoms/workflowAtoms';
import { Node, Edge } from '@xyflow/react';
import { useState } from 'react';

export function useWorkflowOperations() {
  const setCurrentWorkflow = useSetRecoilState(currentWorkflowAtom);
  const setNodes = useSetRecoilState(workflowNodesAtom);
  const setEdges = useSetRecoilState(workflowEdgesAtom);
  const setIsSaving = useSetRecoilState(isSavingAtom);
  const currentWorkflow = useRecoilValue(currentWorkflowAtom);
  const nodes = useRecoilValue(workflowNodesAtom);
  const edges = useRecoilValue(workflowEdgesAtom);

  const [error, setError] = useState<string | null>(null);

  const createWorkflow = async (name: string, description?: string) => {
    try {
      setError(null);
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create workflow');
      }

      const workflow = await response.json();
      setCurrentWorkflow(workflow);
      setNodes([]);
      setEdges([]);
      return workflow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const loadWorkflow = async (workflowId: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/workflows/${workflowId}`);

      if (!response.ok) {
        throw new Error('Failed to load workflow');
      }

      const data = await response.json();
      setCurrentWorkflow(data.workflow);
      setNodes(data.nodes);
      setEdges(data.edges);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const saveWorkflow = async () => {
    if (!currentWorkflow) {
      throw new Error('No workflow loaded');
    }

    try {
      setError(null);
      setIsSaving(true);

      const response = await fetch(`/api/workflows/${currentWorkflow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodes,
          edges,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save workflow');
      }

      const updatedWorkflow = await response.json();
      setCurrentWorkflow(updatedWorkflow);
      return updatedWorkflow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete workflow');
      }

      if (currentWorkflow?.id === workflowId) {
        setCurrentWorkflow(null);
        setNodes([]);
        setEdges([]);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateWorkflowDetails = async (name: string, description?: string) => {
    if (!currentWorkflow) {
      throw new Error('No workflow loaded');
    }

    try {
      setError(null);
      const response = await fetch(`/api/workflows/${currentWorkflow.id}/details`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update workflow');
      }

      const updated = await response.json();
      setCurrentWorkflow(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    createWorkflow,
    loadWorkflow,
    saveWorkflow,
    deleteWorkflow,
    updateWorkflowDetails,
    error,
  };
}
