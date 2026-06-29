import { useState } from "react";
import { z } from "zod";
import { MessageCircle, Send, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import { categories } from "@/data/products";
import { whatsappLink } from "@/lib/whatsapp";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  company: z.string().trim().max(150).optional(),
  category: z.string().trim().max(50),
  quantity: z.string().trim().max(20),
  message: z.string().trim().max(1000),
});

const Enquiry = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    category: "Head Protection",
    quantity: "",
    message: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      toast.error("Please fill all required fields correctly.");
      return;
    }
    toast.success("Enquiry received! We'll send a quote shortly.");
    setForm({ name: "", email: "", phone: "", company: "", category: "Head Protection", quantity: "", message: "" });
  };

  const waMsg = `Hi! Quote request:\nCategory: ${form.category}\nQty: ${form.quantity || "TBD"}\nName: ${form.name || "-"}`;

  return (
    <>
      <PageHero
        title="Request a Quote"
        subtitle="Tell us what you need. We'll get back with pricing, availability and dispatch timelines within 24 hours."
        breadcrumb="Enquiry"
      />
      <section className="py-20 bg-background">
        <div className="container grid lg:grid-cols-[1.4fr_1fr] gap-12">
          <form onSubmit={onSubmit} className="bg-card border-2 border-secondary p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Full Name *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border-2 border-secondary h-12" maxLength={100} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Company</label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="border-2 border-secondary h-12" maxLength={150} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Email *</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border-2 border-secondary h-12" maxLength={255} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Phone *</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border-2 border-secondary h-12" maxLength={20} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-12 border-2 border-secondary bg-background px-3 text-sm font-medium">
                  {categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Quantity</label>
                <Input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 100 units" className="border-2 border-secondary h-12" maxLength={20} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block">Additional Requirements</label>
              <Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="border-2 border-secondary" maxLength={1000} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" size="lg" className="bg-secondary text-secondary-foreground font-bold uppercase h-14 px-8 shadow-bold">
                Submit Enquiry <Send className="ml-2 h-4 w-4" />
              </Button>
              <Button type="button" asChild size="lg" variant="outline" className="border-2 border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-white font-bold uppercase h-14 px-8">
                <a href={whatsappLink(waMsg)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2" /> Send via WhatsApp
                </a>
              </Button>
            </div>
          </form>

          <aside className="bg-secondary text-secondary-foreground p-8 border-2 border-secondary self-start">
            <FileCheck className="h-10 w-10 text-primary mb-4" strokeWidth={2.5} />
            <h3 className="font-display text-2xl uppercase mb-4">Why Enquire With Us?</h3>
            <ul className="space-y-3 text-sm text-secondary-foreground/80">
              {[
                "Quote within 24 hours",
                "Volume-based pricing for bulk orders",
                "Training, consulting and supply under one roof",
                "Custom branding available",
                "Pan-India dispatch and branch support",
              ].map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="text-primary font-bold">✓</span> {b}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Enquiry;

