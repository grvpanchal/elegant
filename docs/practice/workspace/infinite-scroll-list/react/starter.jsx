import { useCallback, useEffect, useRef, useState } from "react";
import "./InfiniteList.style.css";

/**
 * InfiniteList.
 * - an IntersectionObserver on a sentinel, with rootMargin so loading starts early
 * - exactly ONE request in flight: guard with a ref, not with state
 * - a failed page keeps the items already loaded and offers a retry
 * - when there is no next cursor, say so and stop observing
 * - announce new rows politely; aria-busy on the list while loading
 */
export default function InfiniteList({ fetchPage, renderItem }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle");
  const [done, setDone] = useState(false);
  const sentinelRef = useRef(null);

  const loadMore = useCallback(async () => {
    // Your code here.
  }, []);

  useEffect(() => {
    // Your code here.
  }, [loadMore, done]);

  return (
    <div className="infinite-list">
      <ul>{items.map(renderItem)}</ul>
      <div ref={sentinelRef} />
    </div>
  );
}
