import { ShieldCheck, Target, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/PageHero";
import hero2 from "@/assets/hero-2.jpg";
import { company, companyValues } from "@/data/brochure";
import { Link } from "react-router-dom";

const stats = [
  { value: "2017", label: "Established" },
  { value: "3", label: "Branch Offices" },
  { value: "5", label: "Service Verticals" },
  { value: "24", label: "Brands Represented" },
];

const About = () => {
  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Aayush Enterprises is a safety solutions company based in Aurangabad, Maharashtra, focused on protecting lives through products, services and systems."
      />

      <section className="py-20 md:py-28 bg-background">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img src={hero2} alt="Industrial safety equipment" width={1920} height={1080} loading="lazy" className="w-full aspect-[4/3] object-cover border-2 border-secondary" />
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 border-2 border-secondary shadow-bold hidden md:block">
              <div className="font-display text-5xl">{company.established}</div>
              <div className="text-xs font-bold uppercase tracking-wider">Established Since</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3">
              <span className="text-primary">●</span> Our Story
            </div>
            <h2 className="font-display text-4xl md:text-5xl uppercase leading-tight">
              {company.tagline}. <br />
              Safety across every worksite.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Founded in {company.established}, Aayush Enterprises is headquartered in Aurangabad, Maharashtra with three branch offices and two manufacturing locations. The company provides complete safety solutions across Workplace Safety Gears, System Installations, Car Hire Services, Auditing and Consulting Services and Turn Key Projects.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The brochure emphasizes protecting people at the workplace regardless of their work type, supported by trainings, consulting, digital printing, car hire and complete system installations.
            </p>
            <Button asChild className="mt-8 bg-secondary text-secondary-foreground font-bold uppercase h-12 px-7">
              <Link to="/brands">See Our Brands</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-secondary text-secondary-foreground py-20">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i} className="border-l-4 border-primary pl-5 text-left">
              <div className="font-display text-5xl md:text-6xl text-primary">{s.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider mt-2 text-secondary-foreground/80">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="container grid md:grid-cols-3 gap-8">
          {[
            { icon: Target, title: "Vision", text: "To be a market leader in protecting employees and workforce at various organizations and to develop a world class safety culture within the society by 2030." },
            { icon: Eye, title: "Mission", text: "To deliver complete safety solutions through trusted brands, expert services and practical on-site systems." },
            { icon: ShieldCheck, title: "Values", text: "Safety of employee and product, quality of services, integrity, customer satisfaction, continuous improvement and agile teamwork." },
          ].map((c, i) => (
            <div key={i} className="bg-card border-2 border-secondary p-8 hover:bg-secondary hover:text-secondary-foreground transition-colors group">
              <div className="h-14 w-14 grid place-items-center bg-primary text-primary-foreground border-2 border-secondary mb-5 group-hover:rotate-6 transition-transform">
                <c.icon className="h-7 w-7" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-3xl uppercase mb-3">{c.title}</h3>
              <p className="text-sm leading-relaxed opacity-80">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="container grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3">
              <span className="text-primary">●</span> Offices
            </div>
            <h2 className="font-display text-4xl md:text-5xl uppercase leading-tight">Office, branches and manufacturing support.</h2>
            <p className="mt-4 text-muted-foreground">
              Headquarters, manufacturing facilities and branch offices are part of the brochure footprint.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="border-2 border-secondary bg-background p-6">
              <div className="font-display text-2xl uppercase mb-2">Head Office / HQ</div>
              <p className="text-sm text-muted-foreground">{company.headquarters}</p>
            </div>
            {company.manufacturingSites.map((site, index) => (
              <div key={site} className="border-2 border-secondary bg-background p-6">
                <div className="font-display text-2xl uppercase mb-2">Manufacturing Site {index + 1}</div>
                <p className="text-sm text-muted-foreground">{site}</p>
              </div>
            ))}
            <div className="border-2 border-secondary bg-background p-6">
              <div className="font-display text-2xl uppercase mb-2">Branch Offices</div>
              <p className="text-sm text-muted-foreground">{company.branchOffices.join(", ")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3">
              <span className="text-primary">●</span> Values
            </div>
            <h2 className="font-display text-4xl md:text-6xl uppercase">
              Built on <span className="bg-secondary text-secondary-foreground px-2">principles</span>
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companyValues.map((value, i) => (
              <div key={value} className="border-2 border-secondary bg-card p-6 flex gap-4 items-start">
                <div className="h-12 w-12 shrink-0 grid place-items-center bg-primary text-primary-foreground border-2 border-secondary font-display text-xl">
                  0{i + 1}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
