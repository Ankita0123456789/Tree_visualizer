# Tree Visualizer

A React-based interactive tree visualization tool built with React Flow and TypeScript. This application allows users to create, manage, and visualize hierarchical tree structures with different node types and layout directions.

## Data Model

### Tree Structure

The application uses a hierarchical tree structure where:

- **Nodes** Represents a customer’s account, A loan issued to an account or Asset pledged against a loan
- **Edges** represent relationships between nodes
- **Root nodes** can be either "Account" or "Loan"
- **Child nodes** are added based on parent-child relationships

### Node Data Model

```typescript
interface Node {
  id: string; // Unique identifier
  type: "custom"; // Node type (always "custom" for this app)
  position: {
    // Position coordinates
    x: number;
    y: number;
  };
  data: {
    label: string; // Display name (Account, Loan, Collateral)
    type: string; // Node type identifier
    id: string; // Reference to node ID
  };
}
```

### Edge Data Model

```typescript
interface Edge {
  id: string; // Unique edge identifier
  source: string; // Source node ID
  target: string; // Target node ID
  type: "custom-edge"; // Edge type
}
```

### Parent-Child Relationships

- **Account** → allowed children: `["Collateral", "Loan"]`
- **Loan** → allowed children: `["Collateral"]`
- **Collateral** → no children allowed

### Node Type Definitions

Nodes are categorized by their `label` property:

1. **Account** (`label: "Account"`)

   - Icon: `account_balance` (Material Symbols)
   - Color: `#0077cc` (Blue)
   - children: Collateral, Loan 

2. **Loan** (`label: "Loan"`)

   - Icon: `money_bag` (Material Symbols)
   - Color: `#cc4444` (Red)
   - children: Collateral

3. **Collateral** (`label: "Collateral"`)
   - Icon: `home` (Material Symbols)
   - Color: `#44cc44` (Green)
   - children - (no children)

### Implementation

- **CustomNode Component**: Handles node rendering with icons and colors
- **Material Symbols**: Used for icons
- **Color Coding**: Each node type has a diff color for visual identification
- **Interactive**: Clicking nodes opens the side panel for management

## 🎯 UX Decisions

### Side Panel Design

- **Fixed Position**: Left-aligned, full-height panel
- **Click Outside to Close**: dismissal behavior
- **Color-Coded Sections**:
  - Blue header for information
  - Green section for adding children
  - Red section for destructive actions

### Add/Delete Flow

#### Adding Nodes

1. **Root Node Addition**:

   - Empty state shows "Add Root Node" with Account/Loan options
   - prominent buttons with icons

2. **Child Node Addition**:
   - Side panel shows available child types
   - Buttons use parent node's color scheme

#### Deleting Nodes

- **Cascading Deletion**: Removes node and all descendants
- **Visual Feedback**: Red color indicates destructive action
- **Automatic Cleanup**: Removes associated edges

### Layout Management

- **Four Direction Options**: TB (Top-Bottom), BT (Bottom-Top), LR (Left-Right), RL (Right-Left)
- **Dynamic Edge Routing**: Edges automatically adjust to layout direction
- **Auto-Centering**: View automatically centers after node additions

## Technology Stack

- **React 19**: UI framework
- **TypeScript**: Type safety
- **React Flow**: Graph visualization
- **Dagre**: Graph layout algorithm
- **Tailwind CSS**: Styling
- **Material Symbols**: Icons
- **Vite**: Build tool

## Usage

**Node version required**  -  20.19.0  

1. **Start the application**: `npm run dev`
2. **Add root node**: Click "Add Account" or "Add Loan"
3. **Add children**: Click on a node to open side panel, then add children
4. **Change layout**: Use the direction buttons (Down, Up, Right, Left)
5. **Delete nodes**: Use the delete button in the side panel
