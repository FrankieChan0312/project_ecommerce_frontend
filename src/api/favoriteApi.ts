import axios from "axios";


import {
  getAuthConfig
} from "../authService/firebaseAuthService.ts";

import type {
  FavoriteDto
} from "../data/favorite/favorite.type.ts";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Favorite endpoints are protected.
// getAuthConfig() attaches the current Firebase user's
// ID token to the Authorization header.
export async function getFavorites() {

  // Load only the favorites belonging to the authenticated user.
  const response =
      await axios.get<FavoriteDto[]>(
          `${baseUrl}/favorites`,
          await getAuthConfig()
      );

  return response.data;
}


export async function addFavorite(
    pid: number
) {

  // Add the selected product to the authenticated user's favorites.
  // The backend prevents duplicate user-product favorite records.
  const response =
      await axios.post<FavoriteDto>(
          `${baseUrl}/favorites/${pid}`,
          null,
          await getAuthConfig()
      );

  return response.data;
}


export async function removeFavorite(
    pid: number
) {

  // Remove the selected product from the authenticated user's favorites.
  // The backend responds with HTTP 204 because no response body is required.
  await axios.delete(
      `${baseUrl}/favorites/${pid}`,
      await getAuthConfig()
  );
}