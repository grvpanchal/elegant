---
title: Forms
layout: doc
slug: forms
---

# Forms

## Key Insight

**Controlled components** in React mean form inputs are driven by React state (`value={email}` + `onChange={e => setEmail(e.target.value)}`), making React the **single source of truth** instead of letting DOM manage input values. This pattern enables real-time validation, dynamic field visibility, conditional submission buttons, and prevents the "stale data" problem where React doesn't know what the user typed. Every keystroke updates state, state flows back to input via `value` prop, creating a **one-way data flow loop** that keeps UI and state perfectly synchronized.

## Detailed Description

Forms are the primary mechanism for user input in web applications, but HTML forms have two fundamental approaches: **uncontrolled** (DOM manages state) and **controlled** (React/framework manages state).

**Traditional HTML Forms (Uncontrolled):**
- Input elements manage their own state internally in the DOM
- Access values with `event.target.value` or refs when form submits
- Quick to implement but hard to validate, manipulate, or synchronize with other UI
- Example: `<input type="text" />` with no `value` prop

**Controlled Components Pattern (React Preferred):**
- React state is the single source of truth for input values
- Input's `value` prop is bound to state variable: `<input value={email} />`
- Input's `onChange` handler updates state: `onChange={e => setEmail(e.target.value)}`
- Creates a loop: User types → onChange fires → setState updates → value prop updates → input displays new value
- Benefits: Real-time validation, computed values, conditional fields, form state in Redux/context

**Core Form Concepts:**

1. **Form State Management**: Track input values, touched fields, error messages, submission status
2. **Validation**: Client-side (instant feedback, UX), Server-side (security, business rules)
3. **Submission**: Prevent default browser behavior, serialize data, handle async API calls, show loading states
4. **Error Handling**: Display field-level errors, form-level errors, async validation errors
5. **Accessibility**: Label associations, error announcements, focus management, keyboard navigation

**Validation Strategies:**

- **On Change**: Validate as user types (real-time feedback, can be annoying for required fields)
- **On Blur**: Validate when field loses focus (balanced approach, common pattern)
- **On Submit**: Validate only when user submits (simple but delayed feedback)
- **Hybrid**: Validate on blur for first error, then on change for correction confirmation

**Popular Form Libraries:**

- **React Hook Form**: Uncontrolled by default, minimal re-renders, great performance
- **Formik**: Controlled components, comprehensive but more re-renders
- **Yup / Zod**: Schema validation libraries for complex validation rules
- **HTML5 Validation**: Built-in browser validation (`required`, `pattern`, `type="email"`)

**Why Forms Matter:**

1. **User Input**: Primary way users communicate with applications (login, registration, checkout, settings)
2. **Data Integrity**: Validation prevents malformed data from entering database
3. **User Experience**: Instant feedback, clear error messages, accessible keyboard navigation
4. **Security**: Prevent XSS, SQL injection, CSRF attacks through proper validation and sanitization
5. **Business Logic**: Multi-step forms, conditional fields, dynamic validation based on other inputs

**Trade-offs:**

- **Controlled**: Full control, easy validation, more re-renders, verbose for large forms
- **Uncontrolled**: Better performance, less code, harder to validate, loses React benefits
- **Form Libraries**: Less boilerplate, standardized patterns, but adds bundle size and learning curve

## References
- [1] https://cxl.com/blog/form-validation/
- [2] https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Your_first_form
- [3] https://www.dhiwise.com/post/html-form-validation-techniques-tips-and-tools
- [4] https://www.geeksforgeeks.org/html-design-form/
- [5] https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation
- [6] https://design.mindsphere.io/patterns/form-elements.html
- [7] https://dev.to/shrutikapoor08/javascript-form-validation-how-to-check-user-input-on-html-forms-with-js-example-code-51fe
- [8] https://www.geeksforgeeks.org/html-forms/
- [9] https://www.w3schools.com/html/html_forms.asp
- [10] https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
- [11] https://dev.to/flippedcoding/why-form-validation-is-important-37mj
- [12] https://www.w3schools.com/js/js_validation.asp
- [13] https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/
## Code Examples

### Basic Example: Controlled Form with Validation

```javascript
// ===== CONTROLLED LOGIN FORM =====
// LoginForm.js - React controlled component pattern

import React, { useState } from 'react';

function LoginForm() {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation function
  const validate = () => {
    const newErrors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    return newErrors;
  };
  
  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission
    
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors and submit
    setErrors({});
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      console.log('Login successful:', data);
      // Redirect user or update auth state
    } catch (error) {
      setErrors({ form: 'Invalid email or password' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Login</h2>
      
      {/* Form-level error */}
      {errors.form && (
        <div className="error-message" role="alert">
          {errors.form}
        </div>
      )}
      
      {/* Email field */}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className="error">
            {errors.email}
          </span>
        )}
      </div>
      
      {/* Password field */}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <span id="password-error" className="error">
            {errors.password}
          </span>
        )}
      </div>
      
      {/* Submit button */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
```

### Practical Example: React Hook Form with Validation

```javascript
// ===== REGISTRATION FORM WITH REACT HOOK FORM =====
// RegistrationForm.js - Using React Hook Form library

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const schema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be valid'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  
  age: yup
    .number()
    .typeError('Age must be a number')
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be an integer')
    .min(18, 'You must be at least 18 years old'),
  
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
}).required();

function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur'  // Validate on blur
  });
  
  const password = watch('password');  // Watch password for strength indicator
  
  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      console.log('Registration successful!');
      reset();  // Clear form after successful submission
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  };
  
  // Password strength indicator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 8) return 'Weak';
    if (!/[A-Z]/.test(pwd) || !/[a-z]/.test(pwd) || !/[0-9]/.test(pwd)) return 'Medium';
    return 'Strong';
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>Create Account</h2>
      
      {/* Username */}
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          {...register('username')}
          aria-invalid={errors.username ? 'true' : 'false'}
        />
        {errors.username && (
          <span className="error">{errors.username.message}</span>
        )}
      </div>
      
      {/* Email */}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <span className="error">{errors.email.message}</span>
        )}
      </div>
      
      {/* Password */}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {password && (
          <div className={`strength strength-${getPasswordStrength(password)?.toLowerCase()}`}>
            Strength: {getPasswordStrength(password)}
          </div>
        )}
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>
      
      {/* Confirm Password */}
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword.message}</span>
        )}
      </div>
      
      {/* Age */}
      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          {...register('age')}
          aria-invalid={errors.age ? 'true' : 'false'}
        />
        {errors.age && (
          <span className="error">{errors.age.message}</span>
        )}
      </div>
      
      {/* Terms checkbox */}
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            {...register('terms')}
            aria-invalid={errors.terms ? 'true' : 'false'}
          />
          I accept the terms and conditions
        </label>
        {errors.terms && (
          <span className="error">{errors.terms.message}</span>
        )}
      </div>
      
      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting || !isDirty || !isValid}>
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}

export default RegistrationForm;
```

### Advanced Example: Multi-Step Form with Dynamic Fields

```javascript
// ===== MULTI-STEP CHECKOUT FORM =====
// CheckoutForm.js - Wizard pattern with conditional fields

import React, { useState } from 'react';

function CheckoutForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Step 2: Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    sameAsBilling: true,
    
    // Step 3: Billing (conditional)
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    
    // Step 4: Payment
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Update form data
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate current step
  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Valid email is required';
      }
      if (!formData.phone || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Valid 10-digit phone number is required';
      }
    }
    
    if (step === 2) {
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode || !/^\d{5}$/.test(formData.zipCode)) {
        newErrors.zipCode = 'Valid 5-digit ZIP code is required';
      }
    }
    
    if (step === 3 && !formData.sameAsBilling) {
      if (!formData.billingAddress) newErrors.billingAddress = 'Billing address is required';
      if (!formData.billingCity) newErrors.billingCity = 'Billing city is required';
      if (!formData.billingState) newErrors.billingState = 'Billing state is required';
      if (!formData.billingZipCode || !/^\d{5}$/.test(formData.billingZipCode)) {
        newErrors.billingZipCode = 'Valid 5-digit ZIP code is required';
      }
    }
    
    if (step === 4) {
      if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Valid 16-digit card number is required';
      }
      if (!formData.cardName) newErrors.cardName = 'Name on card is required';
      if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Valid expiry date (MM/YY) is required';
      }
      if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Valid CVV is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Checkout failed');
      
      console.log('Order placed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };
  
  return (
    <div className="checkout-form">
      {/* Progress indicator */}
      <div className="progress-bar">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Personal</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Shipping</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Billing</div>
        <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Payment</div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="form-step">
            <h2>Personal Information</h2>
            
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
            
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
            
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
            
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone (10 digits)"
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>
        )}
        
        {/* Step 2: Shipping Address */}
        {step === 2 && (
          <div className="form-step">
            <h2>Shipping Address</h2>
            
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street Address"
            />
            {errors.address && <span className="error">{errors.address}</span>}
            
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
            {errors.city && <span className="error">{errors.city}</span>}
            
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
            {errors.state && <span className="error">{errors.state}</span>}
            
            <input
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="ZIP Code"
            />
            {errors.zipCode && <span className="error">{errors.zipCode}</span>}
            
            <label>
              <input
                type="checkbox"
                name="sameAsBilling"
                checked={formData.sameAsBilling}
                onChange={handleChange}
              />
              Billing address same as shipping
            </label>
          </div>
        )}
        
        {/* Step 3: Billing Address (conditional) */}
        {step === 3 && !formData.sameAsBilling && (
          <div className="form-step">
            <h2>Billing Address</h2>
            
            <input
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              placeholder="Billing Street Address"
            />
            {errors.billingAddress && <span className="error">{errors.billingAddress}</span>}
            
            {/* ...other billing fields... */}
          </div>
        )}
        
        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="form-step">
            <h2>Payment Information</h2>
            
            <input
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="Card Number"
              maxLength="19"
            />
            {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
            
            <input
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="Name on Card"
            />
            {errors.cardName && <span className="error">{errors.cardName}</span>}
            
            <div className="card-details">
              <input
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                maxLength="5"
              />
              {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
              
              <input
                name="cvv"
                type="password"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="CVV"
                maxLength="4"
              />
              {errors.cvv && <span className="error">{errors.cvv}</span>}
            </div>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="form-actions">
          {step > 1 && (
            <button type="button" onClick={prevStep}>
              Previous
            </button>
          )}
          
          {step < 4 ? (
            <button type="button" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button type="submit">
              Complete Order
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CheckoutForm;


// ===== DYNAMIC FIELD ARRAY (ADD/REMOVE) =====
// ContactsForm.js - Add/remove multiple contacts

function ContactsForm() {
  const [contacts, setContacts] = useState([{ name: '', email: '' }]);
  
  const addContact = () => {
    setContacts([...contacts, { name: '', email: '' }]);
  };
  
  const removeContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };
  
  const updateContact = (index, field, value) => {
    const updated = contacts.map((contact, i) =>
      i === index ? { ...contact, [field]: value } : contact
    );
    setContacts(updated);
  };
  
  return (
    <form>
      <h2>Add Contacts</h2>
      
      {contacts.map((contact, index) => (
        <div key={index} className="contact-group">
          <input
            value={contact.name}
            onChange={(e) => updateContact(index, 'name', e.target.value)}
            placeholder="Name"
          />
          <input
            value={contact.email}
            onChange={(e) => updateContact(index, 'email', e.target.value)}
            placeholder="Email"
          />
          {contacts.length > 1 && (
            <button type="button" onClick={() => removeContact(index)}>
              Remove
            </button>
          )}
        </div>
      ))}
      
      <button type="button" onClick={addContact}>
        Add Another Contact
      </button>
    </form>
  );
}
```

## Common Mistakes

### 1. Using Uncontrolled Components Without Understanding Consequences
**Mistake:** Not binding input values to state, losing React's control over form data.

```javascript
// ❌ BAD: Uncontrolled input - React doesn't know value
function LoginForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;  // Reading from DOM
    const password = e.target.password.value;
    
    // Problem: Can't validate in real-time
    // Can't clear form programmatically
    // Can't show/hide fields based on input
    // Can't populate from API response
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
// This works for simple forms, but limits React's power


// ✅ GOOD: Controlled component - React owns state
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Can validate before submission
    if (password.length < 8) {
      setError('Password too short');
      return;
    }
    
    console.log('Submitting:', email, password);
  };
  
  // Can clear form programmatically
  const clearForm = () => {
    setEmail('');
    setPassword('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          // Real-time validation
          if (e.target.value.length > 0 && e.target.value.length < 8) {
            setError('Password must be at least 8 characters');
          } else {
            setError('');
          }
        }}
      />
      {error && <span className="error">{error}</span>}
      <button type="submit">Login</button>
      <button type="button" onClick={clearForm}>Clear</button>
    </form>
  );
}
// Full control: validation, clearing, dynamic fields, etc.
```

**Why it matters:** Controlled components enable real-time validation, dynamic fields, and programmatic control.

### 2. Forgetting to Prevent Default Form Submission
**Mistake:** Not calling `e.preventDefault()` causes page reload.

```javascript
// ❌ BAD: Form submission causes page reload
function SearchForm() {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    // Missing e.preventDefault()!
    
    fetch(`/api/search?q=${query}`)
      .then(r => r.json())
      .then(results => console.log(results));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
}
// Clicking submit:
// 1. handleSubmit runs
// 2. Fetch starts
// 3. Browser submits form (default behavior)
// 4. Page reloads, fetch is aborted
// 5. User sees page reload, no results


// ✅ GOOD: Prevent default to keep SPA behavior
function SearchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();  // Stop browser from submitting form
    
    const response = await fetch(`/api/search?q=${query}`);
    const data = await response.json();
    setResults(data);
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      
      <ul>
        {results.map(item => <li key={item.id}>{item.title}</li>)}
      </ul>
    </div>
  );
}
// Now form submission is controlled by React, no page reload
```

**Why it matters:** SPAs need `e.preventDefault()` to avoid page reloads that destroy state.

### 3. Not Disabling Submit Button During Submission
**Mistake:** Allowing multiple form submissions while request is in flight.

```javascript
// ❌ BAD: User can click submit multiple times
function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // No loading state, button stays clickable
    await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
}
// User clicks "Register" 3 times fast
// Result: 3 POST requests, 3 accounts created!


// ✅ GOOD: Disable button during submission
function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      console.log('Success!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isSubmitting}
      />
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
// Button disabled during request, prevents duplicate submissions
```

**Why it matters:** Prevents duplicate submissions, race conditions, and double-charging users.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What's the difference between controlled and uncontrolled components?</summary>

**Answer:** **Controlled components have their value driven by React state (`value={email}`). Uncontrolled components store value in DOM and are accessed via refs.**

```javascript
// ===== CONTROLLED COMPONENT =====
// React state is the single source of truth

function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <input
      value={value}  // Controlled by React state
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

// How it works:
// 1. User types "a"
// 2. onChange fires with event
// 3. setValue('a') updates state
// 4. Component re-renders
// 5. value prop = 'a', input shows "a"

// Benefits:
// - Real-time validation
// - Can transform input (uppercase, format)
// - Programmatically set value
// - Sync with other UI elements


// ===== UNCONTROLLED COMPONENT =====
// DOM manages the value

import { useRef } from 'react';

function UncontrolledInput() {
  const inputRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);  // Read from DOM
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} />  {/* No value prop */}
      <button type="submit">Submit</button>
    </form>
  );
}

// How it works:
// 1. User types "a"
// 2. Browser updates DOM directly
// 3. React doesn't know about the change
// 4. Access via ref when needed

// When to use:
// - File inputs (must be uncontrolled)
// - Integrating with non-React libraries
// - Simple forms where you don't need validation
```

**Comparison:**

| Feature | Controlled | Uncontrolled |
|---------|-----------|--------------|
| Source of truth | React state | DOM |
| Access value | Via state variable | Via ref |
| Validation | Real-time | On submit only |
| Default value | `value={initial}` | `defaultValue={initial}` |
| Re-renders | On every change | Never (unless forced) |
| Complexity | More code | Less code |

**Why it matters:** Controlled components enable React's full power for validation and dynamic forms.
</details>

<details>
<summary><strong>Question 2:</strong> How do you validate forms in React?</summary>

**Answer:** **Validate on submit with `handleSubmit`, on blur with `onBlur` events, or on change with `onChange`. Store errors in state and display conditionally.**

```javascript
// ===== VALIDATION ON SUBMIT =====
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // No errors, proceed with submission
    console.log('Submitting:', { email, password });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <span className="error">{errors.email}</span>}
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <span className="error">{errors.password}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}


// ===== VALIDATION ON BLUR (Better UX) =====
function SignupForm() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  
  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
    return '';
  };
  
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    if (field === 'email') {
      const error = validateEmail(email);
      setErrors({ ...errors, email: error });
    }
  };
  
  return (
    <form>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => handleBlur('email')}
      />
      {/* Only show error if field was touched */}
      {touched.email && errors.email && (
        <span className="error">{errors.email}</span>
      )}
    </form>
  );
}


// ===== REAL-TIME VALIDATION (onChange) =====
function PasswordInput() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    // Validate as user types
    if (value.length < 8) {
      setError('Password must be at least 8 characters');
    } else if (!/[A-Z]/.test(value)) {
      setError('Password must contain uppercase letter');
    } else if (!/[0-9]/.test(value)) {
      setError('Password must contain a number');
    } else {
      setError('');  // Valid
    }
  };
  
  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={handleChange}
      />
      {error && <span className="error">{error}</span>}
      {!error && password && <span className="success">✓ Strong password</span>}
    </div>
  );
}


// ===== USING YUP SCHEMA VALIDATION =====
import * as yup from 'yup';

const schema = yup.object({
  username: yup.string().required().min(3).max(20),
  email: yup.string().required().email(),
  age: yup.number().required().positive().integer().min(18)
});

function validateWithSchema(data) {
  try {
    schema.validateSync(data, { abortEarly: false });
    return {};  // No errors
  } catch (err) {
    const errors = {};
    err.inner.forEach(error => {
      errors[error.path] = error.message;
    });
    return errors;
  }
}
```

**Validation strategies:**
- **On Submit**: Simple, but delayed feedback
- **On Blur**: Best UX - validate when user leaves field
- **On Change**: Real-time, but can be annoying for required fields
- **Hybrid**: Validate on blur first, then on change for corrections

**Why it matters:** Good validation prevents bad data and improves user experience.
</details>

<details>
<summary><strong>Question 3:</strong> How do you handle async validation (e.g., check if username exists)?</summary>

**Answer:** **Use `onBlur` to trigger async check, set loading state, update errors based on server response.**

```javascript
// ===== ASYNC USERNAME AVAILABILITY CHECK =====
import { useState, useCallback } from 'react';

function UsernameInput() {
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);
  
  // Debounced check function
  const checkUsername = useCallback(async (value) => {
    if (!value || value.length < 3) {
      setError('Username must be at least 3 characters');
      setIsAvailable(null);
      return;
    }
    
    setIsChecking(true);
    setError('');
    
    try {
      const response = await fetch(`/api/check-username?username=${value}`);
      const data = await response.json();
      
      if (data.exists) {
        setError('Username is already taken');
        setIsAvailable(false);
      } else {
        setIsAvailable(true);
      }
    } catch (err) {
      setError('Could not check username availability');
    } finally {
      setIsChecking(false);
    }
  }, []);
  
  const handleBlur = () => {
    checkUsername(username);
  };
  
  return (
    <div className="username-field">
      <label htmlFor="username">Username</label>
      <input
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onBlur={handleBlur}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'username-error' : undefined}
      />
      
      {isChecking && <span className="checking">Checking...</span>}
      {isAvailable && <span className="success">✓ Available</span>}
      {error && <span id="username-error" className="error">{error}</span>}
    </div>
  );
}


// ===== DEBOUNCED ASYNC VALIDATION =====
// Check as user types, but wait for pause

import { useEffect, useState } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

function EmailInput() {
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [exists, setExists] = useState(false);
  
  const debouncedEmail = useDebounce(email, 500);  // Wait 500ms
  
  useEffect(() => {
    if (debouncedEmail && /\S+@\S+\.\S+/.test(debouncedEmail)) {
      checkEmail(debouncedEmail);
    }
  }, [debouncedEmail]);
  
  const checkEmail = async (value) => {
    setIsChecking(true);
    
    try {
      const response = await fetch(`/api/check-email?email=${value}`);
      const data = await response.json();
      setExists(data.exists);
    } catch (err) {
      console.error('Error checking email:', err);
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      {isChecking && <span>Checking...</span>}
      {exists && <span className="error">Email already registered</span>}
    </div>
  );
}


// ===== ASYNC VALIDATION IN FORM SUBMISSION =====
function RegistrationForm() {
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Submit to server
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Server returns field-specific errors
        if (errorData.errors) {
          setErrors(errorData.errors);
          // e.g., { username: 'Username taken', email: 'Email exists' }
        }
        return;
      }
      
      console.log('Registration successful!');
    } catch (err) {
      setErrors({ form: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {errors.form && <div className="error">{errors.form}</div>}
      
      <input
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      {errors.username && <span className="error">{errors.username}</span>}
      
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      {errors.email && <span className="error">{errors.email}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

**Best practices:**
- Debounce to avoid excessive API calls
- Show loading indicator during check
- Handle network errors gracefully
- Clear previous errors when re-checking
- Disable submit until async validation passes

**Why it matters:** Async validation prevents duplicates and provides real-time feedback.
</details>

<details>
<summary><strong>Question 4:</strong> How do you create a multi-step form?</summary>

**Answer:** **Track current step in state, conditionally render step components, validate each step before advancing, store all form data in single state object.**

```javascript
// ===== MULTI-STEP WIZARD PATTERN =====
import { useState } from 'react';

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    name: '',
    email: '',
    // Step 2
    address: '',
    city: '',
    // Step 3
    cardNumber: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name) newErrors.name = 'Name required';
      if (!formData.email) newErrors.email = 'Email required';
    }
    
    if (step === 2) {
      if (!formData.address) newErrors.address = 'Address required';
      if (!formData.city) newErrors.city = 'City required';
    }
    
    if (step === 3) {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number required';
      if (!formData.cvv) newErrors.cvv = 'CVV required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    // Submit all form data
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    console.log('Form submitted!');
  };
  
  return (
    <div className="multi-step-form">
      {/* Progress indicator */}
      <div className="progress">
        <div className={step >= 1 ? 'active' : ''}>1. Personal</div>
        <div className={step >= 2 ? 'active' : ''}>2. Address</div>
        <div className={step >= 3 ? 'active' : ''}>3. Payment</div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div>
            <h2>Personal Information</h2>
            <input
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Name"
            />
            {errors.name && <span className="error">{errors.name}</span>}
            
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="Email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
        )}
        
        {/* Step 2: Address */}
        {step === 2 && (
          <div>
            <h2>Shipping Address</h2>
            <input
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Address"
            />
            {errors.address && <span className="error">{errors.address}</span>}
            
            <input
              value={formData.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="City"
            />
            {errors.city && <span className="error">{errors.city}</span>}
          </div>
        )}
        
        {/* Step 3: Payment */}
        {step === 3 && (
          <div>
            <h2>Payment</h2>
            <input
              value={formData.cardNumber}
              onChange={(e) => updateField('cardNumber', e.target.value)}
              placeholder="Card Number"
            />
            {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
            
            <input
              value={formData.cvv}
              onChange={(e) => updateField('cvv', e.target.value)}
              placeholder="CVV"
            />
            {errors.cvv && <span className="error">{errors.cvv}</span>}
          </div>
        )}
        
        {/* Navigation */}
        <div className="buttons">
          {step > 1 && (
            <button type="button" onClick={prevStep}>
              Previous
            </button>
          )}
          
          {step < 3 ? (
            <button type="button" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button type="submit">
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
```

**Key patterns:**
- Single state object for all steps
- Conditional rendering based on `step`
- Validate before advancing
- Allow going back without validation
- Show progress indicator
- Persist data across steps

**Why it matters:** Multi-step forms reduce cognitive load and improve completion rates.
</details>

<details>
<summary><strong>Question 5:</strong> What's the best way to handle form libraries vs custom forms?</summary>

**Answer:** **Use React Hook Form or Formik for complex forms with validation. Build custom for simple forms to avoid bundle size.**

```javascript
// ===== CUSTOM FORM (Simple login) =====
// Good for: Small forms, learning, full control

function CustomLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!email) newErrors.email = 'Required';
    if (!password) newErrors.password = 'Required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <span>{errors.password}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
// Pros: No dependencies, full control, lightweight
// Cons: More boilerplate, manual validation logic


// ===== REACT HOOK FORM (Complex registration) =====
// Good for: Large forms, complex validation, performance

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
  confirmPassword: yup.string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords must match'),
  age: yup.number().required().min(18)
});

function ReactHookFormExample() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });
  
  const onSubmit = async (data) => {
    await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="email" {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <input type="password" {...register('confirmPassword')} />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
      
      <input type="number" {...register('age')} />
      {errors.age && <span>{errors.age.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        Register
      </button>
    </form>
  );
}
// Pros: Less boilerplate, schema validation, better performance
// Cons: Learning curve, adds dependency (~30KB gzipped)


// ===== FORMIK (Alternative library) =====
import { Formik, Form, Field, ErrorMessage } from 'formik';

{% raw %}
function FormikExample() {
  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = 'Required';
    if (!values.password) errors.password = 'Required';
    return errors;
  };
  
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify(values)
        }).finally(() => setSubmitting(false));
      }}>
      {({ isSubmitting }) => (
        <Form>
          <Field type="email" name="email" />
          <ErrorMessage name="email" component="span" />
          
          <Field type="password" name="password" />
          <ErrorMessage name="password" component="span" />
          
          <button type="submit" disabled={isSubmitting}>
            Login
          </button>
        </Form>
      )}
    </Formik>
  );
}
// Pros: Declarative, handles touched/dirty state
// Cons: More re-renders than React Hook Form
```
{% endraw %}

**Decision matrix:**

| Scenario | Recommendation |
|----------|---------------|
| Simple login (2-3 fields) | Custom form |
| Registration (5+ fields) | React Hook Form |
| Multi-step wizard | React Hook Form |
| Complex validation rules | Yup/Zod + React Hook Form |
| Performance critical | React Hook Form (uncontrolled) |
| Learning React | Custom form first |

**Why it matters:** Right tool saves time and reduces bugs without bloating bundle.
</details>

