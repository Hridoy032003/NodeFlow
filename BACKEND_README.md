# NodeFlow Backend Architecture

Complete backend system with Prisma, PostgreSQL, NextAuth, and Recoil state management.

## 🚀 Tech Stack

- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Credentials + OAuth)
- **State Management**: Recoil
- **API**: Next.js API Routes (REST)
- **Data Fetching**: SWR (stale-while-revalidate)
- **Type Safety**: TypeScript throughout

## 📦 Dependencies Installed

```bash
# Core Backend
@prisma/client
prisma
next-auth
@auth/prisma-adapter
bcryptjs
@types/bcryptjs

# State Management & Data Fetching
recoil
swr
```

## 🗄️ Database Schema

### Users & Authentication
- **User**: User accounts with credentials or OAuth
- **Account**: OAuth provider accounts
- **Session**: Active user sessions
- **VerificationToken**: Email verification

### Workflows
- **Workflow**: User workflows with metadata
- **Node**: Individual workflow nodes with positions
- **Edge**: Connections between nodes

## 🔐 Authentication System

### NextAuth Configuration
Located in `/lib/auth.ts`

**Providers:**
- Credentials (email/password)
- Google OAuth
- GitHub OAuth

**Features:**
- JWT-based sessions
- Custom signin pages
- User ID in session
- Secure password hashing with bcrypt

### API Routes

#### Register User
```
POST /api/auth/register
Body: { name, email, password }
```

#### Sign In
```
POST /api/auth/[...nextauth]
```

## 📡 API Endpoints

### Workflows

#### Get All Workflows
```
GET /api/workflows
Auth: Required
Returns: Array of user's workflows with node/edge counts
```

#### Create Workflow
```
POST /api/workflows
Auth: Required
Body: { name, description?, isPublic? }
Returns: Created workflow
```

#### Get Workflow
```
GET /api/workflows/{id}
Auth: Required (owner or public)
Returns: { workflow, nodes, edges }
```

#### Update Workflow (Save)
```
PUT /api/workflows/{id}
Auth: Required (owner only)
Body: { nodes, edges }
Returns: Updated workflow
```

#### Update Workflow Details
```
PATCH /api/workflows/{id}/details
Auth: Required (owner only)
Body: { name?, description?, isPublic? }
Returns: Updated workflow
```

#### Delete Workflow
```
DELETE /api/workflows/{id}
Auth: Required (owner only)
Returns: { success: true }
```

## 🔄 State Management with Recoil

### Atoms (Global State)

Located in `/lib/store/atoms/workflowAtoms.ts`

```typescript
currentWorkflowAtom       // Current loaded workflow
workflowNodesAtom        // Array of nodes
workflowEdgesAtom        // Array of edges
selectedNodeAtom         // Currently selected node
isLoadingAtom           // Loading state
isSavingAtom            // Saving state
workflowListAtom        // List of all workflows
```

### Selectors (Derived State)

Located in `/lib/store/selectors/workflowSelectors.ts`

```typescript
nodeCountSelector           // Total node count
edgeCountSelector          // Total edge count
customNodeCountSelector    // Custom node count
nodeRelationshipsSelector  // Parent-child relationships
rootNodesSelector          // Nodes with no parents
```

## 🪝 Custom Hooks

### useWorkflows()

Fetches all workflows for the current user with SWR.

```typescript
const { workflows, isLoading, error, mutate } = useWorkflows();
```

### useWorkflowOperations()

CRUD operations for workflows.

```typescript
const {
  createWorkflow,      // (name, description?) => Promise<Workflow>
  loadWorkflow,        // (id) => Promise<WorkflowData>
  saveWorkflow,        // () => Promise<Workflow>
  deleteWorkflow,      // (id) => Promise<boolean>
  updateWorkflowDetails, // (name, description?) => Promise<Workflow>
  error
} = useWorkflowOperations();
```

## 📁 Professional Folder Structure

```
lib/
├── store/
│   ├── atoms/          # Recoil atoms
│   ├── selectors/      # Derived state
│   └── RecoilProvider.tsx
├── hooks/              # Custom data hooks
│   ├── useWorkflows.ts
│   └── useWorkflowOperations.ts
├── prisma.ts          # Database client
└── auth.ts            # Auth configuration

app/api/
├── auth/
│   ├── [...nextauth]/route.ts
│   └── register/route.ts
└── workflows/
    ├── route.ts
    └── [id]/
        ├── route.ts
        └── details/route.ts

prisma/
└── schema.prisma      # Database schema

types/
└── next-auth.d.ts     # NextAuth types
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup PostgreSQL

See `SETUP_DATABASE.md` for detailed instructions.

```bash
# Create database
createdb nodeflow

# Or using psql
psql -U postgres
CREATE DATABASE nodeflow;
```

### 3. Configure Environment

Create `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nodeflow"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Generate secret:
```bash
openssl rand -base64 32
```

### 4. Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (optional)
npx prisma studio
```

### 5. Start Development Server

```bash
npm run dev
```

## 🔧 Usage Examples

### Creating a Workflow

```typescript
import { useWorkflowOperations } from '@/lib/hooks/useWorkflowOperations';

function CreateWorkflowButton() {
  const { createWorkflow } = useWorkflowOperations();

  const handleCreate = async () => {
    const workflow = await createWorkflow(
      'My Workflow',
      'Workflow description'
    );
    console.log('Created:', workflow);
  };

  return <button onClick={handleCreate}>Create</button>;
}
```

### Loading a Workflow

```typescript
import { useWorkflowOperations } from '@/lib/hooks/useWorkflowOperations';
import { useSetRecoilState } from 'recoil';
import { workflowNodesAtom, workflowEdgesAtom } from '@/lib/store/atoms/workflowAtoms';

function LoadWorkflow({ workflowId }: { workflowId: string }) {
  const { loadWorkflow } = useWorkflowOperations();

  useEffect(() => {
    loadWorkflow(workflowId);
  }, [workflowId]);

  return <div>Loading workflow...</div>;
}
```

### Saving a Workflow

```typescript
import { useWorkflowOperations } from '@/lib/hooks/useWorkflowOperations';
import { useRecoilValue } from 'recoil';
import { isSavingAtom } from '@/lib/store/atoms/workflowAtoms';

function SaveButton() {
  const { saveWorkflow } = useWorkflowOperations();
  const isSaving = useRecoilValue(isSavingAtom);

  return (
    <button onClick={saveWorkflow} disabled={isSaving}>
      {isSaving ? 'Saving...' : 'Save'}
    </button>
  );
}
```

### Using Recoil State

```typescript
import { useRecoilState, useRecoilValue } from 'recoil';
import { workflowNodesAtom, selectedNodeAtom } from '@/lib/store/atoms/workflowAtoms';
import { nodeCountSelector } from '@/lib/store/selectors/workflowSelectors';

function WorkflowEditor() {
  const [nodes, setNodes] = useRecoilState(workflowNodesAtom);
  const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeAtom);
  const nodeCount = useRecoilValue(nodeCountSelector);

  return (
    <div>
      <p>Total Nodes: {nodeCount}</p>
      {/* React Flow or other UI */}
    </div>
  );
}
```

## 🔒 Security Features

- **Authentication Required**: All workflow endpoints require authentication
- **Owner Verification**: Users can only modify their own workflows
- **Password Hashing**: bcrypt with salt rounds of 12
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React's built-in escaping
- **CSRF Protection**: NextAuth CSRF tokens

## 🚀 Performance Optimizations

- **SWR Caching**: Automatic request deduplication and caching
- **Recoil Selectors**: Memoized derived state
- **Database Indexes**: Indexed userId, createdAt, workflowId
- **Prisma Client**: Connection pooling and query optimization
- **JWT Sessions**: Stateless authentication

## 📊 Database Migrations

```bash
# Create a migration
npx prisma migrate dev --name add_new_feature

# Apply migrations in production
npx prisma migrate deploy

# Reset database (WARNING: deletes data)
npx prisma migrate reset
```

## 🐛 Troubleshooting

### Can't connect to database
- Check if PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Check firewall settings

### Prisma Client errors
```bash
npx prisma generate
```

### NextAuth errors
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain

### Type errors
```bash
npx prisma generate
npm run build
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Recoil Documentation](https://recoiljs.org)
- [SWR Documentation](https://swr.vercel.app)

## 🎯 Next Steps

1. Set up your PostgreSQL database
2. Configure environment variables
3. Run Prisma migrations
4. Test authentication with registration
5. Create your first workflow via API
6. Integrate with the editor UI

## 📝 Notes

- All API routes return JSON
- Authentication uses JWT stored in httpOnly cookies
- Workflows support public sharing via `isPublic` flag
- Parent-child relationships computed client-side for performance
- Database operations are transactional and atomic

---

**Status**: ✅ Backend Complete & Ready for Integration
