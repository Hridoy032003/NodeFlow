import { atom } from 'recoil';
import { Node, Edge } from '@xyflow/react';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export const currentWorkflowAtom = atom<Workflow | null>({
  key: 'currentWorkflow',
  default: null,
});

export const workflowNodesAtom = atom<Node[]>({
  key: 'workflowNodes',
  default: [],
});

export const workflowEdgesAtom = atom<Edge[]>({
  key: 'workflowEdges',
  default: [],
});

export const selectedNodeAtom = atom<Node | null>({
  key: 'selectedNode',
  default: null,
});

export const isLoadingAtom = atom<boolean>({
  key: 'isLoading',
  default: false,
});

export const isSavingAtom = atom<boolean>({
  key: 'isSaving',
  default: false,
});

export const workflowListAtom = atom<Workflow[]>({
  key: 'workflowList',
  default: [],
});
