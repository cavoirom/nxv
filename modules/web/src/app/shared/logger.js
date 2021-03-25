export const log = {
  debug(message, ...params) {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, ...params);
    }
  },
  info(message, ...params) {
    console.log(message, ...params);
  },
  error(message, ...params) {
    console.error(message, ...params);
  },
};
