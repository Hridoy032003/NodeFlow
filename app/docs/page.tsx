"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Workflow,
  Play,
  Settings,
  GitBranch,
  Square,
  Plus,
  ArrowDown,
  ArrowUp,
  Network,
  Save,
  Download,
  Upload,
  Copy,
  Trash2,
  Eraser,
  PanelLeftClose,
  PanelRightClose,
  ChevronRight,
  BookOpen,
  Zap,
  Boxes,
  TreePine,
  Keyboard,
  FileJson,
} from "lucide-react";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center">
              <Workflow className="w-5 h-5 text-background" />
            </div>
            <span className="text-lg font-semibold">NodeFlow</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
            <Link href="/editor">
              <Button>
                <Play className="w-4 h-4 mr-2" />
                Open Editor
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted border-2 flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-4">NodeFlow Documentation</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete guide to building powerful workflows with parent-child tree hierarchies
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-7 h-7" />
            Quick Start
          </h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-md bg-muted border flex items-center justify-center shrink-0 font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Create Custom Nodes</h3>
                  <p className="text-muted-foreground">
                    Click the "New Custom Node" button in the left sidebar. Give your node a name,
                    choose an icon, and describe the work it performs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-md bg-muted border flex items-center justify-center shrink-0 font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Connect Nodes</h3>
                  <p className="text-muted-foreground">
                    Drag from the bottom handle (dot) of one node to the top handle of another
                    to create connections and build parent-child relationships.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-md bg-muted border flex items-center justify-center shrink-0 font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">View Hierarchy</h3>
                  <p className="text-muted-foreground">
                    Check the right sidebar to see your workflow's tree structure, parent-child
                    relationships, and use keyboard shortcuts for faster editing.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Node Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Boxes className="w-7 h-7" />
            Node Types
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Start Node */}
            <Card className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-muted border flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Start Node</h3>
                  <Badge variant="secondary" className="text-xs mt-1">Template</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Marks the beginning of your workflow. Every workflow should start with this node.
              </p>
              <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                <strong>Handles:</strong> 1 output (bottom)
              </div>
            </Card>

            {/* Process Node */}
            <Card className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-md bg-muted border flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Process Node</h3>
                  <Badge variant="secondary" className="text-xs mt-1">Template</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Represents an action or processing step in your workflow. Use for tasks that transform data.
              </p>
              <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                <strong>Handles:</strong> 1 input (top), 1 output (bottom)
              </div>
            </Card>

            {/* Decision Node */}
            <Card className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-md bg-muted border flex items-center justify-center shrink-0">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Decision Node</h3>
                  <Badge variant="secondary" className="text-xs mt-1">Template</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Creates conditional branches in your workflow. Has two outputs for different paths.
              </p>
              <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                <strong>Handles:</strong> 1 input (top), 2 outputs (bottom - true/false)
              </div>
            </Card>

            {/* End Node */}
            <Card className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-muted border flex items-center justify-center shrink-0">
                  <Square className="w-5 h-5 fill-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">End Node</h3>
                  <Badge variant="secondary" className="text-xs mt-1">Template</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Marks the completion of your workflow. Use to indicate where a process finishes.
              </p>
              <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                <strong>Handles:</strong> 1 input (top)
              </div>
            </Card>

            {/* Custom Node */}
            <Card className="p-5 md:col-span-2 border-2">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-md bg-muted border flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Custom Node</h3>
                  <Badge className="text-xs mt-1">Your Creation</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Create your own nodes with custom names, icons, and work descriptions.
                Perfect for specific tasks unique to your workflow.
              </p>
              <div className="bg-muted/50 p-3 rounded-md text-sm space-y-2">
                <div><strong>✓</strong> Custom name and icon</div>
                <div><strong>✓</strong> Work assignment description</div>
                <div><strong>✓</strong> Same connectivity as Process nodes</div>
                <div><strong>✓</strong> Shows parent-child relationship badges</div>
              </div>
            </Card>
          </div>
        </section>

        {/* Parent-Child Hierarchy */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <TreePine className="w-7 h-7" />
            Parent-Child Tree Hierarchy
          </h2>

          <Card className="p-6 mb-4">
            <h3 className="font-semibold text-lg mb-3">Understanding Relationships</h3>
            <p className="text-muted-foreground mb-4">
              NodeFlow automatically tracks parent-child relationships between nodes when you connect them:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                <ArrowUp className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <strong className="block mb-1">Parent Nodes</strong>
                  <p className="text-sm text-muted-foreground">
                    Nodes that connect TO the current node. These are upstream dependencies that
                    must complete before the current node can execute.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                <ArrowDown className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <strong className="block mb-1">Child Nodes</strong>
                  <p className="text-sm text-muted-foreground">
                    Nodes that receive connections FROM the current node. These are downstream
                    tasks that execute after the current node completes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                <Network className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <strong className="block mb-1">Root Nodes</strong>
                  <p className="text-sm text-muted-foreground">
                    Nodes with no parents. These are the starting points of your workflow tree.
                    Typically Start nodes or independent tasks.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">Visual Indicators</h3>
            <p className="text-muted-foreground mb-4">
              Every node displays badges showing its position in the hierarchy:
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <Badge variant="outline" className="text-xs h-6 px-2 gap-1">
                  <ArrowUp className="w-3 h-3" />
                  2
                </Badge>
                <span className="text-sm text-muted-foreground">
                  This node has 2 parent nodes (2 incoming connections)
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-md">
                <Badge variant="outline" className="text-xs h-6 px-2 gap-1">
                  <ArrowDown className="w-3 h-3" />
                  3
                </Badge>
                <span className="text-sm text-muted-foreground">
                  This node has 3 child nodes (3 outgoing connections)
                </span>
              </div>
            </div>
          </Card>
        </section>

        {/* Tree Visualization */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Tree Hierarchy View</h2>

          <Card className="p-6">
            <p className="text-muted-foreground mb-4">
              The right sidebar contains a <strong>Tree Hierarchy</strong> section that shows
              your entire workflow as a nested tree structure.
            </p>

            <div className="bg-muted/30 p-4 rounded-md border mb-4">
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3" />
                  <span>Start</span>
                  <Badge variant="secondary" className="text-[10px]">start</Badge>
                </div>
                <div className="flex items-center gap-2 pl-4">
                  <ChevronRight className="w-3 h-3" />
                  <span>Process Task</span>
                  <Badge variant="secondary" className="text-[10px]">process</Badge>
                </div>
                <div className="flex items-center gap-2 pl-8">
                  <ChevronRight className="w-3 h-3" />
                  <span>Decision Point</span>
                  <Badge variant="secondary" className="text-[10px]">decision</Badge>
                </div>
                <div className="flex items-center gap-2 pl-12 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-current" />
                  <span>End</span>
                  <Badge variant="secondary" className="text-[10px]">end</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                <span>Chevron icon = Node has children</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-foreground" />
                <span>Dot icon = Leaf node (no children)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">type</Badge>
                <span>Badge shows node type</span>
              </div>
            </div>
          </Card>
        </section>

        {/* Node Properties */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Node Properties Panel</h2>

          <Card className="p-6">
            <p className="text-muted-foreground mb-4">
              Click any node on the canvas to view detailed information in the right sidebar:
            </p>

            <div className="space-y-3">
              <div className="border rounded-md p-3">
                <h4 className="font-semibold text-sm mb-2">Basic Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Node Type (Start, Process, Decision, End, Custom)</li>
                  <li>Node ID (unique identifier)</li>
                  <li>Node Name/Label</li>
                  <li>Work Assignment (if applicable)</li>
                  <li>Position on canvas (X, Y coordinates)</li>
                </ul>
              </div>

              <div className="border rounded-md p-3">
                <h4 className="font-semibold text-sm mb-2">Parent Nodes Section</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Lists all nodes that connect to this node, showing:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Parent node name</li>
                  <li>Parent node type</li>
                  <li>Total count of parents</li>
                </ul>
              </div>

              <div className="border rounded-md p-3">
                <h4 className="font-semibold text-sm mb-2">Child Nodes Section</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Lists all nodes that receive connections from this node:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Child node name</li>
                  <li>Child node type</li>
                  <li>Total count of children</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Keyboard className="w-7 h-7" />
            Keyboard Shortcuts
          </h2>

          <Card className="p-6">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <span className="text-sm">Delete Selected Node</span>
                <Badge variant="outline">Del</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <span className="text-sm">Duplicate Node</span>
                <Badge variant="outline">Ctrl+D</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <span className="text-sm">Export Workflow</span>
                <Badge variant="outline">Ctrl+E</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <span className="text-sm">Toggle Left Panel</span>
                <Badge variant="outline">Ctrl+B</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <span className="text-sm">Toggle Right Panel</span>
                <Badge variant="outline">Ctrl+I</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                <span className="text-sm font-medium">Mac Users</span>
                <span className="text-xs text-muted-foreground">Use Cmd instead of Ctrl</span>
              </div>
            </div>
          </Card>
        </section>

        {/* Toolbar Operations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Toolbar Operations</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <PanelLeftClose className="w-5 h-5" />
                <h3 className="font-semibold">Toggle Sidebars</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Show/hide the left node palette or right properties panel for more canvas space.
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Copy className="w-5 h-5" />
                <h3 className="font-semibold">Duplicate Node</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Create a copy of the selected node with the same properties and configuration.
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Trash2 className="w-5 h-5" />
                <h3 className="font-semibold">Delete Node</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Remove the selected node and all its connections from the workflow.
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Eraser className="w-5 h-5" />
                <h3 className="font-semibold">Clear All</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Remove all nodes and connections from the canvas. Asks for confirmation first.
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Upload className="w-5 h-5" />
                <h3 className="font-semibold">Import Workflow</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Load a previously saved workflow from a JSON file. Restores all nodes and connections.
              </p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Download className="w-5 h-5" />
                <h3 className="font-semibold">Export Workflow</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Save your workflow as a JSON file with timestamp. Preserves all node data and connections.
              </p>
            </Card>
          </div>
        </section>

        {/* Import/Export */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <FileJson className="w-7 h-7" />
            Import & Export
          </h2>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-3">Exporting Workflows</h3>
            <p className="text-muted-foreground mb-3">
              Click the <strong>Export</strong> button in the toolbar to save your workflow as a JSON file.
            </p>
            <div className="bg-muted/50 p-4 rounded-md mb-4">
              <p className="text-sm mb-2"><strong>File contains:</strong></p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>All nodes with their configurations</li>
                <li>All connections between nodes</li>
                <li>Node positions on canvas</li>
                <li>Timestamp of export</li>
              </ul>
            </div>

            <h3 className="font-semibold text-lg mb-3 mt-6">Importing Workflows</h3>
            <p className="text-muted-foreground mb-3">
              Click the <strong>Import</strong> button and select a previously exported JSON file.
            </p>
            <div className="bg-muted/50 p-4 rounded-md">
              <p className="text-sm mb-2"><strong>What happens:</strong></p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Current workflow is replaced</li>
                <li>All nodes are recreated with saved positions</li>
                <li>Connections are automatically restored</li>
                <li>Parent-child relationships rebuild automatically</li>
              </ul>
            </div>
          </Card>
        </section>

        {/* Tips & Best Practices */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Tips & Best Practices</h2>

          <div className="space-y-4">
            <Card className="p-5 border-l-4">
              <h3 className="font-semibold mb-2">💡 Start with a Plan</h3>
              <p className="text-sm text-muted-foreground">
                Before creating nodes, sketch out your workflow on paper. Identify the main steps,
                decision points, and dependencies.
              </p>
            </Card>

            <Card className="p-5 border-l-4">
              <h3 className="font-semibold mb-2">📝 Use Descriptive Names</h3>
              <p className="text-sm text-muted-foreground">
                Give your custom nodes clear, descriptive names. Instead of "Task 1", use
                "Validate User Input" or "Send Email Notification".
              </p>
            </Card>

            <Card className="p-5 border-l-4">
              <h3 className="font-semibold mb-2">🔗 Keep It Simple</h3>
              <p className="text-sm text-muted-foreground">
                Avoid creating overly complex workflows. If a workflow has more than 15-20 nodes,
                consider breaking it into smaller sub-workflows.
              </p>
            </Card>

            <Card className="p-5 border-l-4">
              <h3 className="font-semibold mb-2">💾 Save Regularly</h3>
              <p className="text-sm text-muted-foreground">
                Use the Export feature (Ctrl+E) frequently to save your work. Export creates a
                timestamped backup you can restore later.
              </p>
            </Card>

            <Card className="p-5 border-l-4">
              <h3 className="font-semibold mb-2">🎯 Use the Right Node Type</h3>
              <p className="text-sm text-muted-foreground">
                Start nodes for entry points, Process for actions, Decision for branching logic,
                End nodes for completion, and Custom nodes for specific tasks.
              </p>
            </Card>

            <Card className="p-5 border-l-4">
              <h3 className="font-semibold mb-2">🌲 Check the Tree View</h3>
              <p className="text-sm text-muted-foreground">
                Regularly check the Tree Hierarchy view to ensure your workflow structure makes sense
                and there are no circular dependencies.
              </p>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold mb-2">Q: Can I create circular workflows?</h3>
              <p className="text-sm text-muted-foreground">
                The tree hierarchy view prevents displaying circular references, but you can create
                them on the canvas. However, circular workflows may cause execution issues.
              </p>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-2">Q: How many nodes can I create?</h3>
              <p className="text-sm text-muted-foreground">
                There's no hard limit, but for optimal performance, keep workflows under 50 nodes.
                For larger projects, break them into multiple workflows.
              </p>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-2">Q: Can I edit node properties after creation?</h3>
              <p className="text-sm text-muted-foreground">
                Currently, node properties are set during creation. To modify, delete the node and
                create a new one with updated properties.
              </p>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-2">Q: What happens to children when I delete a parent node?</h3>
              <p className="text-sm text-muted-foreground">
                When you delete a node, all connections to and from it are automatically removed.
                Child nodes remain on the canvas but lose their parent connection.
              </p>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-2">Q: Can I have multiple root nodes?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can have multiple independent workflow trees in the same canvas. Each will
                appear as a separate tree in the Tree Hierarchy view.
              </p>
            </Card>
          </div>
        </section>

        {/* Footer CTA */}
        <Card className="p-8 text-center bg-muted/30">
          <h2 className="text-2xl font-bold mb-3">Ready to Build Your Workflow?</h2>
          <p className="text-muted-foreground mb-6">
            Start creating powerful workflows with parent-child hierarchies
          </p>
          <Link href="/editor">
            <Button size="lg">
              <Play className="w-4 h-4 mr-2" />
              Open Editor
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
