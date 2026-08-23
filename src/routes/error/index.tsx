import { createFileRoute } from '@tanstack/react-router'
import ErrorPage from "../../ui/page/ErrorPage";

export const Route = createFileRoute('/error/')({
  component: ErrorPage,
})

