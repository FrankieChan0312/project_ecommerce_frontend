import axios from "axios";
import {getAuth} from "firebase/auth";

import {baseUrl} from "./productApi.ts";
import type {FavoriteDto} from "../data/favorite/favorite.type.ts";


async function getAuthConfig() {

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not logged in");
  }

  const token = await user.getIdToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}


export async function getFavorites() {

  const config = await getAuthConfig();

  const response =
      await axios.get<FavoriteDto[]>(
          `${baseUrl}/favorites`,
          config
      );

  return response.data;
}


export async function addFavorite(pid: number) {

  const config = await getAuthConfig();

  const response =
      await axios.post<FavoriteDto>(
          `${baseUrl}/favorites/${pid}`,
          null,
          config
      );

  return response.data;
}


export async function removeFavorite(pid: number) {

  const config = await getAuthConfig();

  await axios.delete(
      `${baseUrl}/favorites/${pid}`,
      config
  );
}