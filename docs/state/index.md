---
title: The UX Side
layout: default
---
# The State Side

## Basics
Below are links to basic terminologies conerning UI:
1. [State Basics](./state)
2. [Actions](./actions)
3. [CRUD](./crud)
4. [AJAX](./ajax)
5. [Reducer](./reducer)
6. [Operations](./operations)
7. [Selectors](./selectors)
8. [Middleware](./middleware)

## Approach

### Folder Structure
The State is UI and JS Framework agnostic i.e. It allows any framework like React/Bootstap/Vue/Angular to bind with it. All the implementation is purely in JavaScript or TypeScript make it easy to evolve the business to keep its models regardless of evolution of UI.
```
- state
    - item
       - item.initial.js
       - item.type.js
       - item.reducer.js
       - item.selectors.js
       - item.operations.js
       - item.helper.js
```
Non asyncronous activity do not require operations file and purely work with 

### Organizing state for Organisms

Remember MapDispatch to MapStateToProps. Were very famous initial. Further React got famous more external non frontend dev involved without asking why React. Grand Scale involvement demanded faster delivery and thought that MapDispatch to MapStateToProps is slow technique moved forward almost stateless. Such solutions were non maintainable non bulletproof, non scalable just to extact out of the clients. Rather than having an out of box analysis, they skipped steps to earn money. Analsis would have given a realisation that 90% of the code is repetative or prebuilt with CSS Framework. The 10% that you have to work are specific points i.e. Build the organism with CSS framework components and collective API response mapping for reducer that would eventually pass it on to the organism. State Operations have evolved from MapState and MapDispatch to queries and mutations.

```
            page
            |
            template
            |
Organism - Container - State
            |
            Chunk Config
            |
            Widget
            |
            Other MFE Page
```

### Naming Selection

- Action Name String in underscores
- Action Function CRUD namimg convention in camelCase
- camelCase API names in suffix of API
- camelCase Operation name in suffix Operation
- Helper and Selectors function with get and set as prefix of variable name

### Identifying Sync and Async Operations
- Inserting Loading States on your scaffolding to support Sync
- Active
- Passive
- Partial Passive


### Adopting CRUD Naming
- Create\[Item\]
- Read\[Items\]
- Read\[Item\]
- Update\[Item\]
- Update\[Prop\]\[Item\]
- Delete\[Item\]


### Scaling with MicroFrontend
State can be used indepedently as common state in state tree to provide access to common business logic through out the business unit. With expansion of modularing with micro services/frontend, It has become quintessential to include common state throughout the platform. Using this architecture tactic, common reducer mechanism is possible

### Third Party Integration

If organism and state are pure designed with JSON Scaffolding, third party integration (data measurement ops and personalization) becomes seamless. All the measurement of event or personalization for data can be simulated by modulation the incoming data properties and outgoing events of the organisms.
Below is example for overide in state