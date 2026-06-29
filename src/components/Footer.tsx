import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { COMPANY_ADDRESS, COMPANY_PHONE } from "@/lib/whatsapp";
import { company } from "@/data/brochure";
import logo from "@/assets/logo-aayush.webp";

const footerEmails = ["sales@aayushenterprises.in", "ayushenterprisesaurangabad@gmail.com"];
const footerPhoneNumbers = ["9922227164", "9766804665"];

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="mb-4 inline-flex items-center rounded bg-white p-2 shadow-sm">
            <img
              src={logo}
              alt="Aayush Enterprises"
              className="h-12 w-auto max-w-[220px] object-contain"
            />
          </Link>
          <p className="text-sm text-secondary-foreground/70 leading-relaxed">
            Complete safety solutions for personal protective, environmental and road safety since 2017.
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 grid place-items-center border border-secondary-foreground/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-primary">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About Us" },
              { to: "/products", label: "Products" },
              { to: "/brands", label: "Brands" },
              { to: "/services", label: "Services" },
              { to: "/contact", label: "Contact" },
              { to: "/public-release", label: "Public Release" },
              { to: "/enquiry", label: "Get a Quote" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-secondary-foreground/70 hover:text-primary transition-colors">
                  → {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-primary">Categories</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/70">
            <li>Workplace Safety Gears</li>
            <li>System Installations</li>
            <li>Car Hire Services</li>
            <li>Auditing and Consulting Services</li>
            <li>Turn Key Projects</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-primary">Reach Us</h4>
          <ul className="space-y-3 text-sm text-secondary-foreground/70">
            <li className="flex gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /> {COMPANY_ADDRESS}
            </li>
            <li className="flex gap-3">
              <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" /> {COMPANY_PHONE}
            </li>
            {footerPhoneNumbers.map((phone) => (
              <li key={phone} className="flex gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" /> {phone}
              </li>
            ))}
            {footerEmails.map((email) => (
              <li key={email} className="flex gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" /> {email}
              </li>
            ))}
            <li className="flex gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /> {company.branchOffices.join(", ")}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10">
        <div className="container py-5 flex flex-col items-center justify-center gap-2 text-center text-xs text-secondary-foreground/60">
          <p className="w-full text-center">
            &copy; {new Date().getFullYear()} All Rights Reserved By Ayush Enterprises and Developed By{" "}
            <a href="https://webakoof.com" target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:text-primary/80">
              Webakoof
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
