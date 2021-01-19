import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const request = (options) => {
  var headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (localStorage.getItem("accesstoken")) {
    headers = {
      ...headers,
      Authorization: localStorage.getItem("accesstoken"),
    };
  }

  const defaults = { headers: headers };
  console.log({ headers });
  // options = Object.assign({}, defaults, options);
  options = { ...defaults, ...options };

  if (options.method === "POST") {
    return axios
      .post(options.url, options.body, { headers: headers })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {});
  }

  if (options.method === "GET") {
    return axios({
      method: "get",
      url: options.url,
      data: options.body,
      headers: headers,
    });
  }
};

export const getbackenddata = async (firebase) => {
  console.log({ firebase });
  try {
    if (firebase.auth().currentUser) {
      const idToken = await firebase.auth().currentUser.getIdToken(true);
      // .then((idToken) => {
      localStorage.setItem("accesstoken", idToken);
      return request({
        url: API_BASE_URL + "/",
        method: "GET",
        body: null,
      });
    } else {
      return request({
        url: API_BASE_URL + "/",
        method: "GET",
        body: null,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
