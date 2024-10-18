export const ResponseMessage = <T>(status: number, message: T) => {
  return {
    status: status,
    message: message,
  };
};
