import { createFileRoute } from '@tanstack/react-router'
import ShoppingCartPage from "../../ui/page/ShoppingCartPage";

export const Route = createFileRoute('/shoppingcart/')({
  component: ShoppingCartPage,
})

