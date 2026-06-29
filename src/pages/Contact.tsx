import { useState } from "react";
import { z } from "zod";
import { Mail, Phone, MapPin, MessageCircle, Send, Building2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import { COMPANY_ADDRESS, whatsappLink } from "@/lib/whatsapp";
import { company, contactPersons, emails } from "@/data/brochure";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone is required").max(20),
  message: z.string().trim().min(5, "Message is required").max(1000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent! We'll respond within 24 hours.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setSubmitting(false);
    }, 600);
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Reach out to the Aayush Enterprises team for quotations, branch information, manufacturing coordination or product enquiries."
      />

      <section className="py-20 bg-background">
        <div className="container grid lg:grid-cols-[1fr_1.4fr] gap-12">
          <div className="space-y-6">
            <div className="border-2 border-secondary p-6 bg-card">
              <div className="flex gap-4 items-start">
                <div className="h-12 w-12 grid place-items-center bg-primary text-primary-foreground border-2 border-secondary shrink-0">
                  <Building2 className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Head Office / HQ</div>
                  <div className="font-bold leading-snug">{COMPANY_ADDRESS}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {company.manufacturingSites.map((site, index) => (
                <div key={site} className="border-2 border-secondary p-6 bg-card flex gap-4">
                  <div className="h-12 w-12 grid place-items-center bg-secondary text-secondary-foreground shrink-0">
                    <MapPin className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      Manufacturing / Branch Site {index + 1}
                    </div>
                    <div className="font-bold leading-snug">{site}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-2 border-secondary p-6 bg-card">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Direct Contact Persons
              </div>
              <div className="grid gap-4">
                {contactPersons.map((person) => (
                  <div key={person.name} className="flex items-center justify-start gap-4 text-left">
                    <div className="h-11 w-11 grid place-items-center bg-primary text-primary-foreground border-2 border-secondary shrink-0">
                      <UserRound className="h-5 w-5" strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-black uppercase tracking-wide">{person.name}</div>
                      <div className="text-sm font-bold text-muted-foreground">{person.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-secondary p-6 bg-card">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Email IDs</div>
              <div className="space-y-2">
                {emails.map((email) => (
                  <div key={email} className="flex gap-3 items-center text-sm font-medium">
                    <Mail className="h-4 w-4 text-primary" /> {email}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-secondary p-6 bg-card">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Branch Offices</div>
              <div className="font-bold leading-snug">{company.branchOffices.join(", ")}</div>
            </div>

            <Button asChild size="lg" className="w-full bg-whatsapp text-white hover:bg-whatsapp/90 font-bold uppercase h-14">
              <a href={whatsappLink("Hello! I would like to know more about Aayush Enterprises.")} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2" /> Chat on WhatsApp
              </a>
            </Button>
          </div>

          <form onSubmit={onSubmit} className="bg-card border-2 border-secondary p-8 space-y-5">
            <h2 className="font-display text-3xl uppercase">Send Us a Message</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border-2 border-secondary h-12" maxLength={100} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Phone *</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border-2 border-secondary h-12" maxLength={20} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Email *</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border-2 border-secondary h-12" maxLength={255} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Message *</label>
              <Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="border-2 border-secondary" maxLength={1000} />
            </div>
            <Button type="submit" disabled={submitting} size="lg" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase h-14 shadow-bold">
              {submitting ? "Sending..." : <>Send Message <Send className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>
        </div>
      </section>

      <section className="bg-muted border-t-2 border-secondary">
        <div className="container py-12">
          <h3 className="font-display text-2xl uppercase mb-6 flex items-center">
            <span className="h-1 w-8 bg-primary mr-3" /> Find The HQ
          </h3>
          <div className="aspect-[16/7] border-2 border-secondary overflow-hidden">
            <iframe
              title="Aayush Enterprises Aurangabad HQ Map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(company.headquarters)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
