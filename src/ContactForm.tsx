import { Send } from "lucide-react";
import type { FormEvent } from "react";
import { translate, type Language } from "./i18n";

const opportunities = [
  "Final-year internship offer (4–6 months)",
  "Technical interview / chat",
  "Full-time or fixed-term position",
  "Question about a project",
];

export default function ContactForm({ language }: { language: Language }) {
  const t = (value: string) => translate(value, language);
  function openEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const name = String(values.get("contactName")).trim();
    const opportunity = String(values.get("opportunity"));
    const message = String(values.get("message")).trim();
    const subject = `${opportunity} - ${name}`;
    const body = `Hello Nouha,\n\n${message}\n\nOpportunity: ${opportunity}\n\nBest regards,\n${name}`;
    window.location.href = `mailto:djobinouha130@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  return <form className="contact-form recruiter-contact" onSubmit={openEmail} aria-labelledby="recruiter-contact-title">
    <div className="recruiter-contact-heading">
      <h3 id="recruiter-contact-title">{t("Express Recruiter Message")}</h3>
      <p>{t("Generates a pre-filled draft in your default email client with one click.")}</p>
    </div>
    <label htmlFor="contact-name">{t("Your Name or Company")}
      <input id="contact-name" name="contactName" autoComplete="name" placeholder={t("E.g. company or recruiter name")} required maxLength={100} />
    </label>
    <label htmlFor="contact-opportunity">{t("Opportunity Type")}
      <select id="contact-opportunity" name="opportunity" defaultValue={opportunities[0]}>
        {opportunities.map(opportunity => <option key={opportunity} value={opportunity}>{t(opportunity)}</option>)}
      </select>
    </label>
    <label htmlFor="contact-message">{t("Your message")}
      <textarea id="contact-message" name="message" required rows={5} maxLength={2000} placeholder={t("Briefly describe the role or project context...")} />
    </label>
    <button type="submit"><Send size={19} aria-hidden="true" />{t("Open in Mail Client")}</button>
  </form>;
}
