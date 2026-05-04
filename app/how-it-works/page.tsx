import type { Metadata } from "next";
import { HowItWorksContent } from "@/components/HowItWorksContent";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how Drift Transfer sends files directly between browsers without accounts or server-side file storage."
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
