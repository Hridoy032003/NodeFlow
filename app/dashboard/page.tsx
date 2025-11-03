"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Workflow,
  Plus,
  Search,
  Clock,
  Users,
  MoreVertical,
  Folder,
  Star,
  TrendingUp,
  LogOut,
  Globe,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWorkflows } from "@/lib/hooks";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

// Live workflows are fetched via SWR hook

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isWorkflowPublic, setIsWorkflowPublic] = useState(false);
  const [updatingVisibilityId, setUpdatingVisibilityId] = useState<string | null>(null);
  const router = useRouter();

  const { workflows, isLoading, createWorkflow, updateWorkflowVisibility } = useWorkflows();
  const { data: session } = useSession();

  const filteredWorkflows = (workflows || []).filter((workflow) =>
    ((workflow.name || "") + " " + (workflow.description || ""))
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const gradientColors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-pink-500 to-rose-500",
  ];

  const handleCreateWorkflow = async () => {
    if (!workflowName.trim()) {
      alert("Please enter a workflow name");
      return;
    }

    setIsCreating(true);
    try {
      const newWorkflow = await createWorkflow({
        name: workflowName.trim(),
        description: workflowDescription.trim() || undefined,
        isPublic: isWorkflowPublic,
      });

      // Close dialog and reset form
      setIsCreateDialogOpen(false);
      setWorkflowName("");
      setWorkflowDescription("");
      setIsWorkflowPublic(false);

      // Redirect to editor with new workflow
      router.push(`/editor?workflow=${newWorkflow.id}`);
    } catch (error) {
      console.error("Failed to create workflow:", error);
      alert("Failed to create workflow. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleVisibilityChange = async (
    workflowId: string,
    nextValue: boolean
  ) => {
    setUpdatingVisibilityId(workflowId);
    try {
      await updateWorkflowVisibility(workflowId, nextValue);
    } catch (error) {
      console.error("Failed to update workflow visibility:", error);
      alert("Failed to update workflow visibility. Please try again.");
    } finally {
      setUpdatingVisibilityId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/30 to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              NodeFlow
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost">Settings</Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => signOut({ callbackUrl: "/signin" })}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={(open) => {
                setIsCreateDialogOpen(open);
                if (!open) {
                  setWorkflowName("");
                  setWorkflowDescription("");
                  setIsWorkflowPublic(false);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Workflow
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Workflow</DialogTitle>
                  <DialogDescription>
                    Give your workflow a name and description. You'll be able to
                    add nodes and connections in the editor.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Workflow Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      placeholder="e.g., Customer Onboarding Flow"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      disabled={isCreating}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description (optional)
                    </label>
                    <Input
                      id="description"
                      placeholder="Brief description of what this workflow does"
                      value={workflowDescription}
                      onChange={(e) => setWorkflowDescription(e.target.value)}
                      disabled={isCreating}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">Make workflow public</p>
                      <p className="text-xs text-muted-foreground">
                        Allow other users to view this workflow
                      </p>
                    </div>
                    <Switch
                      id="workflow-visibility"
                      checked={isWorkflowPublic}
                      onCheckedChange={(checked) =>
                        setIsWorkflowPublic(checked === true)
                      }
                      disabled={isCreating}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateWorkflow} disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create & Open Editor"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* User Profile */}
        {session?.user && (
          <Card className="mb-8">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || session.user.email || "User"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-lg font-semibold">
                    {(session.user.name || session.user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-lg font-semibold">
                    {session.user.name || "User"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session.user.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Logged in</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Workflows</CardDescription>
              <CardTitle className="text-3xl">
                {workflows?.length ?? 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-green-500">+12%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Workflows</CardDescription>
              <CardTitle className="text-3xl">
                {workflows?.filter((w) => w.isPublic).length ?? 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                Running smoothly
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Team Members</CardDescription>
              <CardTitle className="text-3xl">12</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-1" />
                Across 3 teams
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed Tasks</CardDescription>
              <CardTitle className="text-3xl">1.2K</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                This month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Workflows</h1>
            <p className="text-muted-foreground">
              Manage and monitor your workflow automations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Folder className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow, idx) => (
            <Card
              key={workflow.id}
              className="hover:shadow-lg transition-all group"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                      gradientColors[idx % gradientColors.length]
                    } flex items-center justify-center`}
                  >
                    <Workflow className="w-6 h-6 text-white" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl mb-2">{workflow.name}</CardTitle>
                <CardDescription>{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Workflow className="w-4 h-4" />
                      {workflow._count?.nodes ?? 0} nodes
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {workflow.updatedAt
                        ? new Date(workflow.updatedAt).toLocaleString()
                        : "-"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      id={`visibility-${workflow.id}`}
                      checked={workflow.isPublic}
                      onCheckedChange={(checked) =>
                        handleVisibilityChange(workflow.id, checked === true)
                      }
                      disabled={updatingVisibilityId === workflow.id}
                    />
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      {workflow.isPublic ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      {workflow.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                  <Link href={`/editor?workflow=${workflow.id}`}>
                    <Button variant="ghost" size="sm">
                      Open
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkflows.length === 0 && (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No workflows found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or create a new workflow
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
