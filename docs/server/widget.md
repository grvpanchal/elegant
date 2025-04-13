---
title: Widget
layout: doc
slug: widget
---
# Widget

Building a widget in frontend with a separate UI component involves creating modular, reusable pieces of user interface that can be easily integrated into various parts of your application. Here's a guide on how to approach this:

## Widget Structure

A widget typically consists of two main parts:

1. **UI Component**: The visual representation of the widget.
2. **Container Component**: Handles data fetching, state management, and business logic.

## Creating the UI Component

1. **Keep it simple and focused**: 
   - Design the UI component to be as small and simple as possible.
   - Focus on a single, specific function or piece of the interface.

2. **Make it reusable**:
   - Use props to pass in data and callbacks.
   - Avoid hardcoding any data or functionality.

3. **Implement the visual elements**:
   - Use HTML and CSS to create the structure and style.
   - Ensure the component is responsive and accessible.

## Developing the Container Component

1. **Handle data management**:
   - Fetch required data from APIs or other sources.
   - Manage local state if necessary.

2. **Implement business logic**:
   - Process data before passing it to the UI component.
   - Handle user interactions and events.

3. **Pass data to UI component**:
   - Use props to send data and callbacks to the UI component.

## Best Practices

1. **Separation of concerns**: Keep the UI and logic separate for better maintainability[1].

2. **Prop types**: Use prop types (in React) or similar type checking to ensure correct data is passed to the UI component[2].

3. **Modular design**: Design your widget to be as modular as possible, allowing for easy integration and reuse[5].

4. **Consistent naming**: Use clear, consistent naming conventions for your components and props[3].

5. **Documentation**: Provide clear documentation on how to use and integrate the widget[5].

## Example Implementation

Here's a basic example of how you might structure a widget with separate UI and container components:

```javascript
// UIComponent.js
const UIComponent = ({ data, onAction }) => (
  <div className="widget">
    <h2>{data.title}</h2>
    <p>{data.content}</p>
    <button onClick={onAction}>Click me</button>
  </div>
);

// ContainerComponent.js
const ContainerComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data here
    fetchData().then(setData);
  }, []);

  const handleAction = () => {
    // Handle action here
  };

  if (!data) return <div>Loading...</div>;

  return <UIComponent data={data} onAction={handleAction} />;
};

// Usage
const Widget = () => <ContainerComponent />;
```

By following these guidelines, you can create modular, reusable widgets that separate the UI concerns from data management and business logic, making your frontend more maintainable and scalable[1][2][5].

## References
- [1] https://dev.to/reggi/federated-widgets-frontend-components-and-backend-endpoints-in-one-module-5bp6
- [2] https://blog.function12.io/tag/front-end/best-practices-for-organizing-front-end-components/
- [3] https://github.com/unc-csxl/orientation/blob/main/angular/widgets.md
- [4] https://alexei.me/blog/widget-driven-development/
- [5] https://www.xenonstack.com/insights/micro-frontend-architecture
- [6] https://www.youtube.com/watch?v=dWx6hIL5Gko
- [7] https://www.ramotion.com/blog/micro-frontends/