const emit = (el, eventName, data) => {
  let event = new CustomEvent(eventName, {
    detail: data
  });
  el.dispatchEvent(event);
}

export default emit;