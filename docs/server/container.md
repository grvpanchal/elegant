---
title: Container
layout: doc
slug: container
---

# Container

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

<details>
<summary><strong>Question 1:</strong> What's the main difference between container and presentational components?</summary>

**Answer:** **Container components handle data/logic (smart). Presentational components handle UI rendering (dumb).**

```javascript
// CONTAINER: Knows about data sources and business logic
function TodoListContainer() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetches from API
    fetch('/api/todos')
      .then(r => r.json())
      .then(data => {
        setTodos(data);
        setIsLoading(false);
      });
  }, []);
  
  const handleToggle = (id) => {
    // Business logic: Update todo
    fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: true })
    });
  };
  
  // Delegates rendering to presentational component
  return <TodoList todos={todos} onToggle={handleToggle} isLoading={isLoading} />;
}

// PRESENTATIONAL: Only knows about props and rendering
function TodoList({ todos, onToggle, isLoading }) {
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
```

**Key distinctions:**

| Container | Presentational |
|-----------|---------------|
| Manages state | Stateless |
| Fetches data | Receives props |
| Knows Redux/API | No external dependencies |
| Minimal JSX | Full UI rendering |
| Hard to reuse | Highly reusable |
| Integration tests | Unit tests (snapshots) |

**Why it matters:** Separation enables reusability and testability.
</details>

<details>
<summary><strong>Question 2:</strong> How do React Hooks change the container pattern?</summary>

**Answer:** **Hooks replace container components with custom hooks that encapsulate logic, keeping presentational components unchanged.**

```javascript
// ===== OLD WAY: Container Component (Class) =====

class UserListContainer extends React.Component {
  state = { users: [], isLoading: true };
  
  componentDidMount() {
    fetch('/api/users')
      .then(r => r.json())
      .then(users => this.setState({ users, isLoading: false }));
  }
  
  render() {
    return <UserList users={this.state.users} isLoading={this.state.isLoading} />;
  }
}


// ===== NEW WAY: Custom Hook =====

function useUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setIsLoading(false);
      });
  }, []);
  
  return { users, isLoading };
}

// Page component uses the hook
function UsersPage() {
  const { users, isLoading } = useUsers();
  return <UserList users={users} isLoading={isLoading} />;
}


// ===== PRESENTATIONAL COMPONENT (UNCHANGED) =====

function UserList({ users, isLoading }) {
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Benefits of custom hooks over containers:**
- **Composition**: Combine multiple hooks (`useUsers()` + `useAuth()`)
- **Reusability**: Share logic across multiple components
- **Cleaner**: No extra wrapper component
- **TypeScript**: Better type inference

**Pattern still applies:** Separate data fetching (hook) from rendering (component).

**Why it matters:** Hooks modernize the pattern but keep the separation principle.
</details>

<details>
<summary><strong>Question 3:</strong> When should you use Redux containers vs custom hooks?</summary>

**Answer:** **Use Redux when state is shared across many components. Use custom hooks for component-specific data.**

```javascript
// ===== USE REDUX: Shared state (shopping cart, auth, theme) =====

// Redux container: Multiple components need cart state
function CartContainer() {
  const items = useSelector(state => state.cart.items);
  const total = useSelector(state => state.cart.total);
  const dispatch = useDispatch();
  
  return (
    <Cart
      items={items}
      total={total}
      onRemove={(id) => dispatch(removeFromCart(id))}
      onCheckout={() => dispatch(checkout())}
    />
  );
}

// Header, ProductList, Checkout page all use same cart state
// Redux ensures consistency


// ===== USE CUSTOM HOOK: Component-specific data =====

// Custom hook: Only this page needs user profile
function useUserProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        setProfile(data);
        setIsLoading(false);
      });
  }, [userId]);
  
  return { profile, isLoading };
}

// Only ProfilePage uses this data
function ProfilePage({ userId }) {
  const { profile, isLoading } = useUserProfile(userId);
  return <UserProfile profile={profile} isLoading={isLoading} />;
}
```

**Decision matrix:**

| Use Redux if... | Use Hook if... |
|----------------|---------------|
| Multiple components need data | Single component needs data |
| Data persists across navigation | Data is page-specific |
| Complex state updates | Simple fetch/update |
| Need time-travel debugging | Don't need global state |

**Hybrid approach:**
```javascript
// Use both: Redux for cart, hook for recommendations
function ProductPage({ productId }) {
  const cart = useSelector(state => state.cart);  // Redux
  const { recommendations } = useRecommendations(productId);  // Hook
  
  return (
    <div>
      <Product product={product} />
      <Recommendations items={recommendations} />
      <CartSummary items={cart.items} />
    </div>
  );
}
```

**Why it matters:** Choose the right tool based on data scope.
</details>

<details>
<summary><strong>Question 4:</strong> How do you test container vs presentational components?</summary>

**Answer:** **Test presentational components with snapshots and prop variations. Test containers with integration tests mocking APIs.**

```javascript
// ===== TESTING PRESENTATIONAL COMPONENT =====

// UserList.test.js - Easy to test (pure function)
import { render, screen } from '@testing-library/react';
import UserList from './UserList';

describe('UserList', () => {
  const mockUsers = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];
  
  it('renders list of users', () => {
    render(<UserList users={mockUsers} onSelectUser={jest.fn()} />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
  
  it('renders empty state', () => {
    render(<UserList users={[]} onSelectUser={jest.fn()} />);
    
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });
  
  it('calls onSelectUser when user clicked', () => {
    const onSelectUser = jest.fn();
    render(<UserList users={mockUsers} onSelectUser={onSelectUser} />);
    
    screen.getByText('Alice').click();
    expect(onSelectUser).toHaveBeenCalledWith(1);
  });
  
  it('matches snapshot', () => {
    const { container } = render(<UserList users={mockUsers} onSelectUser={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
});


// ===== TESTING CONTAINER / HOOK =====

// useUsers.test.js - Integration test with mocked API
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from './useUsers';

// Mock fetch
global.fetch = jest.fn();

describe('useUsers', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  
  it('fetches users on mount', async () => {
    const mockUsers = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];
    
    fetch.mockResolvedValueOnce({
      json: async () => mockUsers
    });
    
    const { result } = renderHook(() => useUsers());
    
    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.users).toEqual([]);
    
    // Wait for data
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.users).toEqual(mockUsers);
    expect(fetch).toHaveBeenCalledWith('/api/users');
  });
  
  it('handles errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    const { result } = renderHook(() => useUsers());
    
    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });
  });
});


// ===== TESTING REDUX CONTAINER =====

// UserListContainer.test.js
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import UserListContainer from './UserListContainer';
import rootReducer from '../reducers';

describe('UserListContainer', () => {
  it('displays users from Redux store', () => {
    const store = createStore(rootReducer, {
      users: {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ],
        selectedUserId: null
      }
    });
    
    render(
      <Provider store={store}>
        <UserListContainer />
      </Provider>
    );
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});
```

**Test strategy:**

| Component Type | Test Approach | Tools |
|---------------|---------------|-------|
| Presentational | Unit tests, snapshots | Jest, React Testing Library |
| Container/Hook | Integration tests, mock API | Jest, MSW, renderHook |
| Redux Container | Integration tests, mock store | Redux mock store |

**Why it matters:** Presentational components are trivial to test. Containers need API mocking.
</details>

<details>
<summary><strong>Question 5:</strong> How do containers work with Storybook?</summary>

**Answer:** **Write stories for presentational components with mock data. Containers don't appear in Storybook.**

```javascript
// ===== PRESENTATIONAL COMPONENT =====
// UserProfile.js

function UserProfile({ user, stats, onFollow, onMessage }) {
  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
      <div className="stats">
        <span>Posts: {stats.posts}</span>
        <span>Followers: {stats.followers}</span>
      </div>
      <button onClick={onFollow}>Follow</button>
      <button onClick={onMessage}>Message</button>
    </div>
  );
}


// ===== STORYBOOK STORIES =====
// UserProfile.stories.js - Stories for presentational component

import UserProfile from './UserProfile';

export default {
  title: 'Components/UserProfile',
  component: UserProfile,
  argTypes: {
    onFollow: { action: 'followed' },
    onMessage: { action: 'messaged' }
  }
};

// Story 1: Default state
export const Default = {
  args: {
    user: {
      name: 'Alice Johnson',
      avatar: '/avatars/alice.jpg',
      bio: 'Software engineer and coffee enthusiast'
    },
    stats: {
      posts: 42,
      followers: 1337
    }
  }
};

// Story 2: New user (no followers)
export const NewUser = {
  args: {
    user: {
      name: 'Bob Smith',
      avatar: '/avatars/bob.jpg',
      bio: 'Just joined!'
    },
    stats: {
      posts: 0,
      followers: 0
    }
  }
};

// Story 3: Long bio (edge case)
export const LongBio = {
  args: {
    user: {
      name: 'Charlie Brown',
      avatar: '/avatars/charlie.jpg',
      bio: 'This is a very long bio that might wrap to multiple lines and we want to see how the component handles it in different viewport sizes...'
    },
    stats: {
      posts: 100,
      followers: 5000
    }
  }
};


// ===== CONTAINER (NOT IN STORYBOOK) =====
// UserProfileContainer.js - No story needed

function UserProfileContainer({ userId }) {
  const { user, stats } = useUserProfile(userId);
  const { follow, message } = useUserActions(userId);
  
  return <UserProfile user={user} stats={stats} onFollow={follow} onMessage={message} />;
}
```

**Why presentational components work great in Storybook:**
- No API calls required
- Instant rendering with mock data
- Test all edge cases (empty, loading, error, long text)
- Designers can tweak values in Controls panel

**Why containers don't belong in Storybook:**
- Require API mocks
- Slow due to network requests
- Hard to test edge cases
- Not what designers care about

**Why it matters:** Separation enables visual documentation and design system development.
</details>

## References

- [1] https://medium.com/@learnreact/container-components-c0e67432e005
- [2] https://redux.js.org/tutorials/fundamentals/part-5-ui-react#presentational-and-container-components
