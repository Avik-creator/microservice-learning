export const customMessage = <T>(message: string, data: T) => {
  return {
    message,
    data,
  };
};

export const customResponse = <T>(statusCode: number, message: string, data: T) => {
  return {
    statusCode,
    message,
    data,
  };
};
