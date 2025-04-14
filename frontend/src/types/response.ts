export type IError = string;

export type IResponse<T = null> =
  | { success: false; error: IError }
  | { success: true; data: T };
