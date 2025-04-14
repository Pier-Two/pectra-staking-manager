export type IError = string;

export type IErrorResponse = {
  success: false;
  error: IError;
};

export type IResponse<T = null> = IErrorResponse | { success: true; data: T };
