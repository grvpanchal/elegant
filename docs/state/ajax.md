








## AJAX
- https://www.w3schools.com/js/js_ajax_intro.asp
- showcase
```js
const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    document.getElementById("demo").innerHTML = this.responseText;
    }
   xhr.timeout = 10000;
  xhttp.open("GET", "ajax_info.txt", true);
  xhttp.send();
  ```
- showcase 
```js
fetch('todo', { signal: AbortSignal.timeout(10000) })
   .then(r => r.json())
   .then(d => d);
```
- Timeout Strategy
- Single point of entry and exit
