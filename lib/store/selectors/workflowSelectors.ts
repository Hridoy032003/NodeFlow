import { selector } from 'recoil';
import { workflowNodesAtom, workflowEdgesAtom } from '../atoms/workflowAtoms';

export const nodeCountSelector = selector({
  key: 'nodeCount',
  get: ({ get }) => {
    const nodes = get(workflowNodesAtom);
    return nodes.length;
  },
});

export const edgeCountSelector = selector({
  key: 'edgeCount',
  get: ({ get }) => {
    const edges = get(workflowEdgesAtom);
    return edges.length;
  },
});

export const customNodeCountSelector = selector({
  key: 'customNodeCount',
  get: ({ get }) => {
    const nodes = get(workflowNodesAtom);
    return nodes.filter((n) => n.type === 'custom').length;
  },
});

export const nodeRelationshipsSelector = selector({
  key: 'nodeRelationships',
  get: ({ get }) => {
    const nodes = get(workflowNodesAtom);
    const edges = get(workflowEdgesAtom);

    const relationships: Record<string, { parents: string[]; children: string[] }> = {};

    // Initialize all nodes
    nodes.forEach(node => {
      relationships[node.id] = { parents: [], children: [] };
    });

    // Build relationships from edges
    edges.forEach(edge => {
      const parentId = edge.source;
      const childId = edge.target;

      if (relationships[parentId] && relationships[childId]) {
        relationships[parentId].children.push(childId);
        relationships[childId].parents.push(parentId);
      }
    });

    return relationships;
  },
});

export const rootNodesSelector = selector({
  key: 'rootNodes',
  get: ({ get }) => {
    const nodes = get(workflowNodesAtom);
    const relationships = get(nodeRelationshipsSelector);

    return nodes.filter(node => {
      const nodeRels = relationships[node.id];
      return nodeRels && nodeRels.parents.length === 0;
    });
  },
});
