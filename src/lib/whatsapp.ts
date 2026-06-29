import { company, contactPersons, emails } from "@/data/brochure";

export const WHATSAPP_NUMBER = contactPersons[0].phoneDigits;
export const COMPANY_NAME = company.name;
export const COMPANY_EMAIL = emails[0];
export const COMPANY_PHONE = contactPersons[0].phone;
export const COMPANY_ADDRESS = company.headquarters;

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
