export type IError = string;

export type IErrorResponse = {
  success: false;
  error: IError;
};

export type ISuccessResponse<T = null> = {
  success: true;
  data: T;
};

export type IResponse<T = null> = IErrorResponse | ISuccessResponse<T>;
