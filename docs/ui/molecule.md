---
title: Molecule
layout: doc
slug: molecule
---
# Molecule

> - Comprised of multiple atoms or molecules
> - Populates a grouped or assembled sections of UI

Here is a simple molecule example called `LoginForm` that combines two atoms: an `Input` atom and a `Button` atom. The `LoginForm` molecule represents a common user interface pattern where users can input their credentials and submit the form:

```jsx
// LoginForm.js

import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Perform login logic here
    console.log("Logging in with:", { username, password });
  };

  return (
    <div>
      <h2>Login Form</h2>
      <form>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin} label="Login" />
      </form>
    </div>
  );
};

export default LoginForm;
```

In this example, the `LoginForm` molecule encapsulates the UI for a login form. It consists of two `Input` atoms for the username and password fields, and a `Button` atom for submitting the form. The `LoginForm` molecule manages the local state for the username and password inputs and defines a `handleLogin` function that could contain the logic for authenticating the user.

Now, we can use the `LoginForm` molecule in your application:

```jsx
// App.js

import React from "react";
import LoginForm from "./LoginForm";

const App = () => {
  return (
    <div>
      <h1>My App</h1>
      <LoginForm />
    </div>
  );
};

export default App;
```

This illustrates how molecules, composed of atoms, can be used to create more complex and reusable components in a React application.

## References

- https://atomicdesign.bradfrost.com/chapter-2/#molecules
