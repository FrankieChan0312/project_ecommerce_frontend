import {createFileRoute} from "@tanstack/react-router";
import FavoritesPage from "../ui/page/FavoritesPage";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});
