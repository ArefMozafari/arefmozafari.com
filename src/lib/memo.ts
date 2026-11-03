/// Caches an async loader by its first argument for the life of the process, so a
/// build (or a dev server re-rendering on every change) asks each remote once.
/// A null answer is not kept, so a failed fetch is retried next time.
export function memoizeAsync<Rest extends unknown[], Value>(
  load: (key: string, ...rest: Rest) => Promise<Value | null>,
): (key: string, ...rest: Rest) => Promise<Value | null> {
  const settled = new Map<string, Promise<Value | null>>();
  return (key, ...rest) => {
    const cached = settled.get(key);
    if (cached) {
      return cached;
    }
    const pending = load(key, ...rest).then((value) => {
      if (value === null) {
        settled.delete(key);
      }
      return value;
    });
    settled.set(key, pending);
    return pending;
  };
}
