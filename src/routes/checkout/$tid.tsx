import { createFileRoute } from '@tanstack/react-router'
import CheckoutPage from "../../ui/page/CheckoutPage";

export const Route = createFileRoute('/checkout/$tid')({
  component: CheckoutPage,
})
