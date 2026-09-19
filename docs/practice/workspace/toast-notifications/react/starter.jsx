import { useCallback, useEffect, useState } from "react";
import "./Toast.style.css";

/**
 * ToastStack.
 * - notify({ message, tone }) adds a toast; newest nearest the corner
 * - non-error toasts dismiss after 5000ms; error toasts never auto-dismiss
 * - the timer pauses on pointer-over AND on focus within, and resumes on leave
 * - polite announcements go in an aria-live="polite" region that already exists;
 *   errors go in a role="alert" region. Focus must never move to a toast.
 */
export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const notify = useCallback((toast) => {
    // Your code here.
  }, []);
  return { toasts, notify, dismiss };
}

export default function ToastStack({ toasts = [], onDismiss }) {
  // Your code here.
  return <div className="toast-stack" />;
}
