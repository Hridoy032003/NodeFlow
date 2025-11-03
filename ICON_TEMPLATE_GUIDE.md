# Custom Icon Template System

## Overview

The NodeFlow application now supports a **Custom Icon Template System** that allows users to create workflow nodes with custom icons selected from the Lucide Icons library.

## Features

### 🎨 Icon Picker Component

- **90+ Popular Workflow Icons** available
- **Search functionality** to quickly find icons
- **Visual grid display** with 6 columns
- **Live preview** of selected icon
- **Hover effects** for better UX

### 📦 Available Icon Categories

#### Data & Storage

- Box, Package, Database, Server, Cloud, HardDrive, Folder, File, FileText

#### Communication

- Mail, Send, MessageSquare, MessageCircle, Phone, Bell

#### Actions

- Upload, Download, Send, Copy, Share, Edit, Trash, Refresh, Rotate

#### Status & Feedback

- Check, X, AlertCircle, Info, Activity, TrendingUp, Flag

#### Time & Scheduling

- Calendar, Clock, Timer, Repeat

#### User & Team

- User, Users, UserPlus, Target, Award

#### E-commerce

- ShoppingCart, CreditCard, DollarSign, Tag, Gift

#### Media

- Image, Video, Music, Mic, Camera

#### Navigation

- MapPin, Navigation, Compass, Globe

#### Development

- Code, Terminal, Cpu, Wifi

#### Settings & Tools

- Settings, Tool, Wrench, Sliders, ToggleLeft, Power

...and many more!

## How to Use

### Creating a Custom Node with Icon

1. **Open the Editor** page (`/editor`)

2. **Click "Add Custom Node"** in the left sidebar

3. **Fill in the Node Details**:

   - **Node Name** (Required): Enter a descriptive name for your node
   - **Icon** (Required):
     - Browse through the icon grid
     - Use the search box to filter icons by name
     - Click on an icon to select it
     - See the selected icon preview at the bottom
   - **Work Assignment** (Optional): Describe what work this node performs

4. **Click "Create Node"** to add it to the canvas

5. **The node will appear** with your selected icon and details

### Example Use Cases

#### Data Processing Node

- **Name**: "Data Validation"
- **Icon**: Database
- **Work**: "Validate incoming data against schema rules"

#### Email Notification Node

- **Name**: "Send Confirmation Email"
- **Icon**: Mail
- **Work**: "Send order confirmation email to customer"

#### API Call Node

- **Name**: "Fetch User Data"
- **Icon**: Cloud
- **Work**: "Call external API to retrieve user information"

#### Decision Node

- **Name**: "Check Payment Status"
- **Icon**: CreditCard
- **Work**: "Verify if payment was successful"

#### File Upload Node

- **Name**: "Upload Document"
- **Icon**: Upload
- **Work**: "Upload user document to cloud storage"

## Technical Implementation

### Icon Picker Component

Located at: `components/ui/icon-picker.tsx`

```tsx
import { IconPicker } from "@/components/ui/icon-picker";

<IconPicker value={customNodeIcon} onChange={setCustomNodeIcon} />;
```

### Custom Node with Dynamic Icon

Located at: `components/workflow/CustomNode.tsx`

The CustomNode component dynamically renders icons based on the `data.icon` property:

```tsx
const getIconComponent = () => {
  const iconName = data.icon || "Box";
  const Icon = LucideIcons[iconName];
  return Icon || Box;
};

const IconComponent = getIconComponent();
```

### Node Data Structure

```typescript
{
  id: "1",
  type: "custom",
  position: { x: 100, y: 100 },
  data: {
    label: "My Custom Node",
    description: "Work description here",
    icon: "Database" // Lucide icon name
  }
}
```

## Styling

### Custom Node Icon Display

- **Size**: 12x12 (48px)
- **Background**: Purple to Pink gradient
- **Icon Color**: White
- **Border Radius**: Extra large (rounded-xl)
- **Shadow**: Medium drop shadow

### Icon Picker Grid

- **Columns**: 6 icons per row
- **Height**: 256px (scrollable)
- **Spacing**: 8px gap between icons
- **Selected State**: Purple background with white icon
- **Hover State**: Light purple background

## Benefits

✅ **Visual Clarity**: Icons make nodes instantly recognizable  
✅ **Customization**: Choose from 90+ professional icons  
✅ **Consistency**: All icons from the same Lucide library  
✅ **Flexibility**: Change icons to match your workflow semantics  
✅ **Search**: Quickly find the perfect icon for your node  
✅ **Preview**: See exactly what icon you're selecting

## Future Enhancements

- 🎨 Custom color selection for node backgrounds
- 📁 Icon categories/groups for easier browsing
- ⭐ Favorite/recently used icons
- 🖼️ Upload custom SVG icons
- 🎭 Icon size customization
- 🌈 Multiple gradient presets

---

**Built with Lucide Icons - Over 1000+ beautifully crafted icons**
