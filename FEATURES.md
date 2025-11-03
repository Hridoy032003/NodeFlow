# NodeFlow - Workflow Management Application

## Overview

NodeFlow is a visual workflow management application that allows users to design and manage their project workflows using an intuitive drag-and-drop interface built with React Flow and Next.js.

## Key Features

### 1. **Custom Node Creation** ✨

Users can create their own custom nodes with:

- **Custom Names**: Define meaningful names for each workflow step
- **Work Assignments**: Describe the specific work each node performs
- **Visual Distinction**: Custom nodes feature a purple-to-pink gradient design

### 2. **Template Nodes** 📋

Pre-configured node types for quick workflow building:

- **Start Node**: Begin your workflow (green gradient)
- **Process Node**: Action steps (blue gradient)
- **Decision Node**: Conditional branching (orange gradient)
- **End Node**: Workflow completion (red gradient)

### 3. **Interactive Canvas** 🎨

- Drag-and-drop node positioning
- Visual connection lines between nodes
- Animated connections with purple accent color
- Grid background for better alignment
- Minimap for navigation
- Zoom and pan controls

### 4. **Smart Sidebar Layout**

#### Left Sidebar - Node Creation

- **Prominent custom node creation** at the top
- Template nodes below for quick access
- Clear visual hierarchy with icons and descriptions

#### Right Sidebar - Properties & Info

- **Node Properties**: View details of selected nodes
  - Node type and ID
  - Name and work assignment
  - Position coordinates
- **Workflow Statistics**:
  - Total nodes count
  - Connection count
  - Custom nodes count
  - Workflow status
- **Quick Tips**: Helpful guidance for new users

### 5. **Enhanced User Experience** 💡

- **Empty State Guide**: Shows instructions when canvas is empty
- **Node Selection**: Click nodes to view their properties
- **Visual Feedback**: Selected nodes show purple ring highlight
- **Responsive Design**: Works across different screen sizes

### 6. **Rich Visual Design** 🎨

- **Gradient Backgrounds**: Purple, pink, and blue color scheme
- **Icon Integration**: Lucide React icons for visual clarity
- **Shadcn UI Components**: Modern, accessible UI components
- **Dark Mode Support**: Automatic theme switching

## Pages

### 1. Home Page (`/`)

- Hero section with call-to-action
- Feature showcase with 6 key capabilities
- Gradient-based design highlighting key benefits
- Navigation to Dashboard and Editor

### 2. Dashboard (`/dashboard`)

- Workflow overview with statistics
- Sample workflows gallery
- Search functionality
- Status badges (active/draft)
- Quick access to editor

### 3. Editor Page (`/editor`)

- Main workflow building interface
- Custom node creation dialog
- Template node palette
- Properties panel
- Real-time workflow statistics

## How to Use

### Creating a Custom Node:

1. Click **"Add Custom Node"** in the left sidebar
2. Enter a **Node Name** (required)
3. Add **Work Assignment** description (optional)
4. Click **"Create Node"** to add it to the canvas

### Connecting Nodes:

1. Hover over a node to see connection handles
2. Click and drag from the **bottom handle** of one node
3. Drop on the **top handle** of another node
4. An animated connection line will appear

### Viewing Node Details:

1. Click on any node in the canvas
2. View its properties in the right sidebar
3. See name, type, work assignment, and position

### Managing Workflow:

- **Save**: Store your workflow (button in top toolbar)
- **Run**: Execute workflow logic (button in top toolbar)
- **Undo/Redo**: Navigate through changes
- **Zoom**: Use controls or mouse wheel

## Technology Stack

- **Framework**: Next.js 16.0.1 with App Router
- **Workflow Library**: React Flow (@xyflow/react)
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Color Palette

- **Primary**: Purple (#a855f7)
- **Secondary**: Pink (#ec4899)
- **Accent**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f97316)
- **Danger**: Red (#ef4444)

## Next Steps (Backend Integration)

Ready for backend development:

1. **API Routes**: Create Next.js API routes for workflow CRUD operations
2. **Database**: Integrate PostgreSQL/MongoDB for workflow storage
3. **Authentication**: Add user authentication (NextAuth.js)
4. **Real-time**: WebSocket support for collaboration
5. **Export**: JSON export/import functionality
6. **Execution Engine**: Workflow execution logic

---

**Built with ❤️ using Next.js and React Flow**
