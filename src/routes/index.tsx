import {createFileRoute} from '@tanstack/react-router'
import ProductListingPage from "../ui/page/ProductListingPage";

export const Route = createFileRoute('/')({
  component: ProductListingPage,
})

