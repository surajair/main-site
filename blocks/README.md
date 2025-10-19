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

**IMPORTANT RULES**:

1. **blockProps goes on the outermost tag only** - Always spread `{...blockProps}` on the root/container element
2. **styles goes on the element(s) you want to style** - Can be on the same element as blockProps or on child elements
3. **No fallback operators needed** - `styles` and `blockProps` are always provided by Chai, so don't use `||` or `??`
4. **Use cn() to merge classes** - When you need to merge dynamic classes with styles.className, use `cn(dynamicClasses, styles?.className)`
5. **ChaiStyles is an object** - It contains `className` and other style props, so spread it with `{...styles}`

```typescript
// ✅ Correct: blockProps on outermost, styles on styled element
<div {...blockProps} {...styles}>

// ✅ Correct: blockProps on outer, styles on inner element
<div {...blockProps}>
  <span {...styles}>Content</span>
</div>

// ✅ Correct: Merging dynamic classes with cn()
<div {...blockProps} {...styles} className={cn(dynamicPattern, styles?.className)}>

// ❌ Wrong: Using className alongside styles without cn()
<div {...blockProps} {...styles} className="some-classes">  // Will cause conflicts

// ❌ Wrong: Using fallback operators
<div {...(blockProps || {})} {...(styles || { className: "fallback" })}>  // Unnecessary
```

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
- **Enum (String)**: `{ type: "string", enum: ["option1", "option2"], default: "option1", title: "Label" }`
- **Enum (Number)**: `{ type: "number", enum: [45, 90, 135], default: 45, title: "Label" }`

**Use enums for**:
- Predefined options (colors, sizes, patterns)
- Angle values
- Any property with a fixed set of choices

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
  rectangleStyles: ChaiStyles;
  pointerStyles: ChaiStyles;
};

const PointerHighlightBlock = (props: ChaiBlockComponentProps<PointerHighlightProps>) => {
  return (
    <PointerHighlight
      styles={props.styles}
      blockProps={props.blockProps}
      rectangleStyles={props.rectangleStyles}
      pointerStyles={props.pointerStyles}>
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
      // All style properties use ChaiStyles type with StylesProp
      styles: StylesProp("relative w-fit"),
      rectangleStyles: StylesProp("absolute inset-0 border border-border"),
      pointerStyles: StylesProp("h-5 w-5 text-blue-500"),
    },
  }),
  canAcceptBlock: () => true,
};

// Component implementation should use:
// <div {...blockProps} {...styles} ref={ref}>
//   <motion.div {...rectangleStyles}>
//   <Pointer {...pointerStyles} />

export { PointerHighlightConfig };
export default PointerHighlightBlock;
```

### Example 4: Block with Enums and Dynamic Classes (Background Grid)

```typescript
import GridBackground from "@/components/ui/background-grid";
import { ChaiBlockComponentProps, ChaiStyles, registerChaiBlockSchema, StylesProp } from "chai-next/blocks";

type BackgroundGridProps = {
  styles: ChaiStyles;
  patternType: "grid" | "dots" | "grid-fade" | "dots-fade";
  gridSize: "sm" | "md" | "lg" | "xl";
  gridColor: "gray" | "slate" | "zinc" | "neutral" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky";
};

const BackgroundGridBlock = (props: ChaiBlockComponentProps<BackgroundGridProps>) => {
  return (
    <GridBackground
      styles={props.styles}
      blockProps={props.blockProps}
      patternType={props.patternType}
      gridSize={props.gridSize}
      gridColor={props.gridColor}
    />
  );
};

const BackgroundGridConfig = {
  type: "BackgroundGrid",
  label: "Background Grid",
  category: "core",
  group: "background",
  ...registerChaiBlockSchema({
    properties: {
      styles: StylesProp("absolute inset-0 -z-10 h-full w-full bg-white"),
      patternType: {
        type: "string",
        enum: ["grid", "dots", "grid-fade", "dots-fade"],
        default: "grid",
        title: "Pattern Type",
      },
      gridSize: {
        type: "string",
        enum: ["sm", "md", "lg", "xl"],
        default: "md",
        title: "Grid Size",
      },
      gridColor: {
        type: "string",
        enum: ["gray", "slate", "zinc", "neutral", "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky"],
        default: "gray",
        title: "Grid Color",
      },
    },
  }),
  canAcceptBlock: () => false,
};

// Component implementation with cn() for merging dynamic classes:
// const patterns = {
//   grid: `bg-[linear-gradient(...)]`,
//   dots: `bg-[radial-gradient(...)]`,
// };
// 
// return (
//   <div
//     {...blockProps}
//     {...styles}
//     className={cn(patterns[patternType], styles?.className)}
//     style={{ backgroundSize: `${sizeMap[gridSize]} ${sizeMap[gridSize]}` }}
//   />
// );

export { BackgroundGridConfig };
export default BackgroundGridBlock;
```

**Key Points**:
- Uses `enum` arrays for predefined options (patternType, gridSize, gridColor)
- Component computes dynamic pattern classes based on props
- Uses `cn()` to merge dynamic pattern with `styles?.className`
- `blockProps` on outermost element, `styles` merged with dynamic classes

## Best Practices

1. **blockProps placement** - Always spread `{...blockProps}` on the outermost/root element only
2. **styles placement** - Spread `{...styles}` on the element(s) you want to style (can be root or child elements)
3. **No fallback operators** - Never use `||` or `??` with styles or blockProps - they're always present
4. **Use cn() for merging** - When merging dynamic classes with styles, use `cn(dynamicClasses, styles?.className)`
5. **Use ChaiStyles for all style properties** - Instead of `string` type for className props, use `ChaiStyles` type with `StylesProp()`
6. **Use enums for options** - Define enum arrays for properties with predefined choices (colors, sizes, patterns, angles)
7. **Map props correctly** - Ensure component props match the block props exactly
8. **Provide sensible defaults** - Use the component's default values in `StylesProp()` and property defaults
9. **Group related blocks** - Use consistent group names: "background", "text", "Cursor & Pointers", etc.
10. **Export both config and component** - Always export both the config object and default block component
11. **Use TypeScript** - Define proper types for all props
12. **Support children appropriately** - Set `canAcceptBlock: () => true` for containers, `false` for leaf components
13. **Add i18n support** - Include text properties in `i18nProps` array
14. **Component file location** - UI components go in `components/ui/`, blocks go in `blocks/`

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
- Confirm `styles` prop is spread correctly with `{...styles}`
- Check if default classes in `StylesProp` are valid Tailwind classes
- Verify Tailwind classes are available and not purged
- If merging dynamic classes, ensure you're using `cn()` utility
- Check that `blockProps` is only on the outermost element

### Dynamic classes not applying
- Use `cn()` to merge: `className={cn(dynamicClasses, styles?.className)}`
- Import cn from `@/lib/utils`
- Ensure dynamic classes are computed before the return statement

## Additional Resources

- [Chai Framework Documentation](https://chai.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
