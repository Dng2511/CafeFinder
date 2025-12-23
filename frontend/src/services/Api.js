import { Http } from "./Http";


export const addFavorite = (data, config) => Http.post("/favorites", data, config);
export const getFavorites = (user_id, config) => Http.get(`/favorites/${user_id}`, config);
export const removeFavorite = (cafe_id, config) => Http.delete(`/favorites/${cafe_id}`, config);