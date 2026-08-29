import { createFileRoute } from '@tanstack/react-router'
import ThankyouPage from "../../ui/page/ThankyouPage";

export const Route = createFileRoute('/thankyou/')({
  component: ThankyouPage,
})
