export interface RetryOptions {
  attempts: number;
  delayMs: number;
  shouldRetry?: (error: unknown) => boolean;
}

const delay = async (milliseconds: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

export const retry = async <T>(
  operation: () => Promise<T>,
  { attempts, delayMs, shouldRetry = () => true }: RetryOptions
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === attempts || !shouldRetry(error)) {
        break;
      }

      await delay(delayMs);
    }
  }

  throw lastError;
};
