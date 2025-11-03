# NodeFlow Folder Structure

Professional folder organization for the NodeFlow application.

## 📁 Complete Structure

```
nodeflow/
├── app/                              # Next.js 14 App Router
│   ├── api/                          # API Routes
│   │   ├── auth/                     # Authentication endpoints
│   │   │   ├── [...nextauth]/        # NextAuth.js handler
│   │   │   │   └── route.ts
│   │   │   └── register/            # User registration
│   │   │       └── route.ts
│   │   └── workflows/               # Workflow CRUD operations
│   │       ├── route.ts             # GET all, POST new
│   │       └── [id]/                # Specific workflow operations
│   │           ├── route.ts         # GET, PUT, DELETE
│   │           └── details/
│   │               └── route.ts     # PATCH details
│   ├── (public)/                    # Public routes (no auth required)
│   │   ├── (home)/
│   │   │   └── page.tsx            # Landing page
│   │   └── layout.tsx
│   ├── (private)/                   # Protected routes (auth required)
│   │   ├── dashboard/
│   │   │   └── page.tsx            # User dashboard
│   │   ├── editor/
│   │   │   └── page.tsx            # Workflow editor
│   │   └── layout.tsx
│   ├── docs/                        # Documentation page
│   │   └── page.tsx
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
│
├── components/                       # React components
│   ├── ui/                          # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── scroll-area.tsx
│   │   └── icon-picker.tsx
│   ├── workflow/                    # Workflow-specific components
│   │   ├── CustomNode.tsx
│   │   ├── ProcessNode.tsx
│   │   ├── DecisionNode.tsx
│   │   ├── StartNode.tsx
│   │   └── EndNode.tsx
│   └── auth/                        # Authentication components
│       ├── SignInForm.tsx
│       ├── SignUpForm.tsx
│       └── AuthProvider.tsx
│
├── lib/                             # Utility libraries and configurations
│   ├── store/                       # Recoil state management
│   │   ├── atoms/
│   │   │   └── workflowAtoms.ts    # Workflow state atoms
│   │   ├── selectors/
│   │   │   └── workflowSelectors.ts # Derived state selectors
│   │   └── RecoilProvider.tsx      # Recoil root provider
│   ├── hooks/                       # Custom React hooks
│   │   ├── useWorkflows.ts         # Fetch workflows
│   │   ├── useWorkflowOperations.ts # CRUD operations
│   │   └── useAuth.ts              # Authentication hooks
│   ├── utils.ts                     # Utility functions
│   ├── prisma.ts                    # Prisma client singleton
│   └── auth.ts                      # NextAuth configuration
│
├── prisma/                          # Database schema and migrations
│   ├── schema.prisma                # Database schema
│   └── migrations/                  # Migration files
│
├── types/                           # TypeScript type definitions
│   ├── next-auth.d.ts              # NextAuth types
│   └── workflow.ts                  # Workflow types
│
├── public/                          # Static assets
│   ├── images/
│   └── icons/
│
├── .env                             # Environment variables (gitignored)
├── .env.example                     # Example environment variables
├── .gitignore                       # Git ignore rules
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
├── SETUP_DATABASE.md                # Database setup guide
├── FOLDER_STRUCTURE.md              # This file
└── README.md                        # Project documentation
```

## 📋 Key Directories Explained

### `/app` - Next.js App Router
- **api/** - Backend API routes (REST endpoints)
- **Public routes** - No authentication required
- **Private routes** - Protected by authentication middleware

### `/components` - React Components
- **ui/** - Reusable UI components from shadcn/ui
- **workflow/** - Node components for React Flow
- **auth/** - Authentication-related components

### `/lib` - Core Business Logic
- **store/** - Recoil state management (atoms + selectors)
- **hooks/** - Custom React hooks for data fetching and operations
- **prisma.ts** - Database client
- **auth.ts** - Authentication configuration

### `/prisma` - Database Layer
- **schema.prisma** - Database schema definition
- **migrations/** - Database migration history

### `/types` - TypeScript Definitions
- Type definitions for better type safety
- Module augmentation for libraries

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (DATABASE_URL, NEXTAUTH_SECRET) |
| `next.config.ts` | Next.js framework configuration |
| `tailwind.config.ts` | Tailwind CSS styling configuration |
| `tsconfig.json` | TypeScript compiler options |
| `prisma/schema.prisma` | Database schema and models |

## 🚀 Best Practices

### 1. **Component Organization**
- Keep components small and focused
- Use composition over inheritance
- Co-locate related components

### 2. **State Management**
- Use Recoil atoms for global state
- Use selectors for derived state
- Keep state close to where it's used

### 3. **API Routes**
- RESTful conventions
- Proper error handling
- Authentication checks

### 4. **Database**
- Use Prisma for type-safe queries
- Keep migrations in version control
- Use indexes for performance

### 5. **Custom Hooks**
- Encapsulate data fetching logic
- Handle loading and error states
- Make hooks reusable

## 📦 File Naming Conventions

- **Components**: PascalCase (e.g., `CustomNode.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useWorkflows.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `Workflow.ts`)
- **API Routes**: lowercase with hyphens (e.g., `user-settings/route.ts`)

## 🔐 Security

- Never commit `.env` file
- Use environment variables for secrets
- Validate input on API routes
- Sanitize user data before database operations
- Use NextAuth for authentication

## 📝 Adding New Features

### To add a new workflow feature:

1. **Create types** in `/types/workflow.ts`
2. **Create Recoil atoms** in `/lib/store/atoms/`
3. **Create custom hooks** in `/lib/hooks/`
4. **Create API routes** in `/app/api/workflows/`
5. **Update UI components** in `/components/workflow/`
6. **Update editor** in `/app/editor/page.tsx`

### To add a new node type:

1. Create component in `/components/workflow/NewNode.tsx`
2. Register in node types object in editor
3. Add template to sidebar
4. Update types if needed

## 🧪 Testing Structure (Future)

```
nodeflow/
├── __tests__/                # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── e2e/                  # End-to-end tests
```

## 📚 Documentation

- `README.md` - Project overview and getting started
- `SETUP_DATABASE.md` - Database setup instructions
- `FOLDER_STRUCTURE.md` - This file
- `/app/docs/page.tsx` - User-facing documentation
