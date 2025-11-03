# Nodes vs Edges in NodeFlow

## Overview

In your NodeFlow application, **Nodes** and **Edges** are the two fundamental building blocks that create workflow visualizations. They work together but serve completely different purposes.

---

## 🔵 NODES

### What Are Nodes?

**Nodes** are the **individual task boxes/elements** in your workflow. They represent **actions, decisions, or states** in your process.

### Node Structure

```typescript
const node: Node = {
  id: "1", // Unique identifier
  type: "custom", // Type of node (custom, process, decision, start, end)
  position: {
    // Where it appears on canvas
    x: 100,
    y: 100,
  },
  data: {
    // Node content/information
    label: "Process Order",
    description: "Validate and process customer order",
    icon: "ShoppingCart",
    parentCount: 1, // Number of incoming connections
    childCount: 2, // Number of outgoing connections
  },
};
```

### Node Types in Your Application

1. **Custom Node** (`custom`)

   - User-created nodes with custom icons
   - Flexible for any workflow task
   - Example: "Send Email", "Update Database", "Call API"

2. **Process Node** (`process`)

   - Standard action/task nodes
   - Represents work being performed
   - Icon: Settings gear
   - Example: "Process Payment", "Generate Report"

3. **Decision Node** (`decision`)

   - Conditional branching points
   - Has multiple output paths (true/false)
   - Icon: GitBranch
   - Example: "Is Payment Valid?", "Check Inventory?"

4. **Start Node** (`start`)

   - Entry point of workflow
   - Only has outputs, no inputs
   - Icon: Play button
   - Example: "Begin Workflow"

5. **End Node** (`end`)
   - Terminal point of workflow
   - Only has inputs, no outputs
   - Icon: Square
   - Example: "Workflow Complete"

### Node Visual Example

```
┌─────────────────────────┐
│  📦 Process Order       │  ← This is a NODE
│  ─────────────────      │
│  Validate and process   │
│  customer order         │
│  ↑1  ↓2                │  ← Parent/Child counts
└─────────────────────────┘
```

### What Nodes Contain

- **Visual Representation**: The box you see and drag around
- **Position**: X, Y coordinates on the canvas
- **Type**: Which component renders it
- **Data**:
  - Label (title)
  - Description (details)
  - Icon (visual identifier)
  - Relationship counts (parents/children)
- **Handles**: Connection points (top = input, bottom = output)

### Node Operations

```typescript
// CREATE a new node
const newNode: Node = {
  id: `${nodes.length + 1}`,
  type: "custom",
  position: { x: 100, y: 100 },
  data: { label: "New Task", description: "Work here" },
};
setNodes((nds) => [...nds, newNode]);

// DELETE a node
setNodes((nds) => nds.filter((n) => n.id !== nodeId));

// UPDATE a node
setNodes((nds) =>
  nds.map((n) =>
    n.id === nodeId ? { ...n, data: { ...n.data, label: "Updated" } } : n
  )
);

// DUPLICATE a node
const duplicate = { ...node, id: `${nodes.length + 1}` };
setNodes((nds) => [...nds, duplicate]);
```

---

## 🔗 EDGES

### What Are Edges?

**Edges** are the **connecting lines/arrows** between nodes. They represent **flow, sequence, or relationships** in your workflow. They show **how data/control moves** from one task to another.

### Edge Structure

```typescript
const edge: Edge = {
  id: "e1-2", // Unique identifier (usually "e{source}-{target}")
  source: "1", // ID of the starting node
  target: "2", // ID of the ending node
  animated: true, // Whether the line animates
  style: {
    // Visual styling
    stroke: "#71717a", // Line color
    strokeWidth: 2, // Line thickness
  },
  sourceHandle: "bottom", // Which handle on source node
  targetHandle: "top", // Which handle on target node
};
```

### Edge Visual Example

```
┌──────────────┐
│  Start       │
└──────┬───────┘
       │  ← This connecting line is an EDGE
       ↓
┌──────────────┐
│  Process     │
└──────────────┘
```

### What Edges Represent

- **Workflow Flow**: Order of execution (A → B → C)
- **Data Flow**: Where data passes between tasks
- **Dependencies**: Which tasks depend on others
- **Decision Paths**: Different routes through workflow
- **Relationships**: Parent-child connections between tasks

### Edge Operations

```typescript
// CREATE an edge (connect two nodes)
const onConnect = (params: Connection) => {
  const edge = {
    ...params,
    animated: true,
    style: { stroke: "#71717a" },
  };
  setEdges((eds) => addEdge(edge, eds));
};

// DELETE an edge
setEdges((eds) => eds.filter((e) => e.id !== edgeId));

// DELETE all edges connected to a node
setEdges((eds) =>
  eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
);

// UPDATE edge style
setEdges((eds) =>
  eds.map((e) =>
    e.id === edgeId ? { ...e, animated: false, style: { stroke: "red" } } : e
  )
);
```

### Edge Types in Decision Nodes

Decision nodes can have **multiple output edges** with different meanings:

```typescript
<Handle
  type="source"
  position={Position.Bottom}
  id="true"                    // True path
  style={{ left: "30%" }}
/>
<Handle
  type="source"
  position={Position.Bottom}
  id="false"                   // False path
  style={{ left: "70%" }}
/>
```

Visual example:

```
    ┌──────────────┐
    │  Decision:   │
    │  Is Valid?   │
    └──┬────────┬──┘
       │        │
    TRUE│      │FALSE  ← Two different edges
       ↓        ↓
   ┌─────┐  ┌─────┐
   │Yes  │  │No   │
   └─────┘  └─────┘
```

---

## 🔄 How They Work Together

### Relationship Tracking

Your application tracks relationships through edges:

```typescript
useEffect(() => {
  const relationships = {};

  // Initialize all nodes
  nodes.forEach((node) => {
    relationships[node.id] = { parents: [], children: [] };
  });

  // Build relationships from edges
  edges.forEach((edge) => {
    // Edge connects source node to target node
    relationships[edge.source].children.push(edge.target); // source is parent
    relationships[edge.target].parents.push(edge.source); // target is child
  });

  // Update node data with counts
  setNodes((nds) =>
    nds.map((node) => ({
      ...node,
      data: {
        ...node.data,
        parentCount: relationships[node.id]?.parents.length || 0,
        childCount: relationships[node.id]?.children.length || 0,
      },
    }))
  );
}, [edges]);
```

### Complete Workflow Example

```typescript
// NODES (The tasks)
const nodes = [
  { id: "1", type: "start", data: { label: "Start" } },
  { id: "2", type: "process", data: { label: "Validate Order" } },
  { id: "3", type: "decision", data: { label: "Is Valid?" } },
  { id: "4", type: "process", data: { label: "Process Payment" } },
  { id: "5", type: "process", data: { label: "Send Error" } },
  { id: "6", type: "end", data: { label: "End" } },
];

// EDGES (The flow/connections)
const edges = [
  { id: "e1-2", source: "1", target: "2" }, // Start → Validate
  { id: "e2-3", source: "2", target: "3" }, // Validate → Decision
  { id: "e3-4", source: "3", target: "4", sourceHandle: "true" }, // Valid → Process
  { id: "e3-5", source: "3", target: "5", sourceHandle: "false" }, // Invalid → Error
  { id: "e4-6", source: "4", target: "6" }, // Process → End
  { id: "e5-6", source: "5", target: "6" }, // Error → End
];
```

Visual representation:

```
        ┌───────┐
        │ Start │ (Node 1)
        └───┬───┘
            │ (Edge e1-2)
            ↓
    ┌───────────────┐
    │ Validate Order│ (Node 2)
    └───────┬───────┘
            │ (Edge e2-3)
            ↓
    ┌───────────────┐
    │  Is Valid?    │ (Node 3 - Decision)
    └───┬───────┬───┘
        │       │
     TRUE│      │FALSE (Edges e3-4 and e3-5)
        ↓       ↓
┌──────────┐  ┌──────────┐
│ Process  │  │Send Error│ (Nodes 4 and 5)
│ Payment  │  │          │
└────┬─────┘  └────┬─────┘
     │             │ (Edges e4-6 and e5-6)
     └──────┬──────┘
            ↓
        ┌───────┐
        │  End  │ (Node 6)
        └───────┘
```

---

## 📊 Key Differences Summary

| Aspect               | NODES                                 | EDGES                                  |
| -------------------- | ------------------------------------- | -------------------------------------- |
| **What**             | Task boxes/elements                   | Connecting lines                       |
| **Represents**       | Actions, decisions, states            | Flow, sequence, relationships          |
| **Visual**           | Rectangle with content                | Line with arrow                        |
| **Contains**         | Label, description, icon, data        | Source, target, style                  |
| **Position**         | X, Y coordinates                      | Connects two positions                 |
| **Can be**           | Created, deleted, duplicated, moved   | Created, deleted, styled               |
| **Types**            | custom, process, decision, start, end | Single connection type (with variants) |
| **User Interaction** | Click, drag, select, edit             | Draw by dragging from handle           |

---

## 🎯 Practical Understanding

### Think of it like a flowchart:

- **Nodes** = The boxes with text/actions
- **Edges** = The arrows connecting the boxes

### Or like a map:

- **Nodes** = The cities/destinations
- **Edges** = The roads connecting them

### Or like a family tree:

- **Nodes** = The people
- **Edges** = The relationships (parent-child connections)

---

## 🔧 In Your Application

### Creating a Workflow:

1. **Add Nodes** - User creates task boxes

   - Click "New Custom Node"
   - Select from palette (Process, Decision, etc.)
   - Drag onto canvas

2. **Connect with Edges** - User draws connections

   - Drag from bottom handle of one node
   - Drop on top handle of another node
   - Creates automatic edge

3. **Build Logic** - Nodes + Edges = Complete workflow
   - Nodes define WHAT happens
   - Edges define WHEN/HOW it flows

### Multi-Threading Feature:

Your "Connect to Multiple Nodes" feature creates **multiple edges** from **one node**:

```typescript
// One parent node connects to multiple children
const parentNode = { id: "1", data: { label: "Fan Out" } };

// Creates multiple edges
const edges = [
  { id: "e1-2", source: "1", target: "2" }, // Parent → Child 1
  { id: "e1-3", source: "1", target: "3" }, // Parent → Child 2
  { id: "e1-4", source: "1", target: "4" }, // Parent → Child 3
];

// Result: Node 1 has childCount = 3
// Nodes 2, 3, 4 each have parentCount = 1
```

---

## 💡 Summary

**NODES** are the **elements** that do work.  
**EDGES** are the **connections** that define flow.

Together they create a complete workflow visualization where:

- Nodes = Steps in your process
- Edges = Order/sequence of execution

Without nodes → No tasks to perform  
Without edges → No flow/relationship between tasks  
With both → Complete workflow! 🎉
