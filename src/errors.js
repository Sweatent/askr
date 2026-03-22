export const errors = {
  NOT_CONFIGURED: 'Not configured. Run `npx @sweatent/askr -m` to set up.',
  EMPTY_RESPONSE: 'Empty response received. Check your API configuration.',
  TIMEOUT: (id) => `Request timed out. Session: ${id}. Use check({id: "${id}"}) to retry.`,
  PERMANENT_TIMEOUT: (id) => `Session ${id} expired after 2 retries. Please re-ask.`,
  CONCURRENCY_LIMIT: (n) => `Max ${n} concurrent questions. Reduce or adjust in settings.`,
  SESSION_NOT_FOUND: (id) => `Session ${id} not found.`,
  SESSION_CLOSED: (id) => `Session ${id} was closed by admin.`,
};
