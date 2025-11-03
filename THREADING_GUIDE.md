# Multi-Node Threading & Branching System

## Overview

NodeFlow now supports **Multi-Node Threading**, allowing a single node to connect to multiple child nodes, creating complex branching workflows and parallel execution paths.

## Key Features

### 🌳 Multi-Branch Connections

- **One-to-Many**: A single parent node can connect to multiple child nodes
- **Many-to-One**: Multiple parent nodes can connect to a single child node
- **Complex Flows**: Create parallel paths, decision trees, and merge points

### 📊 Real-Time Relationship Tracking

The system automatically tracks and displays:

- **Parent Nodes**: All nodes feeding into the current node
- **Child Nodes**: All nodes the current node connects to
- **Connection Counts**: Visual badges showing parent/child counts
- **Branching Statistics**: Total branching nodes in workflow

### 🎯 Visual Indicators

#### On Nodes

Each node displays badges showing:

- **↑ N** - Number of parent connections (incoming)
- **↓ N** - Number of child connections (outgoing)

#### In Properties Panel

When a node is selected, see:

- Full list of parent nodes with types
- Full list of child nodes with types
- Quick thread connection dialog

## How to Use

### Method 1: Drag & Drop Connections

1. **Select Source Node**: Click on any node
2. **Drag from Handle**: Click and drag from the bottom handle (●)
3. **Connect to Target**: Drop on the top handle of another node
4. **Repeat**: Drag multiple connections from the same source node

### Method 2: Quick Connect Dialog (Recommended)

1. **Select a Node**: Click on the node you want to connect from
2. **Open Quick Connect**: In the right sidebar, click **"Connect to Multiple Nodes"**
3. **Select Targets**: Click on nodes in the dialog to toggle connections
   - **Green Connected Badge**: Node is already connected
   - **Gray Dot**: Click to connect
4. **Toggle Connections**: Click connected nodes to disconnect them
5. **Changes Apply Immediately**: No need to save or confirm

### Example Use Cases

#### 1. Decision Tree

```
Start Node
    ↓
Decision: Check User Type
    ├→ Premium User Flow
    ├→ Free User Flow
    └→ Trial User Flow
```

#### 2. Parallel Processing

```
Data Ingestion
    ├→ Validate Format
    ├→ Check Duplicates
    └→ Log Entry
        ↓
    Merge Results
```

#### 3. Fan-Out & Fan-In

```
Main Process
    ├→ Email Notification
    ├→ SMS Notification
    ├→ Push Notification
    └→ Webhook Trigger
        ↓
    Track Completion
```

#### 4. Multi-Stage Approval

```
Submit Request
    ├→ Manager Approval
    └→ Finance Review
        ↓
    Final Decision
```

## Properties Panel Features

### Node Properties Section

Shows for selected node:

- **Node Type**: custom, process, decision, start, end
- **Node ID**: Unique identifier
- **Name**: Display label
- **Work Assignment**: Description of work
- **Position**: X, Y coordinates

### Relationships Section

- **Parent Nodes (N)**:
  - Lists all nodes connecting TO this node
  - Shows node name and type badge
  - Empty state: "No parent nodes"
- **Child Nodes (N)**:

  - Lists all nodes this node connects TO
  - Shows node name and type badge
  - Empty state: "No child nodes"

- **Quick Connect Button**:
  - Opens dialog to manage multiple connections
  - Toggle connections on/off with single clicks
  - Real-time visual feedback

### Workflow Info Section

Shows overall statistics:

- **Total Nodes**: Count of all nodes in workflow
- **Connections**: Count of all edges/connections
- **Custom Nodes**: Count of user-created custom nodes
- **Branching Nodes**: Count of nodes with 2+ child connections
- **Status**: Active/Empty workflow state

## Technical Details

### Data Structure

#### Node Data with Counts

```typescript
{
  id: "1",
  type: "custom",
  position: { x: 100, y: 100 },
  data: {
    label: "Process Task",
    description: "Work description",
    icon: "Database",
    parentCount: 2,    // Auto-calculated
    childCount: 3      // Auto-calculated
  }
}
```

#### Edge/Connection

```typescript
{
  id: "e1-2",
  source: "1",        // Parent node ID
  target: "2",        // Child node ID
  animated: true,
  style: { stroke: "#71717a" }
}
```

#### Relationship Tracking

```typescript
nodeRelationships = {
  "1": {
    parents: ["0"], // IDs of parent nodes
    children: ["2", "3", "4"], // IDs of child nodes
  },
  "2": {
    parents: ["1"],
    children: ["5"],
  },
};
```

### Auto-Update System

The system uses React `useEffect` to:

1. **Monitor edge changes** in real-time
2. **Rebuild relationships** whenever connections change
3. **Update node data** with parent/child counts
4. **Trigger re-renders** to show updated badges

```typescript
useEffect(() => {
  // Rebuild relationships from edges
  const relationships = buildRelationshipsFromEdges();

  // Update node data with counts
  updateNodesWithCounts(relationships);
}, [edges]);
```

## Benefits

✅ **Visual Clarity**: See connection counts at a glance  
✅ **Easy Threading**: Connect one node to many with simple UI  
✅ **Complex Workflows**: Build sophisticated decision trees  
✅ **Parallel Paths**: Create concurrent execution flows  
✅ **Merge Points**: Combine multiple paths into one  
✅ **Real-Time Updates**: Changes reflect immediately  
✅ **Undo/Disconnect**: Easy to remove connections  
✅ **Relationship Visibility**: See all parents and children

## Best Practices

### 1. Use Branching Nodes Wisely

- **Decision Node**: For conditional branching (if/else)
- **Custom Node**: For parallel processing tasks
- **Process Node**: For sequential steps with multiple outputs

### 2. Label Connections Clearly

- Name nodes descriptively to show their role in the branch
- Use work assignments to explain branch logic

### 3. Avoid Deep Nesting

- Keep branching depth manageable (3-4 levels max)
- Use sub-workflows for complex nested logic

### 4. Document Branch Logic

- Use node descriptions to explain why branching occurs
- Mention conditions that trigger each branch

### 5. Test Thread Flows

- Trace through each branch path mentally
- Ensure all branches eventually merge or end

## Advanced Patterns

### Conditional Fan-Out

One node branches based on conditions:

```
Check Status → [Active → Process A]
              [Inactive → Process B]
              [Pending → Process C]
```

### Parallel Processing

One node triggers multiple simultaneous tasks:

```
Start Task → [Task A]
            [Task B]  (All run in parallel)
            [Task C]
```

### Convergence Pattern

Multiple branches merge to one:

```
[Path A] →
[Path B] → Merge Point → Continue
[Path C] →
```

### Diamond Pattern

Branch out and back in:

```
Start → Branch Point → [Option A] →
                      [Option B] → Merge Point → End
```

## Troubleshooting

### Q: Connections don't appear?

A: Make sure you're dragging from the **bottom handle** (source) to a **top handle** (target).

### Q: Can't see parent/child counts?

A: Counts only appear after connections are made. The system updates automatically.

### Q: Quick Connect dialog empty?

A: You need at least 2 nodes in the workflow. The selected node won't appear in its own list.

### Q: How to disconnect nodes?

A: Use the Quick Connect dialog and click connected nodes to toggle them off, or delete the edge directly.

---

**Multi-threading makes NodeFlow powerful for complex workflows!** 🚀
