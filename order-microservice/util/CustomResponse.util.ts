export const customResponse = <T>(data: T, message: string, status: number) => {
  return {
    data,
    message,
    status,
  };
};
