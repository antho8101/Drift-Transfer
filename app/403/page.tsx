import type { Metadata } from "next";
import { ForbiddenView } from "@/components/ForbiddenView";

export const metadata: Metadata = {
  title: "403 - Access Denied",
  description:
    "This private Drift Transfer room is not available from this link or device.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ForbiddenPage() {
  return <ForbiddenView />;
}
