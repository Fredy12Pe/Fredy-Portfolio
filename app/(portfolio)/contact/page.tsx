import type { Metadata } from "next";
import ContactBoard from "../../redesign/ContactBoard";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in contact — Instagram, LinkedIn, GitHub, resume, and email.",
};

export default function ContactPage() {
  return <ContactBoard />;
}
