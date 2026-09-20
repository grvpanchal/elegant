const defaultShouldRetry = (error) => {
  const status = error && error.status;
  if (status === undefined) return true;          // network / unknown: worth one more try
  if (status === 429) return true;
  return status >= 500;
};

const defaultSleep = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal && signal.aborted) return reject(signal.reason);
    const timer = setTimeout(resolve, ms);
    if (signal) {
      signal.addEventListener("abort", () => { clearTimeout(timer); reject(signal.reason); },
        { once: true });
    }
  });

export default async function retry(fn, options = {}) {
  const {
    retries = 3,
    baseMs = 100,
    maxMs = 30000,
    signal,
    shouldRetry = defaultShouldRetry,
    random = Math.random,
    sleep = defaultSleep,
  } = options;

  let lastError;
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    if (signal && signal.aborted) throw signal.reason;
    try {
      return await fn({ attempt, signal });
    } catch (err) {
      if (signal && signal.aborted) throw signal.reason;
      lastError = err;
      if (attempt > retries || !shouldRetry(err, attempt)) throw err;
      const ceiling = Math.min(maxMs, baseMs * Math.pow(2, attempt - 1));
      await sleep(random() * ceiling, signal);
    }
  }
  throw lastError;
}
