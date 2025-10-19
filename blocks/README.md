# Chai Blocks - Component Guidelines

This document provides guidelines for creating Chai blocks from UI components. Follow these patterns to ensure consistency and compatibility with the Chai framework.

## Table of Contents

- [Block Structure](#block-structure)
- [File Naming Convention](#file-naming-convention)
- [Component Pattern](#component-pattern)
- [Configuration Pattern](#configuration-pattern)
- [Registration Pattern](#registration-pattern)
- [Common Properties](#common-properties)
- [Examples](#examples)

## Block Structure

Each Chai block consists of:

1. **Block Component**: A wrapper component that receives `ChaiBlockComponentProps`
2. **Block Configuration**: Metadata and schema definition for the block
3. **Registration**: Dynamic import and registration in `index.ts`

## File Naming Convention

- **File name**: Use kebab-case matching the component name (e.g., `pointer-highlight.tsx`)
- **Component name**: PascalCase with "Block" suffix (e.g., `PointerHighlightBlock`)
- **Config name**: PascalCase with "Config" suffix (e.g., `PointerHighlightConfig`)

## Component Pattern

### Component Requirements

For a UI component to work with Chai blocks, it must accept:
- `styles?: ChaiStyles` - The styles object from Chai (contains `className` and other style props)
- `blockProps?: Record<string, string>` - HTML attributes for the container

**IMPORTANT**: `ChaiStyles` is an object that already contains the `className` property. You **CANNOT** use `className` prop alongside `{...styles}` as they will conflict.

These should be spread onto the component's root element:
```typescript
// Correct: styles and blockProps are always present, just spread them
<div {...blockProps} {...styles}>

// Wrong: Don't use className with styles
<div {...blockProps} {...styles} className="some-classes">  // ❌ This will cause conflicts
```

**Note**: `styles` and `blockProps` are always provided by Chai, so no fallback/optional chaining is needed.

### Block Wrapper Pattern

```typescript
import { ComponentName } from "@/components/ui/component-name";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

// Define props type extending ChaiStyles
type ComponentNameProps = {
  styles: ChaiStyles;
  // Add other component-specific props
  propName: string;
};

// Create the block component
const ComponentNameBlock = (props: ChaiBlockComponentProps<ComponentNameProps>) => {
  return (
    <ComponentName
      styles={props.styles}           // Pass ChaiStyles object
      blockProps={props.blockProps}   // Pass blockProps for HTML attributes
      propName={props.propName}       // Map other props
      // Add other component-specific props
    >
      {props.children}
    </ComponentName>
  );
};

export default ComponentNameBlock;
```

## Configuration Pattern

```typescript
const ComponentNameConfig = {
  // Unique identifier for the block
  type: "ComponentName",
  
  // Display name in the UI
  label: "Component Name",
  
  // Category for organization
  category: "core",
  
  // Group for categorization in UI
  group: "Group Name",  // e.g., "Cursor & Pointers", "background", "text"
  
  // Schema definition
  ...registerChaiBlockSchema({
    properties: {
      // Always include styles
      styles: StylesProp("default-classes"),
      
      // Add component-specific properties
      propName: {
        type: "string" | "number" | "boolean",
        default: "default-value",
        title: "Display Name",
        // Optional UI hints
        ui: { "ui:widget": "icon" | "textarea" | "color" },
      },
    },
  }),
  
  // Optional: i18n support for text properties
  i18nProps: ["propName"],
  
  // Define if block can accept children
  canAcceptBlock: () => true | false,
};

export { ComponentNameConfig };
```

## Registration Pattern

In `blocks/index.ts`:

```typescript
// 1. Import the config
import { ComponentNameConfig } from "./component-name";

// 2. Create dynamic import
const ComponentNameBlock = dynamic(() => import("./component-name")) as any;

// 3. Register in the registerBlocks function
export const registerBlocks = () => {
  registerChaiBlock(ComponentNameBlock, ComponentNameConfig);
  // ... other blocks
};
```

## Common Properties

### Styles Property

Always include a `styles` property using `StylesProp`:

```typescript
styles: StylesProp("default-tailwind-classes")
```

**Key Points**:
- The classes in `StylesProp()` become the default classes for the component's root element
- Move any hardcoded classes from the component to the block's `StylesProp()` default
- `ChaiStyles` is an object containing `className` and other style-related props
- When `styles` is spread on an element, it already includes the `className` prop

### Property Types

- **String**: `{ type: "string", default: "", title: "Label" }`
- **Number**: `{ type: "number", default: 0, title: "Label" }`
- **Boolean**: `{ type: "boolean", default: false, title: "Label" }`

### UI Widgets

Specify custom UI widgets for properties:

```typescript
ui: { "ui:widget": "icon" }      // Icon picker
ui: { "ui:widget": "textarea" }  // Multi-line text
ui: { "ui:widget": "color" }     // Color picker
```

### i18n Support

For text properties that need translation:

```typescript
i18nProps: ["title", "description"]
```

## Examples

### Example 1: Simple Container Block (Background Lines)

```typescript
import { BackgroundLines } from "@/components/ui/background-lines";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type BackgroundLinesProps = {
  styles: ChaiStyles;
};

const BackgroundLinesBlock = (props: ChaiBlockComponentProps<BackgroundLinesProps>) => {
  return <BackgroundLines {...props}>{props.children}</BackgroundLines>;
};

const BackgroundLinesConfig = {
  type: "BackgroundLines",
  label: "Background Lines",
  category: "core",
  group: "background",
  ...registerChaiBlockSchema({
    properties: {
      // Default classes for the container - these replace hardcoded classes in the component
      styles: StylesProp("h-[20rem] md:h-screen w-full"),
    },
  }),
  canAcceptBlock: () => true,
};

export { BackgroundLinesConfig };
export default BackgroundLinesBlock;
```

**Note**: The component spreads `{...blockProps}` and `{...styles}` on its root element. The `styles` object contains the `className` prop, so no separate `className` is needed.

### Example 2: Block with Custom Props (Following Pointer)

```typescript
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

export default function FollowerPointerCardBlock(
  props: ChaiBlockComponentProps<{ styles: ChaiStyles; title: string; cursorIcon: string }>,
) {
  return <FollowerPointerCard {...props}>{props.children}</FollowerPointerCard>;
}

export const FollowingPointerConfig = {
  type: "FollowingPointer",
  label: "Following Pointer",
  category: "core",
  group: "Cursor & Pointers",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("text-4xl font-bold"),
      title: {
        type: "string",
        default: "",
        title: "Cursor Title",
      },
      cursorIcon: {
        type: "string",
        default: "",
        title: "Cursor Icon",
        ui: { "ui:widget": "icon" },
      },
    },
  }),
  i18nProps: ["title"],
  canAcceptBlock: () => true,
};
```

### Example 3: Block with Multiple Style Props (Pointer Highlight)

```typescript
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type PointerHighlightProps = {
  styles: ChaiStyles;
  rectangleClassName: string;
  pointerClassName: string;
};

const PointerHighlightBlock = (props: ChaiBlockComponentProps<PointerHighlightProps>) => {
  return (
    <PointerHighlight
      styles={props.styles}
      blockProps={props.blockProps}
      rectangleClassName={props.rectangleClassName}
      pointerClassName={props.pointerClassName}>
      {props.children}
    </PointerHighlight>
  );
};

const PointerHighlightConfig = {
  type: "PointerHighlight",
  label: "Pointer Highlight",
  category: "core",
  group: "Cursor & Pointers",
  ...registerChaiBlockSchema({
    properties: {
      // Default classes moved from component's hardcoded className to block config
      styles: StylesProp("relative w-fit"),
      rectangleClassName: {
        type: "string",
        default: "border-border",
        title: "Rectangle Border Style",
      },
      pointerClassName: {
        type: "string",
        default: "h-5 w-5 text-blue-500",
        title: "Pointer Icon Style",
      },
    },
  }),
  canAcceptBlock: () => true,
};

// Component implementation should use:
// <div {...blockProps} {...styles} ref={ref}>

export { PointerHighlightConfig };
export default PointerHighlightBlock;
```

## Best Practices

1. **Always use StylesProp** for the main container styles
2. **Map props correctly** - ensure component props match the block props
3. **Provide sensible defaults** - use the component's default values
4. **Group related blocks** - use consistent group names for similar components
5. **Export both config and component** - follow the export pattern
6. **Use TypeScript** - define proper types for props
7. **Support children** - set `canAcceptBlock` appropriately
8. **Add i18n support** - include text properties in `i18nProps`

## Troubleshooting

### Component not appearing in UI
- Check if block is registered in `index.ts`
- Verify the `type` is unique
- Ensure dynamic import path is correct

### Props not working
- Verify prop mapping between block and component
- Check if property names match in schema and component
- Ensure default values are appropriate

### Styling issues
- Confirm `styles` prop is mapped to correct className prop
- Check if default classes in `StylesProp` are valid
- Verify Tailwind classes are available

## Additional Resources

- [Chai Framework Documentation](https://chai.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
