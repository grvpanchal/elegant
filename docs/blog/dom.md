---
title: Element
layout: default
---
#### DOM

- The Document Object Model (DOM) is a cross-platform and language-independent interface that treats an HTML or XML document as a tree structure wherein each node is an object representing a part of the document.
- Each HTML tag is represent as a node in a tree and browser generates page using nodes and browser engine's(Blink, WebKit) predefined rules. 
- There are three types of DOM which is used by browser or frameworks. 
    1. Real DOM 
    - This is used by browser to generate the tree from HTML page and render the page
    2. Virtual DOM
    - It is copy of the actual DOM and it's kept it in memory. Whenever any changes happen it will update the the data in the Virtual DOM and by comparing it with real DOM it only updates the part that is changed. 
    3. Shadow DOM
    - Shadow DOM provides a way to add a separate isolated and encapsulated DOM tree to an element.
    - It allows a component to have its very own "shadow" DOM tree, that can't be accidentally accessed from the main document, may have local style rules, and more.
    - In laymen's term it's scoped DOM. 
    - There are two modes. 
        - Open
            - Code can access shadow DOM
        - Closed
            - Can't access the shadow DOM
            - e.g. Input type range


