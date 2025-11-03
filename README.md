# NodeFlow - Visual Workflow Management

A beautiful, modern workflow management application built with Next.js and React Flow. Design, visualize, and manage your project workflows with an intuitive drag-and-drop interface.

## Features

- **Drag & Drop Builder** - Create complex workflows with an intuitive visual interface
- **Multiple Node Types** - Start, Process, Decision, End, and Custom nodes
- **Rich Customization** - Beautiful gradients, icons, and colors for visual appeal
- **Real-time Editing** - Instantly see changes as you build your workflows
- **Responsive Design** - Works seamlessly across desktop and mobile devices
- **Dark Mode Support** - Built-in dark mode theme

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Workflow Editor:** React Flow (@xyflow/react)
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **TypeScript:** Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm, yarn, pnpm, or bun

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
nodeflow/
├── app/
│   ├── page.tsx              # Home/Landing page
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard with workflow overview
│   ├── editor/
│   │   └── page.tsx          # Workflow editor with React Flow
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # Reusable UI components (shadcn)
│   └── workflow/             # Custom workflow node components
│       ├── CustomNode.tsx
│       ├── ProcessNode.tsx
│       ├── DecisionNode.tsx
│       ├── StartNode.tsx
│       └── EndNode.tsx
├── lib/
│   └── utils.ts              # Utility functions
└── package.json
```

## Pages

### Home Page (/)
- Beautiful hero section with gradient text
- Feature showcase with colorful cards
- Call-to-action sections
- Responsive navigation

### Dashboard (/dashboard)
- Workflow overview with statistics
- Search and filter workflows
- Grid view of all workflows
- Status indicators and metadata

### Editor (/editor)
- React Flow canvas for building workflows
- Left sidebar with node palette
- Right sidebar for properties
- Top toolbar with actions (Save, Run, Undo, Redo)
- Multiple node types with rich styling

## Node Types

1. **Start Node** (Green) - Begin workflow
2. **Process Node** (Blue) - Action steps
3. **Decision Node** (Orange) - Conditional branches with multiple outputs
4. **End Node** (Red) - Finish workflow
5. **Custom Node** (Purple) - Build your own

## Customization

### Colors
The app uses a beautiful color palette with gradients:
- Primary: Purple (#a855f7)
- Accent: Pink, Blue, Orange, Green
- All colors support dark mode

### Adding New Node Types
1. Create a new component in `components/workflow/`
2. Import and register it in `app/editor/page.tsx`
3. Add it to the node palette sidebar

## Next Steps (Backend & Advanced Features)

### Backend Integration
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication & authorization
- [ ] Save/load workflows from database
- [ ] Real-time collaboration with WebSockets
- [ ] Workflow execution engine
- [ ] REST API endpoints for CRUD operations
- [ ] Version control for workflows

### Additional Features
- [ ] Rich text editing in nodes (Tiptap integration)
- [ ] More node types (Webhook, Email, API, Timer, etc.)
- [ ] Export workflows (PNG, SVG, JSON)
- [ ] Import workflows from JSON
- [ ] Keyboard shortcuts
- [ ] Undo/Redo functionality
- [ ] Node grouping and organization
- [ ] Workflow templates library
- [ ] Analytics and metrics
- [ ] Sharing and permissions

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Flow Documentation](https://reactflow.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT License

## Built With

Made with ❤️ using Next.js and React Flow
