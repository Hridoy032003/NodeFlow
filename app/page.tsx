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
import {
  Workflow,
  Zap,
  Users,
  GitBranch,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { getServerSession } from "next-auth";

export  default async function Home() {
  const session = await getServerSession();
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              NodeFlow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/docs">
              <Button variant="ghost">
                <BookOpen className="w-4 h-4 mr-2" />
                Docs
              </Button>
            </Link>
            {session?.user && (  <><Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
           </>) || (<Link href="/signin">
              <Button>
                Sign In <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>)}
          
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Visual Workflow Builder
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Build Workflows
            <br />
            Without Limits
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Design, visualize, and manage your project workflows with our
            intuitive drag-and-drop interface. Perfect for teams of any size.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/editor">
              <Button size="lg" className="text-base">
                Start Creating
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="text-base">
                <BookOpen className="mr-2 w-4 h-4" />
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-950/20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to manage workflows
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features that make workflow management simple and efficient
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-purple-100 dark:border-purple-900 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Drag & Drop Builder</CardTitle>
              <CardDescription>
                Create complex workflows with an intuitive visual interface. No
                coding required.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-100 dark:border-blue-900 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Real-time Collaboration</CardTitle>
              <CardDescription>
                Work together with your team in real-time. See changes
                instantly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-100 dark:border-green-900 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                <GitBranch className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Smart Automation</CardTitle>
              <CardDescription>
                Automate repetitive tasks and connect with your favorite tools
                seamlessly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-orange-100 dark:border-orange-900 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Manage permissions, assign tasks, and track progress across your
                organization.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-indigo-100 dark:border-indigo-900 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Rich Customization</CardTitle>
              <CardDescription>
                Add icons, colors, and rich text to make your workflows visually
                stunning.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-pink-100 dark:border-pink-900 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4">
                <GitBranch className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Version Control</CardTitle>
              <CardDescription>
                Track changes, rollback to previous versions, and maintain
                workflow history.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white border-none">
          <CardHeader className="text-center py-12">
            <CardTitle className="text-3xl md:text-4xl mb-4 text-white">
              Ready to transform your workflow?
            </CardTitle>
            <CardDescription className="text-purple-100 text-lg mb-6">
              Join thousands of teams already using NodeFlow to streamline their
              processes
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/editor">
                <Button size="lg" variant="secondary" className="text-base">
                  Start Building Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js and React Flow. © 2024 NodeFlow. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
