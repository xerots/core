export type UnknownObject = {
  [k: string]: unknown;
};

export type AnyObject = {
  [k: string]: any;
};

export type ApiResponse<T = unknown> = {
  // Response message
  message?: string;
  // Requested data
  data?: T;
  // Validation error messages
  errors?: Record<string, string[]>;
  // Additional meta data
  meta?: AnyObject;
};
