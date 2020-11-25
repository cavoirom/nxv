export const log = {
  debug: function (message, ...params) {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, ...params);
    }
  },
  info: function (message, ...params) {
    console.log(message, ...params);
  },
  error: function (message, ...params) {
    console.error(message, ...params);
  },
};
