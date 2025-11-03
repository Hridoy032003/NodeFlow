# React Hooks Usage Guide

This guide shows how to use the custom React hooks in your NodeFlow application.

## useWorkflows Hook

The `useWorkflows` hook manages the list of workflows for the current user.

### Basic Usage

```tsx
import { useWorkflows } from "@/lib/hooks";

function WorkflowsList() {
  const { workflows, isLoading, isError, error } = useWorkflows();

  if (isLoading) {
    return <div>Loading workflows...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div>
      {workflows.map((workflow) => (
        <div key={workflow.id}>
          <h3>{workflow.name}</h3>
          <p>{workflow.description}</p>
          <small>
            Nodes: {workflow._count.nodes} | Edges: {workflow._count.edges}
          </small>
        </div>
      ))}
    </div>
  );
}
```

### Creating a Workflow

```tsx
import { useWorkflows } from "@/lib/hooks";
import { useState } from "react";

function CreateWorkflowButton() {
  const { createWorkflow } = useWorkflows();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const newWorkflow = await createWorkflow({
        name: "New Workflow",
        description: "My workflow description",
      });
      console.log("Created:", newWorkflow);
      // Navigate to editor with new workflow
      router.push(`/editor?workflow=${newWorkflow.id}`);
    } catch (error) {
      console.error("Failed to create workflow:", error);
      alert("Failed to create workflow");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button onClick={handleCreate} disabled={isCreating}>
      {isCreating ? "Creating..." : "Create Workflow"}
    </button>
  );
}
```

### Deleting a Workflow

```tsx
import { useWorkflows } from "@/lib/hooks";

function WorkflowCard({ workflow }) {
  const { deleteWorkflow } = useWorkflows();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this workflow?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteWorkflow(workflow.id);
      // List will automatically update due to optimistic update
    } catch (error) {
      console.error("Failed to delete workflow:", error);
      alert("Failed to delete workflow");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <h3>{workflow.name}</h3>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
```

### Manual Revalidation

```tsx
import { useWorkflows } from "@/lib/hooks";

function WorkflowsHeader() {
  const { workflows, isLoading, mutate } = useWorkflows();

  const handleRefresh = () => {
    mutate(); // Manually revalidate the workflows list
  };

  return (
    <div>
      <h1>My Workflows ({workflows.length})</h1>
      <button onClick={handleRefresh} disabled={isLoading}>
        {isLoading ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}
```

---

## useWorkflow Hook

The `useWorkflow` hook manages a single workflow with its nodes and edges.

### Basic Usage

```tsx
import { useWorkflow } from "@/lib/hooks";
import { useSearchParams } from "next/navigation";

function WorkflowEditor() {
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("workflow");

  const { workflow, isLoading, isError, error } = useWorkflow(workflowId);

  if (!workflowId) {
    return <div>No workflow selected</div>;
  }

  if (isLoading) {
    return <div>Loading workflow...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return (
    <div>
      <h1>{workflow.workflow.name}</h1>
      <p>{workflow.workflow.description}</p>
      <div>
        <p>Nodes: {workflow.nodes.length}</p>
        <p>Edges: {workflow.edges.length}</p>
      </div>
    </div>
  );
}
```

### Saving Workflow with Nodes and Edges

```tsx
import { useWorkflow } from '@/lib/hooks';
import { useCallback } from 'react';
import { useNodes, useEdges } from '@xyflow/react';

function WorkflowEditor() {
  const workflowId = /* get from URL */;
  const { saveWorkflow, isSaving } = useWorkflow(workflowId);

  const [nodes] = useNodes();
  const [edges] = useEdges();

  const handleSave = useCallback(async () => {
    try {
      await saveWorkflow({
        nodes,
        edges,
      });
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Failed to save workflow:', error);
      alert('Failed to save workflow');
    }
  }, [nodes, edges, saveWorkflow]);

  return (
    <div>
      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Workflow'}
      </button>
    </div>
  );
}
```

### Auto-save Implementation

```tsx
import { useWorkflow } from '@/lib/hooks';
import { useEffect, useCallback } from 'react';
import { useNodes, useEdges } from '@xyflow/react';
import { debounce } from 'lodash';

function WorkflowEditor() {
  const workflowId = /* get from URL */;
  const { saveWorkflow, isSaving } = useWorkflow(workflowId);

  const [nodes] = useNodes();
  const [edges] = useEdges();

  // Debounced auto-save (waits 2 seconds after last change)
  const autoSave = useCallback(
    debounce(async (nodes, edges) => {
      try {
        await saveWorkflow({ nodes, edges });
        console.log('Auto-saved at', new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000),
    [saveWorkflow]
  );

  // Trigger auto-save when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      autoSave(nodes, edges);
    }
  }, [nodes, edges, autoSave]);

  return (
    <div>
      {isSaving && (
        <div className="save-indicator">
          Saving...
        </div>
      )}
    </div>
  );
}
```

### Updating Workflow Metadata

```tsx
import { useWorkflow } from "@/lib/hooks";
import { useState } from "react";

function WorkflowSettings({ workflowId }) {
  const { workflow, updateMetadata } = useWorkflow(workflowId);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (workflow) {
      setName(workflow.workflow.name);
      setDescription(workflow.workflow.description || "");
    }
  }, [workflow]);

  const handleSave = async () => {
    try {
      await updateMetadata({ name, description });
      alert("Settings saved!");
    } catch (error) {
      alert("Failed to save settings");
    }
  };

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Workflow name"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
```

### Complete Editor Example

```tsx
"use client";

import { useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import { useWorkflow } from "@/lib/hooks";
import { debounce } from "lodash";

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("workflow");

  const { workflow, isLoading, isSaving, saveWorkflow } =
    useWorkflow(workflowId);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Load workflow data when available
  useEffect(() => {
    if (workflow) {
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
    }
  }, [workflow, setNodes, setEdges]);

  // Auto-save debounced
  const autoSave = useCallback(
    debounce(async (nodes, edges) => {
      if (!workflowId) return;
      try {
        await saveWorkflow({ nodes, edges });
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 2000),
    [workflowId, saveWorkflow]
  );

  // Trigger auto-save on changes
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      autoSave(nodes, edges);
    }
  }, [nodes, edges, autoSave]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  if (!workflowId) {
    return <div>Please select a workflow</div>;
  }

  if (isLoading) {
    return <div>Loading workflow...</div>;
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {isSaving && (
        <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
          Saving...
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
```

---

## Best Practices

### 1. Error Handling

Always handle errors from async operations:

```tsx
try {
  await createWorkflow({ name: "New" });
} catch (error) {
  // Show user-friendly error message
  toast.error(error.message);
}
```

### 2. Loading States

Show loading indicators for better UX:

```tsx
{
  isLoading && <Spinner />;
}
{
  isSaving && <div>Saving...</div>;
}
```

### 3. Optimistic Updates

The hooks already implement optimistic updates for delete operations. The UI updates immediately while the request is in flight.

### 4. Debouncing

For auto-save, always debounce to avoid excessive API calls:

```tsx
import { debounce } from "lodash";

const autoSave = debounce(async () => {
  await saveWorkflow({ nodes, edges });
}, 2000); // Wait 2 seconds after last change
```

### 5. Cleanup

Cleanup debounced functions in useEffect:

```tsx
useEffect(() => {
  return () => {
    autoSave.cancel(); // Cancel pending saves on unmount
  };
}, [autoSave]);
```

---

## TypeScript Types

### WorkflowWithCounts

```typescript
type WorkflowWithCounts = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    nodes: number;
    edges: number;
  };
};
```

### WorkflowData

```typescript
type WorkflowData = {
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
};
```

---

## SWR Configuration

The hooks are configured with these SWR options:

- `revalidateOnFocus: false` - Don't refetch when tab regains focus
- `revalidateOnReconnect: true` - Refetch when internet connection is restored
- `refreshInterval: 0` - No automatic polling (manual refresh only)

You can customize these in the hook files if needed.
