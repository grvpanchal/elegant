---
title: The UI Side
layout: topics
slug: ui
description: UI and Themeing
---
## Approach

### Folder Structure
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

#### **Root Folder: `ui/`**
This is the main directory containing all UI-related files and subfolders.

#### **Subfolders**
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

### Architecture
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

###### Key Concept 1:
### Scaffolding

Inline
<p class="codepen" data-height="300" data-default-tab="js,result" data-slug-hash="RNwxqBm" data-pen-title="React Function Component Examples" data-user="grvpanchal" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/grvpanchal/pen/RNwxqBm">
  React Function Component Examples</a> by Gaurav Panchal (<a href="https://codepen.io/grvpanchal">@grvpanchal</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://public.codepenassets.com/embed/index.js"></script>

Block

Iterable

Sections / articles

Sementic Layout

###### Key Concept 2:
### Atomic Design

Atomic design docs

<img src="{{ '/assets/img/atomic-design.png' | relative_url }}">

## Standardizing Base Component Objects

<img src="{{ '/assets/img/css-components.webp' | relative_url }}">

- Atom JSON
- Molecule JSON
- Iteratable Molecule JSON
- Organism JSON with responsiveness
- Template Placeholders and slots

#### Identifying an Organism in Design

Data Isolation with Objects

Default

Error  

###### Key Concept 3:
### Themeing

#### SCARFS

<img src="{{ '/assets/img/css-theme.webp' | relative_url }}">



###### Key Concept 4:
### Connecting UI to Application

Any User Experience delivered with the iteraction of user can be divided onto

- Reflection of Data in ordered pattern
- Easing in of error to make user take actions to provide pathway to happ path
- Dyanimic Loading skeletons to make users gracefully wait for ongoing async operation to deliver the content via network

