---
title: The UI Side
layout: topics
slug: ui
description: UI and Themeing
---
# Approach

## Folder Structure
```
.
└── ui/
    ├── atoms/
    │   └── Button/
    │       ├── Button.component.js
    │       ├── Button.stories.js
    │       ├── Button.style.css
    │       ├── Button.test.js
    │       └── Button.type.js
    ├── molecules
    ├── organisms
    ├── skeletons
    ├── templates
    └── theme.css
```
THis Folder structure organizes UI components into different levels of abstraction, following the **Atomic Design methodology**. Here's a detailed explanation of the structure:

### **Root Folder: `ui/`**
This is the main directory containing all UI-related files and subfolders.

### **Subfolders**
1. **`atoms/`**
   - Contains the smallest, reusable UI components (e.g., buttons, inputs, icons).
   - Example: The `Button` folder includes all files related to the `Button` component:
     - **`Button.component.js`**: The main implementation of the button component.
     - **`Button.stories.js`**: Storybook file to document and test the button visually.
     - **`Button.style.css`**: CSS file for styling the button.
     - **`Button.test.js`**: Unit tests for the button component.
     - **`Button.type.js`**: Type definitions (e.g., PropTypes or TypeScript types) for the button.

2. **`molecules/`**
   - Contains components made by combining multiple atoms. For example, an input field with a label or a search bar.

3. **`organisms/`**
   - Larger, more complex components formed by combining molecules and atoms. Examples include navigation bars or forms.

4. **`skeletons/`**
   - Placeholder components used during loading states to improve user experience.

5. **`templates/`**
   - Defines page layouts by arranging organisms and other components in a structured way.

6. **`theme.css`**
   - A global stylesheet that manages themes, such as colors, fonts, and spacing across the application.

## Architecture
<img src="/assets/img/diagrams/ui-system-diagram.png" alt="server system diagram" />

This diagram visually represents how UI components are organized in Atomic Design:

1. **Atoms**
   - The smallest building blocks (e.g., buttons, inputs).
   - Accessible and reusable.

2. **Molecules**
   - Created by combining atoms to form more complex elements (e.g., search bars or labeled inputs).

3. **Organisms**
   - Larger, functional components formed by combining molecules (e.g., a header with navigation links).

4. **Skeleton**
   - Placeholder UI used during loading states to improve user experience.

5. **Template**
   - Defines the structure of pages by arranging organisms in a layout.

6. **Theme Provider**
   - Ensures consistent styling and theming across the application.
