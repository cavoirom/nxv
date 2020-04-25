const rest = {
  get: function get(url) {
    return fetch(url, { headers: { "Content-Type": "application/json; charset=utf-8" }})
        .then(rawResponse => rawResponse.json());
  }
};

export default rest;