export const errorHandler = (status, message) => {
  const err = new Error();
  err.message = message;
  err.status = status;
  return err;
};
