/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for the gRPC-Web backend. Dev defaults to the Vite proxy (/api). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
