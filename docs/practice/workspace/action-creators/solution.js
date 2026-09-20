export function increment() {
  return { type: "INCREMENT" };
}

export function decrement() {
  return { type: "DECREMENT" };
}

export function setCount(payload) {
  return { type: "SET_COUNT", payload };
}
