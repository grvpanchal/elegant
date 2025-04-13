---
title: Atomic Design
layout: doc
slug: atomic-design
---
# Atomic Design

Atomic design is a methodology for creating interface design systems, inspired by chemistry and the natural world. It consists of five distinct stages that work together to create a hierarchical and deliberate approach to UI design:

1. **Atoms**: The basic building blocks of interfaces, such as HTML elements like buttons, inputs, and labels.

2. **Molecules**: Simple groups of UI elements functioning together as a unit, like a search form combining a label, input, and button.

3. **Organisms**: Relatively complex components composed of groups of molecules and/or atoms, forming distinct sections of an interface.

4. **Templates**: Page-level objects that place components into a layout and articulate the design's underlying content structure.

5. **Pages**: Specific instances of templates with real representative content, showing the final UI.

## Key Concepts

- **Non-linear process**: Atomic design is a mental model, not a step-by-step process.
- **Concurrent creation**: It allows designers to create both final UIs and their underlying design systems simultaneously.
- **Flexibility**: The methodology can be adapted to different naming conventions that suit specific organizations.
- **Universal application**: Atomic design applies to all user interfaces, not just web-based ones.

## Advantages

1. **Abstract to concrete**: Enables quick shifts between abstract components and concrete implementations.
2. **Content and structure**: Provides a clear separation between content structure and final content while recognizing their interdependence.
3. **Hierarchical understanding**: The chemistry-inspired naming helps convey a sense of hierarchy in the design system.
4. **Effective communication**: Offers a shared language for discussing modularity and design systems within teams.

## Practical Application

Atomic design is not tied to specific technologies like CSS or JavaScript. Instead, it focuses on crafting user interface design systems that can be applied to various platforms and technologies. The methodology helps teams create more effective, deliberate, and hierarchical design systems that can adapt to the dynamic nature of content and user needs.

## References

- [1] https://atomicdesign.bradfrost.com/chapter-2/