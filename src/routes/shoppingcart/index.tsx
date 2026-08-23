import { createFileRoute } from '@tanstack/react-router'
import ShoppingCart from "../../ui/page/ShoppingCart";

export const Route = createFileRoute('/shoppingcart/')({
  component: ShoppingCart,
})

