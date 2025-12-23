import { Http } from "./Http";

export const register = (data) => Http.post("/register", data);

export const login = (email, password, role = "customer") =>
  Http.post(`/login/${role}`, { email, password });

export const setAuthToken = (token) => {
  if (token) {
    Http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete Http.defaults.headers.common["Authorization"];
  }
};

