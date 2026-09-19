export default function debounce(func, wait) {
  let timeoutId = null;

  function debounced(...args) {
    const context = this;
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      func.apply(context, args);
    }, wait);
  }

  debounced.cancel = () => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = null;
  };

  return debounced;
}
