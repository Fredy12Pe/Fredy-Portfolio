import type { Metadata } from "next";
import ContactBoard from "../ContactBoard";

export const metadata: Metadata = {
  title: "Fredy · Contact",
  description: "Get in contact — Instagram, LinkedIn, GitHub, resume, and email",
};

export default function ContactPage() {
  return <ContactBoard />;
}
