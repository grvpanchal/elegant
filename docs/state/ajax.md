---
title: AJAX
layout: doc
slug: ajax
---

# AJAX

AJAX (Asynchronous JavaScript and XML) is a technique used in web development to make asynchronous requests to a server without reloading the entire web page. It allows for dynamic updates of web content, improving user experience and interactivity.

## Key Characteristics of AJAX

- Asynchronous communication with the server
- Updates specific parts of a web page without full page reloads
- Enhances user experience by providing smoother interactions

## Types of APIs for AJAX

### 1. XMLHttpRequest (XHR)

- The original API for making AJAX requests
- Supported in all browsers and Node.js
- Considered low-level and somewhat clunky to use
- Example:
```js
const xhttp = new XMLHttpRequest();
xhttp.onload = function() {
  document.getElementById("demo").innerHTML = this.responseText;
  }
  xhr.timeout = 10000;
xhttp.open("GET", "ajax_info.txt", true);
xhttp.send();
```

### 2. Fetch API

- A newer, more modern API for making HTTP requests
- Uses Promises for handling responses
- Simpler syntax compared to XHR
- Example:
```javascript
fetch('http://example.com/api/users')
  .then(response => response.json())
  .then(users => {
    // Handle user data
  });
```

### 3. Axios

- A popular third-party library for making HTTP requests
- Provides a simpler API compared to XHR
- Automatically handles JSON parsing
- Supports request and response interceptors

### 4. jQuery AJAX

- Part of the jQuery library
- Offers a higher-level API for making AJAX requests
- Historically popular due to cross-browser compatibility

These APIs allow developers to choose the most suitable option for their project, balancing factors such as browser support, ease of use, and additional features.

## References
- [1] https://blog.isquaredsoftware.com/2020/11/how-web-apps-work-ajax-apis-data/
- [2] https://aws.amazon.com/what-is/ajax/
- [3] https://www.reddit.com/r/AskComputerScience/comments/s7m1u8/what_exactly_is_ajax_and_rest/
- [4] https://wesbos.com/javascript/13-ajax-and-fetching-data/74-ajax-and-apis/
- [5] https://stackoverflow.com/questions/23054764/can-someone-explain-the-difference-between-ajax-and-rest/23054929

