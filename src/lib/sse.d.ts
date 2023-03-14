declare module 'sse.js' {
  export type SSEOptions = EventSourceInit & {
    headers? : Record<string, string>;
    payload? : string;
    methos? : string;
  };
  export class SSE extends EventSource {
    constructor(url: string | URL, options?: SSEOptions);
    stream(): void
  }
}