export interface IResponse {
  success: boolean;
  message: string;
  data?: string;
  errors?: string[];
}
