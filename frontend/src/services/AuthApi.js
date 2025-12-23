import { Http } from "./Http";

export const register = (data) => Http.post("/register", data);

export const login = (email, password) =>
  Http.post("/login", { email, password });

export const getMe = () => Http.get("/me");

export const setAuthToken = (token) => {
  if (token) {
    Http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete Http.defaults.headers.common["Authorization"];
  }
};
