export default interface ApiResponse {
  data?: {
    statusCode?: number;
    isSuccess?: boolean;
    result: {
      [key: string]: string;
    };
  };
  error?: any;
}
