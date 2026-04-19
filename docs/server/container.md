---
title: Container
layout: doc
slug: container
---

# Container

> - Smart wrappers that handle data and logic
> - Separates data fetching from UI rendering
> - Enables reusable and testable component architecture

## Key Insight

Container components are **smart wrappers that handle data and logic**, while presentational components are **dumb renderers that handle UI**. This "**brain vs beauty**" separation means containers know about Redux, API calls, and business logic, while presentational components only know about props and rendering. The pattern prevents the common anti-pattern of mixing data fetching with JSX rendering, which creates components that are impossible to reuse or test in isolation.

## Detailed Description

The Container/Presentational pattern (also called Smart/Dumb components) is a fundamental React architecture that separates concerns into two distinct component types.

**Container Components (Smart Components):**

- **Purpose**: Manage data, state, and side effects
- **Responsibilities**: Fetch data from APIs, connect to Redux store, handle business logic, manage local state, coordinate child components
- **Characteristics**: Usually contain state, lifecycle methods (or hooks), and logic. Minimal or no JSX markup.
- **Naming Convention**: `UserListContainer`, `TodoContainerComponent`, or simply `UserList.container.js`
- **Knowledge**: Aware of Redux, routing, API structure, business rules

**Presentational Components (Dumb Components):**

- **Purpose**: Render UI based on props
- **Responsibilities**: Display data, emit callbacks when user interacts, handle styling and accessibility
- **Characteristics**: Stateless (functional components), receive data and callbacks via props, highly reusable
- **Naming Convention**: `UserList`, `TodoItem`, or simply `UserList.js`
- **Knowledge**: Only aware of props and UI patterns

**Why This Pattern Matters:**

1. **Reusability**: Presentational components can be reused with different data sources (Redux, REST API, GraphQL, local state, hardcoded data for Storybook)
2. **Testability**: Presentational components are pure functions (props → UI) making them trivial to test. Containers isolate complex logic.
3. **Separation of Concerns**: Data fetching bugs don't affect UI, styling changes don't break data flow
4. **Team Collaboration**: Backend devs work on containers (API integration), frontend devs work on presentational components (UI)
5. **Storybook Integration**: Presentational components make perfect Storybook stories since they don't need API mocks

**Modern React Context:**
With React Hooks, the pattern has evolved. Custom hooks (like `useUsers()`, `useTodos()`) often replace containers, but the **separation principle remains critical**: components that fetch data should be separate from components that render data.

References

- [1] https://medium.com/@learnreact/container-components-c0e67432e005
## Code Examples

### Basic Example: TodoList Container Pattern

```javascript
// ===== PRESENTATIONAL COMPONENT =====
// TodoList.js - Pure presentational component

import React from 'react';
import PropTypes from 'prop-types';

function TodoList({ todos, onToggle, onDelete, isLoading, error }) {
  if (isLoading) {
    return <div className="loading">Loading todos...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  if (todos.length === 0) {
    return <div className="empty">No todos yet. Add one!</div>;
  }
  
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          />
          <span>{todo.text}</span>
          <button 
            onClick={() => onDelete(todo.id)}
            aria-label={`Delete "${todo.text}"`}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

// PropTypes document data expectations
TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    })
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string
};

export default TodoList;


// ===== CONTAINER COMPONENT (Class Component) =====
// TodoListContainer.js - Handles data fetching and state

import React, { Component } from 'react';
import TodoList from './TodoList';
import { fetchTodos, updateTodo, deleteTodo } from '../api/todos';

class TodoListContainer extends Component {
  state = {
    todos: [],
    isLoading: true,
    error: null
  };
  
  componentDidMount() {
    this.loadTodos();
  }
  
  loadTodos = async () => {
    try {
      this.setState({ isLoading: true, error: null });
      const todos = await fetchTodos();
      this.setState({ todos, isLoading: false });
    } catch (error) {
      this.setState({ error: error.message, isLoading: false });
    }
  };
  
  handleToggle = async (id) => {
    const todo = this.state.todos.find(t => t.id === id);
    if (!todo) return;
    
    try {
      const updated = await updateTodo(id, { completed: !todo.completed });
      this.setState(prevState => ({
        todos: prevState.todos.map(t => t.id === id ? updated : t)
      }));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };
  
  handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      this.setState(prevState => ({
        todos: prevState.todos.filter(t => t.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };
  
  render() {
    const { todos, isLoading, error } = this.state;
    
    return (
      <TodoList
        todos={todos}
        onToggle={this.handleToggle}
        onDelete={this.handleDelete}
        isLoading={isLoading}
        error={error}
      />
    );
  }
}

export default TodoListContainer;
```

### Practical Example: Modern React Hooks Approach

```javascript
// ===== CUSTOM HOOK (Replaces Container) =====
// hooks/useTodos.js - Encapsulates data fetching logic

import { useState, useEffect } from 'react';
import { fetchTodos, updateTodo, deleteTodo } from '../api/todos';

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadTodos();
  }, []);
  
  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    try {
      const updated = await updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };
  
  const deleteTodoItem = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };
  
  return {
    todos,
    isLoading,
    error,
    toggleTodo,
    deleteTodoItem,
    refetch: loadTodos
  };
}


// ===== PRESENTATIONAL COMPONENT =====
// TodoList.js - Same as before, pure UI

function TodoList({ todos, onToggle, onDelete, isLoading, error }) {
  // ... (same implementation as before)
}


// ===== PAGE COMPONENT (Uses Hook) =====
// pages/TodoPage.js - Composes hook + presentational component

import React from 'react';
import { useTodos } from '../hooks/useTodos';
import TodoList from '../components/TodoList';

function TodoPage() {
  const { todos, isLoading, error, toggleTodo, deleteTodoItem } = useTodos();
  
  return (
    <div className="todo-page">
      <h1>My Todos</h1>
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodoItem}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default TodoPage;
```

### Advanced Example: Redux Container Pattern

```javascript
// ===== PRESENTATIONAL COMPONENT =====
// UserList.js - Pure UI component

import React from 'react';
import PropTypes from 'prop-types';

function UserList({ users, selectedUserId, onSelectUser, onDeleteUser }) {
  return (
    <div className="user-list">
      {users.map(user => (
        <div
          key={user.id}
          className={`user-card ${selectedUserId === user.id ? 'selected' : ''}`}
          onClick={() => onSelectUser(user.id)}>
          <img src={user.avatar} alt={user.name} />
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDeleteUser(user.id);
            }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedUserId: PropTypes.number,
  onSelectUser: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired
};

export default UserList;


// ===== REDUX ACTIONS =====
// actions/userActions.js

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const SELECT_USER = 'SELECT_USER';
export const DELETE_USER = 'DELETE_USER';

export const fetchUsers = () => async (dispatch) => {
  dispatch({ type: FETCH_USERS_REQUEST });
  
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    dispatch({ type: FETCH_USERS_SUCCESS, payload: users });
  } catch (error) {
    dispatch({ type: FETCH_USERS_FAILURE, payload: error.message });
  }
};

export const selectUser = (userId) => ({
  type: SELECT_USER,
  payload: userId
});

export const deleteUser = (userId) => ({
  type: DELETE_USER,
  payload: userId
});


// ===== REDUX REDUCER =====
// reducers/userReducer.js

const initialState = {
  users: [],
  selectedUserId: null,
  isLoading: false,
  error: null
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return { ...state, isLoading: true, error: null };
    
    case FETCH_USERS_SUCCESS:
      return { ...state, isLoading: false, users: action.payload };
    
    case FETCH_USERS_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    
    case SELECT_USER:
      return { ...state, selectedUserId: action.payload };
    
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.payload),
        selectedUserId: state.selectedUserId === action.payload ? null : state.selectedUserId
      };
    
    default:
      return state;
  }
}


// ===== CONTAINER COMPONENT (Redux Connect) =====
// containers/UserListContainer.js

import { connect } from 'react-redux';
import UserList from '../components/UserList';
import { fetchUsers, selectUser, deleteUser } from '../actions/userActions';

// mapStateToProps: Extract data from Redux store
const mapStateToProps = (state) => ({
  users: state.users.users,
  selectedUserId: state.users.selectedUserId,
  isLoading: state.users.isLoading,
  error: state.users.error
});

// mapDispatchToProps: Bind action creators
const mapDispatchToProps = {
  onSelectUser: selectUser,
  onDeleteUser: deleteUser,
  fetchUsers
};

// Connected component
const UserListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);

export default UserListContainer;


// ===== USAGE IN PAGE =====
// pages/UsersPage.js

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import UserListContainer from '../containers/UserListContainer';
import { fetchUsers } from '../actions/userActions';

function UsersPage() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  return (
    <div className="users-page">
      <h1>Users</h1>
      <UserListContainer />
    </div>
  );
}

export default UsersPage;


// ===== MODERN REDUX TOOLKIT ALTERNATIVE =====
// hooks/useUsers.js - Using Redux Toolkit with hooks

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchUsers, selectUser, deleteUser } from '../slices/userSlice';

export function useUsers() {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users);
  const selectedUserId = useSelector(state => state.users.selectedUserId);
  const isLoading = useSelector(state => state.users.isLoading);
  const error = useSelector(state => state.users.error);
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  return {
    users,
    selectedUserId,
    isLoading,
    error,
    selectUser: (id) => dispatch(selectUser(id)),
    deleteUser: (id) => dispatch(deleteUser(id))
  };
}

// Usage: Same presentational UserList component
// No container needed - just use the hook in the page
```

## Common Mistakes

### 1. Mixing Data Fetching with Rendering
**Mistake:** Putting API calls and complex JSX in the same component.

```javascript
// ❌ BAD: Component does too much
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Data fetching mixed with rendering
    async function loadData() {
      const userData = await fetch(`/api/users/${userId}`).then(r => r.json());
      const postsData = await fetch(`/api/users/${userId}/posts`).then(r => r.json());
      setUser(userData);
      setPosts(postsData);
      setIsLoading(false);
    }
    loadData();
  }, [userId]);
  
  if (isLoading) return <div>Loading...</div>;
  
  // Complex rendering logic
  return (
    <div className="user-profile">
      <div className="user-header">
        <img src={user.avatar} alt={user.name} />
        <h1>{user.name}</h1>
        <p>{user.bio}</p>
      </div>
      <div className="user-stats">
        <span>Posts: {posts.length}</span>
        <span>Followers: {user.followers}</span>
      </div>
      <div className="user-posts">
        {posts.map(post => (
          <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
// Can't reuse this component with different data sources
// Can't test UI without mocking fetch
// Can't use in Storybook without API


// ✅ GOOD: Separate container and presentational

// Custom hook (container logic)
function useUserProfile(userId) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      const [userData, postsData] = await Promise.all([
        fetch(`/api/users/${userId}`).then(r => r.json()),
        fetch(`/api/users/${userId}/posts`).then(r => r.json())
      ]);
      setUser(userData);
      setPosts(postsData);
      setIsLoading(false);
    }
    loadData();
  }, [userId]);
  
  return { user, posts, isLoading };
}

// Presentational component
function UserProfile({ user, posts, isLoading }) {
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="user-profile">
      <UserHeader user={user} />
      <UserStats posts={posts} followers={user.followers} />
      <PostList posts={posts} />
    </div>
  );
}

// Page component (uses hook)
function UserProfilePage({ userId }) {
  const { user, posts, isLoading } = useUserProfile(userId);
  return <UserProfile user={user} posts={posts} isLoading={isLoading} />;
}

// Now UserProfile is reusable and testable!
```

**Why it matters:** Mixed components are impossible to reuse, test, or document in Storybook.

### 2. Passing Too Many Individual Props
**Mistake:** Passing 10+ individual props instead of grouped objects.

```javascript
// ❌ BAD: Props explosion
function UserCard({
  id,
  name,
  email,
  avatar,
  bio,
  location,
  website,
  followers,
  following,
  posts,
  onFollow,
  onMessage,
  onBlock
}) {
  return (
    <div className="user-card">
      {/* Using all these props... */}
    </div>
  );
}

// Container passes everything individually
function UserCardContainer({ userId }) {
  const user = useUser(userId);
  
  return (
    <UserCard
      id={user.id}
      name={user.name}
      email={user.email}
      avatar={user.avatar}
      bio={user.bio}
      location={user.location}
      website={user.website}
      followers={user.followers}
      following={user.following}
      posts={user.posts}
      onFollow={handleFollow}
      onMessage={handleMessage}
      onBlock={handleBlock}
    />
  );
}


// ✅ GOOD: Group related data
function UserCard({ user, actions }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      <button onClick={actions.onFollow}>Follow</button>
      <button onClick={actions.onMessage}>Message</button>
    </div>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    bio: PropTypes.string
  }).isRequired,
  actions: PropTypes.shape({
    onFollow: PropTypes.func.isRequired,
    onMessage: PropTypes.func.isRequired,
    onBlock: PropTypes.func.isRequired
  }).isRequired
};

// Container is cleaner
function UserCardContainer({ userId }) {
  const user = useUser(userId);
  const actions = useUserActions(userId);
  
  return <UserCard user={user} actions={actions} />;
}
```

**Why it matters:** Too many props make components hard to use and maintain. Grouped props improve readability.

### 3. Containers Rendering Too Much UI
**Mistake:** Container components containing complex JSX instead of delegating to presentational components.

```javascript
// ❌ BAD: Container has complex UI
function ProductListContainer() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      });
  }, []);
  
  const handleAddToCart = (productId) => {
    // Add to cart logic
  };
  
  // Container has too much UI logic
  return (
    <div className="product-list">
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
              <button onClick={() => handleAddToCart(product.id)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ✅ GOOD: Container delegates to presentational component

// Container: Data fetching only
function ProductListContainer() {
  const { products, isLoading } = useProducts();
  const { addToCart } = useCart();
  
  return (
    <ProductList
      products={products}
      isLoading={isLoading}
      onAddToCart={addToCart}
    />
  );
}

// Presentational: UI only
function ProductList({ products, isLoading, onAddToCart }) {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

// Even more granular
function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <button onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </button>
    </div>
  );
}
```

**Why it matters:** Containers should orchestrate logic, not render UI. Keeping containers thin improves maintainability.

## Quick Quiz

{% include quiz.html id="container-1"
   question="What's the main difference between a container component and a presentational component?"
   options="A|Only end-to-end tests matter; unit tests for components are wasted effort once a container sits on top of real infrastructure;;B|Use the same test for both — render the container with a real store, assert on the rendered DOM, and skip isolating the presentational layer because duplication in tests is a smell;;C|Test presentational components by passing props and asserting rendered DOM / emitted callbacks — they are pure UI. Test containers by providing a mocked store (or query client) and asserting that the correct selectors are read and the correct actions are dispatched. Most teams unit-test presentationals and integration-test containers;;D|Snapshot-test the container; the presentational layer will be covered transitively by the snapshot diffs"
   correct="C"
   explanation="The &quot;smart vs dumb&quot; split lets the UI layer be prop-driven and portable, while the container wires state + side effects in one place." %}

{% include quiz.html id="container-2"
   question="How do React hooks (useSelector, useDispatch, useQuery) change the classic container pattern?"
   options="A|They only work with MobX;;B|They eliminate the need for containers entirely;;C|Hooks make containers mandatory;;D|They blur the container/presentational line — you can co-locate store access inside a component via hooks. The atomic-design discipline is still useful: keep low-level atoms/molecules pure and put hooks in a wrapper (the &quot;container&quot;) so the UI stays framework- and store-agnostic"
   correct="D"
   explanation="Hooks don't remove the pattern, they make it cheaper. A small hook-using wrapper around a presentational component is still a container; it just doesn't need connect()." %}

{% include quiz.html id="container-3"
   question="When would you reach for a Redux-connected container vs a custom hook?"
   options="A|Use a custom hook when one slice of state is consumed locally by one or two components; use a Redux container (or useSelector in a container component) when multiple containers share the same derived data, memoized via selectors, to avoid duplicating subscriptions and re-renders;;B|It's purely stylistic;;C|Redux containers are always better;;D|Custom hooks are deprecated"
   correct="A"
   explanation="Custom hooks are great for colocation; selectors-in-a-container shine when the derivation is shared and expensive." %}

{% include quiz.html id="container-4"
   question="How should you test a container vs a presentational component?"
   options="A|Test presentational components by passing props and asserting on the rendered DOM or events; test containers by providing a mocked store / data layer and asserting that the right actions are dispatched or the right selectors used. Many teams mostly integration-test containers and unit-test presentational components;;B|Only snapshot-test both;;C|Tests are irrelevant;;D|Never test containers"
   correct="A"
   explanation="Keeping the two layers separate makes the presentational tests fast and pure, and the container tests focused on wiring and side effects." %}

{% include quiz.html id="container-5"
   question="How do containers interact with Storybook?"
   options="A|Storybook doesn't support state-management decorators;;B|Storybook usually renders the PRESENTATIONAL component with handcrafted props — sometimes wrapping in decorators that provide a mock Redux/Pinia/NgRx store or Router so a container can be shown in isolation without the real backend. Containers shine in tests, presentationals shine in Storybook;;C|You must disable Storybook for container components;;D|Containers go in Storybook too with a real production store"
   correct="B"
   explanation="Presentational components take props, which Storybook's Controls can drive directly. Containers, if shown at all, get mock context via decorators." %}

## References

- [1] https://medium.com/@learnreact/container-components-c0e67432e005
- [2] https://redux.js.org/tutorials/fundamentals/part-5-ui-react#presentational-and-container-components
