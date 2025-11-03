"use client";

import { useCallback, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Workflow,
  Plus,
  Save,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Settings,
  Play,
  Trash2,
  Copy,
  Upload,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  FileJson,
  Eraser,
  X,
  Network,
  ChevronRight,
  Circle,
  BookOpen,
} from "lucide-react";
import { IconPicker } from "@/components/ui/icon-picker";
import { ThemeToggle } from "@/components/theme-toggle";
import { useWorkflow } from "@/lib/hooks";
import CustomNode from "@/components/workflow/CustomNode";
import ProcessNode from "@/components/workflow/ProcessNode";
import DecisionNode from "@/components/workflow/DecisionNode";
import StartNode from "@/components/workflow/StartNode";
import EndNode from "@/components/workflow/EndNode";

// Simple toast function (can be replaced with a proper toast library)
const toast = ({
  title,
  description,
  variant,
}: {
  title: string;
  description: string;
  variant?: "destructive";
}) => {
  if (variant === "destructive") {
    alert(`${title}\n${description}`);
  } else {
    alert(`${title}\n${description}`);
  }
};

const nodeTypes = {
  custom: CustomNode,
  process: ProcessNode,
  decision: DecisionNode,
  start: StartNode,
  end: EndNode,
};

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workflowId = searchParams.get("workflow");

  // Use the workflow hook for data fetching and saving
  const {
    workflow,
    isLoading: isLoadingWorkflow,
    isSaving,
    saveWorkflow,
  } = useWorkflow(workflowId);

  // Redirect to dashboard if no workflow ID
  useEffect(() => {
    if (!workflowId) {
      router.push("/dashboard");
    }
  }, [workflowId, router]);

  // Show loading state while redirecting
  if (!workflowId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No Workflow Selected</h3>
          <p className="text-muted-foreground mb-4">
            Redirecting to dashboard...
          </p>
        </Card>
      </div>
    );
  }

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState("process");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [isRunning, setIsRunning] = useState(false);

  // Load workflow data when available
  useEffect(() => {
    if (workflow) {
      setWorkflowName(workflow.workflow.name);
      setNodes(workflow.nodes);
      setEdges(workflow.edges);
    }
  }, [workflow, setNodes, setEdges]);

  // Custom node dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customNodeName, setCustomNodeName] = useState("");
  const [customNodeWork, setCustomNodeWork] = useState("");
  const [customNodeIcon, setCustomNodeIcon] = useState("Box");

  // Sidebar toggle states
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // Parent-Child relationship tracking
  const [nodeRelationships, setNodeRelationships] = useState<
    Record<string, { parents: string[]; children: string[] }>
  >({});

  // Update parent-child relationships when edges change
  useEffect(() => {
    const relationships: Record<
      string,
      { parents: string[]; children: string[] }
    > = {};

    // Initialize all nodes
    nodes.forEach((node) => {
      relationships[node.id] = { parents: [], children: [] };
    });

    // Build relationships from edges
    edges.forEach((edge) => {
      const parentId = edge.source;
      const childId = edge.target;

      if (relationships[parentId] && relationships[childId]) {
        relationships[parentId].children.push(childId);
        relationships[childId].parents.push(parentId);
      }
    });

    setNodeRelationships(relationships);

    // Update node data with relationship counts
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
  }, [edges, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        animated: true,
        style: { stroke: "#71717a" }, // neutral gray
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: type,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: "Add description here",
        icon: "box",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleCreateCustomNode = () => {
    if (!customNodeName.trim()) {
      alert("Please enter a node name");
      return;
    }

    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: "custom",
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: {
        label: customNodeName,
        description: customNodeWork || "No work assigned",
        icon: customNodeIcon,
      },
    };
    setNodes((nds) => [...nds, newNode]);

    // Reset form and close dialog
    setCustomNodeName("");
    setCustomNodeWork("");
    setCustomNodeIcon("Box");
    setIsDialogOpen(false);
  };

  // Toolbar operations
  const handleDeleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const handleDuplicateNode = useCallback(() => {
    if (selectedNode) {
      const newNode: Node = {
        ...selectedNode,
        id: `${nodes.length + 1}`,
        position: {
          x: selectedNode.position.x + 50,
          y: selectedNode.position.y + 50,
        },
      };
      setNodes((nds) => [...nds, newNode]);
    }
  }, [selectedNode, nodes.length, setNodes]);

  const handleClearAll = useCallback(() => {
    if (confirm("Are you sure you want to clear all nodes and connections?")) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  }, [setNodes, setEdges]);

  const handleExportJSON = useCallback(() => {
    const data = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleImportJSON = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.nodes && data.edges) {
              setNodes(data.nodes);
              setEdges(data.edges);
            } else {
              alert("Invalid workflow file format");
            }
          } catch (error) {
            alert("Error parsing workflow file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setNodes, setEdges]);

  // Save workflow handler
  const handleSaveWorkflow = useCallback(async () => {
    if (!workflowId) return;

    try {
      await saveWorkflow({
        name: workflowName,
        nodes,
        edges,
      });

      toast({
        title: "Workflow saved",
        description: "Your workflow has been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save workflow:", error);
      toast({
        title: "Save failed",
        description: "Failed to save workflow. Please try again.",
        variant: "destructive",
      });
    }
  }, [workflowId, workflowName, nodes, edges, saveWorkflow, toast]);

  // Run workflow handler (simulated execution)
  const handleRunWorkflow = useCallback(async () => {
    if (nodes.length === 0) {
      toast({
        title: "Cannot run workflow",
        description: "Add at least one node to run the workflow.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    toast({
      title: "Workflow running",
      description: `Executing ${nodes.length} nodes...`,
    });

    // Simulate workflow execution
    try {
      // First save the workflow
      await handleSaveWorkflow();

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Workflow completed",
        description: `Successfully processed ${nodes.length} nodes and ${edges.length} connections.`,
      });
    } catch (error) {
      console.error("Workflow execution failed:", error);
      toast({
        title: "Execution failed",
        description: "An error occurred while running the workflow.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  }, [nodes, edges, handleSaveWorkflow, toast]);

  // Helper function to render tree hierarchy
  const renderTreeNode = (
    nodeId: string,
    level: number = 0,
    visited: Set<string> = new Set()
  ): React.ReactElement | null => {
    if (visited.has(nodeId)) return null; // Prevent circular references
    visited.add(nodeId);

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return null;

    const relationships = nodeRelationships[nodeId];
    if (!relationships) return null;

    const hasChildren = relationships.children.length > 0;

    return (
      <div key={nodeId} className="text-xs">
        <div
          className={`flex items-center gap-2 py-1.5 px-2 rounded hover:bg-accent cursor-pointer transition-colors ${
            selectedNode?.id === nodeId ? "bg-accent" : ""
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setSelectedNode(node)}
        >
          {hasChildren ? (
            <ChevronRight className="w-3 h-3 shrink-0" />
          ) : (
            <Circle className="w-2 h-2 shrink-0 fill-current" />
          )}
          <span className="font-medium truncate">
            {String(node.data.label)}
          </span>
          <Badge variant="secondary" className="text-[10px] ml-auto">
            {node.type}
          </Badge>
        </div>
        {hasChildren && (
          <div>
            {relationships.children.map((childId) =>
              renderTreeNode(childId, level + 1, new Set(visited))
            )}
          </div>
        )}
      </div>
    );
  };

  // Get root nodes (nodes with no parents)
  const getRootNodes = () => {
    return nodes.filter((node) => {
      const relationships = nodeRelationships[node.id];
      return relationships && relationships.parents.length === 0;
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected node (Delete or Backspace)
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedNode &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        handleDeleteSelected();
      }

      // Duplicate node (Ctrl/Cmd + D)
      if ((e.ctrlKey || e.metaKey) && e.key === "d" && selectedNode) {
        e.preventDefault();
        handleDuplicateNode();
      }

      // Export (Ctrl/Cmd + E)
      if ((e.ctrlKey || e.metaKey) && e.key === "e" && nodes.length > 0) {
        e.preventDefault();
        handleExportJSON();
      }

      // Toggle left sidebar (Ctrl/Cmd + B)
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setIsLeftSidebarOpen(!isLeftSidebarOpen);
      }

      // Toggle right sidebar (Ctrl/Cmd + I)
      if ((e.ctrlKey || e.metaKey) && e.key === "i") {
        e.preventDefault();
        setIsRightSidebarOpen(!isRightSidebarOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedNode,
    nodes.length,
    isLeftSidebarOpen,
    isRightSidebarOpen,
    handleDeleteSelected,
    handleDuplicateNode,
    handleExportJSON,
  ]);

  return (
    <div className="h-screen flex flex-col">
      {/* Top Toolbar */}
      <div className="border-b bg-background z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center">
                <Workflow className="w-5 h-5 text-background" />
              </div>
              <span className="text-lg font-semibold">NodeFlow</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-lg font-medium bg-transparent border-none outline-none focus:ring-0 px-2"
              placeholder="Workflow name"
            />
            <div className="h-6 w-px bg-border" />
            <Link href="/docs">
              <Button variant="ghost" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Docs
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Sidebar Toggles */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
              title="Toggle Node Palette"
            >
              {isLeftSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeftOpen className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              title="Toggle Properties"
            >
              {isRightSidebarOpen ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </Button>

            <div className="h-6 w-px bg-border mx-2" />

            {/* Theme Toggle */}
            <ThemeToggle />

            <div className="h-6 w-px bg-border mx-2" />

            {/* Node Operations */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDuplicateNode}
              disabled={!selectedNode}
              title="Duplicate Selected Node"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteSelected}
              disabled={!selectedNode}
              title="Delete Selected Node"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearAll}
              disabled={nodes.length === 0}
              title="Clear All"
            >
              <Eraser className="w-4 h-4" />
            </Button>

            <div className="h-6 w-px bg-border mx-2" />

            {/* File Operations */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportJSON}
              title="Import Workflow"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              disabled={nodes.length === 0}
              title="Export Workflow"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <div className="h-6 w-px bg-border mx-2" />

            {/* Main Actions */}
            <Button
              variant="outline"
              onClick={handleSaveWorkflow}
              disabled={isSaving || isLoadingWorkflow}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleRunWorkflow}
              disabled={isRunning || nodes.length === 0}
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        {isLeftSidebarOpen && (
          <div className="w-64 border-r bg-muted/30 overflow-y-auto transition-all duration-300 ease-in-out">
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                  Create Custom Node
                </h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Card className="p-4 cursor-pointer hover:bg-accent transition-colors border-2 border-dashed hover:border-solid">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-12 h-12 rounded-md border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                          <Plus className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-sm mb-1">
                            New Custom Node
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Click to create
                          </div>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        Create Custom Node
                      </DialogTitle>
                      <DialogDescription>
                        Define a new workflow node with a name, icon, and work
                        assignment. You can connect it to other nodes after
                        creation.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-semibold">
                          Node Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          placeholder="e.g., Data Processing, Review Task, Send Email"
                          value={customNodeName}
                          onChange={(e) => setCustomNodeName(e.target.value)}
                          className="text-base"
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="icon" className="text-sm font-semibold">
                          Icon <span className="text-red-500">*</span>
                        </label>
                        <IconPicker
                          value={customNodeIcon}
                          onChange={setCustomNodeIcon}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="work" className="text-sm font-semibold">
                          Work Assignment
                        </label>
                        <textarea
                          id="work"
                          placeholder="Describe what work this node performs..."
                          value={customNodeWork}
                          onChange={(e) => setCustomNodeWork(e.target.value)}
                          rows={5}
                          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateCustomNode}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Node
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                  Template Nodes
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Quick start with pre-configured nodes
                </p>
                <div className="space-y-2">
                  <Card
                    className="p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => addNode("start")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center border">
                        <Play className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Start</div>
                        <div className="text-xs text-muted-foreground">
                          Begin workflow
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => addNode("process")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center border">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Process</div>
                        <div className="text-xs text-muted-foreground">
                          Action step
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => addNode("decision")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center border">
                        <Workflow className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Decision</div>
                        <div className="text-xs text-muted-foreground">
                          Conditional branch
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => addNode("end")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center border">
                        <Maximize className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">End</div>
                        <div className="text-xs text-muted-foreground">
                          Finish workflow
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Canvas */}
        <div className="flex-1 relative">
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <Card className="max-w-md p-8 text-center pointer-events-auto shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-md bg-muted flex items-center justify-center border-2 border-dashed">
                  <Workflow className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Start Building Your Workflow
                </h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Create custom nodes or choose from template nodes in the left
                  sidebar
                </p>
                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3 text-left">
                    <div className="w-6 h-6 rounded-md bg-muted border flex items-center justify-center text-xs font-semibold shrink-0">
                      1
                    </div>
                    <span>
                      Create custom nodes with names and work assignments
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <div className="w-6 h-6 rounded-md bg-muted border flex items-center justify-center text-xs font-semibold shrink-0">
                      2
                    </div>
                    <span>Drag nodes to position them on the canvas</span>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <div className="w-6 h-6 rounded-md bg-muted border flex items-center justify-center text-xs font-semibold shrink-0">
                      3
                    </div>
                    <span>Connect nodes by dragging from one to another</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedNode(node)}
            onPaneClick={() => setSelectedNode(null)}
            fitView
            className="bg-muted/20"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              className="bg-background"
            />
            <Controls className="bg-background border rounded-md shadow-sm" />
            <MiniMap
              className="bg-background border rounded-md shadow-sm"
              nodeColor={(node) => {
                return "#71717a"; // neutral gray for all nodes
              }}
            />
          </ReactFlow>
        </div>

        {/* Right Sidebar - Properties */}
        {isRightSidebarOpen && (
          <div className="w-80 border-l bg-muted/30 overflow-y-auto transition-all duration-300 ease-in-out">
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                  Node Properties
                </h3>
                {selectedNode ? (
                  <Card className="p-4 space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Node Type
                      </label>
                      <p className="font-medium capitalize">
                        {selectedNode.type || "Custom"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Node ID
                      </label>
                      <p className="font-mono text-sm">{selectedNode.id}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Name
                      </label>
                      <p className="font-medium">
                        {String(selectedNode.data.label || "Untitled")}
                      </p>
                    </div>
                    {selectedNode.data.description ? (
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Work Assignment
                        </label>
                        <p className="text-sm">
                          {String(selectedNode.data.description)}
                        </p>
                      </div>
                    ) : null}
                    <div className="pt-2 border-t">
                      <label className="text-xs text-muted-foreground">
                        Position
                      </label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <span className="text-xs text-muted-foreground">
                            X:
                          </span>
                          <span className="ml-1 font-mono text-sm">
                            {Math.round(selectedNode.position.x)}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">
                            Y:
                          </span>
                          <span className="ml-1 font-mono text-sm">
                            {Math.round(selectedNode.position.y)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {nodeRelationships[selectedNode.id] && (
                      <>
                        <div className="pt-2 border-t">
                          <label className="text-xs text-muted-foreground mb-2 block">
                            Parent Nodes (
                            {nodeRelationships[selectedNode.id].parents.length})
                          </label>
                          {nodeRelationships[selectedNode.id].parents.length >
                          0 ? (
                            <div className="space-y-1">
                              {nodeRelationships[selectedNode.id].parents.map(
                                (parentId) => {
                                  const parent = nodes.find(
                                    (n) => n.id === parentId
                                  );
                                  return parent ? (
                                    <div
                                      key={parentId}
                                      className="text-xs p-2 bg-muted/50 rounded border flex items-center justify-between"
                                    >
                                      <span className="font-medium truncate">
                                        {String(parent.data.label)}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs ml-2"
                                      >
                                        {parent.type}
                                      </Badge>
                                    </div>
                                  ) : null;
                                }
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              No parent nodes
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t">
                          <label className="text-xs text-muted-foreground mb-2 block">
                            Child Nodes (
                            {nodeRelationships[selectedNode.id].children.length}
                            )
                          </label>
                          {nodeRelationships[selectedNode.id].children.length >
                          0 ? (
                            <div className="space-y-1">
                              {nodeRelationships[selectedNode.id].children.map(
                                (childId) => {
                                  const child = nodes.find(
                                    (n) => n.id === childId
                                  );
                                  return child ? (
                                    <div
                                      key={childId}
                                      className="text-xs p-2 bg-muted/50 rounded border flex items-center justify-between"
                                    >
                                      <span className="font-medium truncate">
                                        {String(child.data.label)}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs ml-2"
                                      >
                                        {child.type}
                                      </Badge>
                                    </div>
                                  ) : null;
                                }
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              No child nodes
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Quick Connect to Multiple Nodes */}
                    <div className="pt-2 border-t">
                      <label className="text-xs text-muted-foreground mb-2 block">
                        Quick Connect (Thread)
                      </label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Network className="w-3 h-3 mr-2" />
                            Connect to Multiple Nodes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Create Thread Connection</DialogTitle>
                            <DialogDescription>
                              Connect "{String(selectedNode.data.label)}" to
                              multiple nodes in a thread. Select target nodes
                              below.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="max-h-[400px] overflow-y-auto py-4">
                            <div className="space-y-2">
                              {nodes
                                .filter((n) => n.id !== selectedNode.id)
                                .map((node) => {
                                  const isConnected = edges.some(
                                    (e) =>
                                      e.source === selectedNode.id &&
                                      e.target === node.id
                                  );
                                  return (
                                    <Card
                                      key={node.id}
                                      className={`p-3 cursor-pointer transition-all ${
                                        isConnected
                                          ? "bg-primary/10 border-primary"
                                          : "hover:bg-muted"
                                      }`}
                                      onClick={() => {
                                        if (isConnected) {
                                          // Remove connection
                                          setEdges((eds) =>
                                            eds.filter(
                                              (e) =>
                                                !(
                                                  e.source ===
                                                    selectedNode.id &&
                                                  e.target === node.id
                                                )
                                            )
                                          );
                                        } else {
                                          // Add connection
                                          const newEdge: Edge = {
                                            id: `e${selectedNode.id}-${node.id}`,
                                            source: selectedNode.id,
                                            target: node.id,
                                            animated: true,
                                            style: { stroke: "#71717a" },
                                          };
                                          setEdges((eds) => [...eds, newEdge]);
                                        }
                                      }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1">
                                          <div
                                            className={`w-2 h-2 rounded-full ${
                                              isConnected
                                                ? "bg-primary"
                                                : "bg-muted-foreground"
                                            }`}
                                          />
                                          <div>
                                            <p className="font-medium text-sm truncate">
                                              {String(node.data.label)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {node.type}
                                            </p>
                                          </div>
                                        </div>
                                        {isConnected && (
                                          <Badge
                                            variant="default"
                                            className="text-xs"
                                          >
                                            Connected
                                          </Badge>
                                        )}
                                      </div>
                                    </Card>
                                  );
                                })}
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogDescription className="text-xs">
                              Click nodes to toggle connections. Changes apply
                              immediately.
                            </DialogDescription>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Select a node to view and edit its properties
                    </p>
                  </Card>
                )}
              </div>

              <div>
                <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                  Workflow Info
                </h3>
                <Card className="p-4 space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Total Nodes
                    </div>
                    <div className="text-2xl font-bold">{nodes.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Connections
                    </div>
                    <div className="text-2xl font-bold">{edges.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Custom Nodes
                    </div>
                    <div className="text-2xl font-bold">
                      {nodes.filter((n) => n.type === "custom").length}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Branching Nodes
                    </div>
                    <div className="text-2xl font-bold">
                      {
                        Object.values(nodeRelationships).filter(
                          (rel) => rel.children.length > 1
                        ).length
                      }
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Nodes with multiple child connections
                    </p>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Status
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          nodes.length > 0
                            ? "bg-foreground"
                            : "bg-muted-foreground"
                        }`}
                      ></div>
                      <span className="text-sm">
                        {nodes.length > 0 ? "Active" : "Empty"}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {nodes.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Network className="w-3 h-3" />
                    Tree Hierarchy
                  </h3>
                  <Card className="p-3">
                    {getRootNodes().length > 0 ? (
                      <div className="space-y-1 max-h-64 overflow-y-auto">
                        {getRootNodes().map((rootNode) =>
                          renderTreeNode(rootNode.id)
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground text-center py-4">
                        <Network className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>No hierarchy yet</p>
                        <p className="text-[10px] mt-1">
                          Connect nodes to build a tree
                        </p>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              <div>
                <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                  Keyboard Shortcuts
                </h3>
                <Card className="p-4 space-y-3">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Delete Node</span>
                      <Badge variant="outline" className="text-xs">
                        Del
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Duplicate Node
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Ctrl+D
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Export Workflow
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Ctrl+E
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Toggle Left Panel
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Ctrl+B
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Toggle Right Panel
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Ctrl+I
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>

              {nodes.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                    Quick Tips
                  </h3>
                  <Card className="p-4 space-y-2 text-xs text-muted-foreground">
                    <p>• Drag nodes to reposition them</p>
                    <p>• Click and drag from handles to connect nodes</p>
                    <p>• Click a node to view its properties</p>
                    <p>• Use minimap for quick navigation</p>
                    <p>• Create custom nodes with unique names</p>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Editor() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-lg font-semibold">Loading Editor...</p>
          </div>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
