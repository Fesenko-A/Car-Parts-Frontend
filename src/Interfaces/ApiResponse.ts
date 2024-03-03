export default interface ApiResponse {
  data?: {
    statusCode?: number;
    isSuccess?: boolean;
    errorMessage?: string;
    result: {
      [key: string]: string;
    };
  };
  error?: any;
}
