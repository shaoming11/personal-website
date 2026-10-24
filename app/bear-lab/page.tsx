import type { Metadata } from "next"
import { BearLab } from "@/components/bear-lab/lab"

export const metadata: Metadata = {
  title: "bear lab",
  robots: { index: false, follow: false },
}

export default function BearLabPage() {
  return <BearLab />
}
