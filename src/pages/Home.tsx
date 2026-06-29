import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
  Factory,
  HardHat,
  HeartPulse,
  Radar,
  ScanSearch,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { coreVerticals, brochureHighlights, company } from "@/data/brochure";
import completeSystemInstallation from "@/assets/complete system installation .jpeg";
import industrialConsultingServices from "@/assets/industrial consulting services.jpeg";
import capabilityBuilding from "@/assets/capability building.jpeg";
import revampingImage from "@/assets/revamping image.jpeg";
import carHireServices from "@/assets/car hire services.jpeg";
import ourExpertiseSolutions from "@/assets/image.png";

const premiumStory = [
  { icon: HeartPulse, title: "Core Mission", desc: "Achieve zero workplace fatalities and injuries." },
  { icon: ShieldCheck, title: "Founded In 2017", desc: "Occupational Health and Safety for modern workplaces." },
  { icon: Radar, title: "Our Approach", desc: "Heavy-duty physical protection with smart, modern technology." },
  { icon: Factory, title: "Industries Served", desc: "Construction, manufacturing, chemical processing, warehousing, and energy." },
];

const premiumCapabilities = [
  { icon: HardHat, title: "Advanced Wearables", desc: "Smart PPE including helmets, vests, and eyewear designed to protect and monitor." },
  { icon: ScanSearch, title: "Hazard Prevention", desc: "Advanced site monitoring tools detect gas leaks, structural weaknesses, and environmental threats." },
  { icon: Users, title: "Safety Consulting", desc: "Tailored risk assessment and training modules help businesses align with global safety standards." },
  { icon: AlertTriangle, title: "Tech-Driven Solutions", desc: "Real-time alert systems keep workers connected to safety hubs instantly." },
];

const premiumReasons = [
  { icon: Award, title: "Uncompromising Quality", desc: "Every product we distribute or manufacture undergoes rigorous stress testing to meet international safety benchmarks." },
  { icon: Factory, title: "Proven Track Record", desc: "Since 2017, we have helped facilities reduce their annual incident rates." },
  { icon: CheckCircle2, title: "Worker-Centric Design", desc: "Ergonomic designs ensure that workers actually want to wear their protective equipment." },
];

type FeaturedVertical = (typeof coreVerticals)[number] & {
  image: string;
};

const featuredVerticals = [
  { ...coreVerticals[2], image: completeSystemInstallation },
  { ...coreVerticals[4], image: industrialConsultingServices },
  { ...coreVerticals[1], image: capabilityBuilding },
  { ...coreVerticals[0], image: ourExpertiseSolutions },
  { ...coreVerticals[3], image: carHireServices },
] satisfies FeaturedVertical[];

const faqs = [
  { q: "When was Aayush Enterprises established?", a: "The company was established in 2017 and is headquartered in Aurangabad, Maharashtra." },
  { q: "What are the main business verticals?", a: "The five core verticals are Workplace Safety Gears, System Installations, Car Hire Services, Auditing and Consulting Services and Turn Key Projects." },
  { q: "Do you also provide training and consulting?", a: "Yes. The brochure includes 5 service verticals covering training, consulting, digital printing, car hire and system installations." },
  { q: "How many branch offices are mentioned in the brochure?", a: "The brochure lists 3 branch offices: Indore, Pune and Nasik." },
];

const Home = () => {
  return (
    <>
      <HeroSlider />

      <section className="py-16 md:py-20 bg-background border-b-2 border-secondary/10">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {featuredVerticals.map((item, index) => (
              <div
                key={item.title}
                className={`group relative overflow-hidden rounded-[2.3rem] border transition-all duration-300 hover:-translate-y-1 xl:min-h-[31rem] ${
                  index === 1
                    ? "border-transparent bg-[#101010] text-white shadow-[0_24px_60px_rgba(0,0,0,0.32)]"
                    : "border-secondary/15 bg-gradient-to-b from-white via-white to-slate-50 shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-[3px] ${
                    index === 1 ? "bg-primary" : "bg-gradient-to-r from-primary via-primary/70 to-transparent"
                  }`}
                />
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-contain object-center p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
                </div>
                <div className="relative p-5 md:p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className={`h-9 w-9 rounded-full border ${index === 1 ? "border-white/10 bg-white/5" : "border-secondary/10 bg-white"}`} />
                    <div className={`text-[0.65rem] font-bold uppercase tracking-[0.32em] ${index === 1 ? "text-primary" : "text-primary"}`}>
                      {index === 1 ? "Featured" : "Service"}
                    </div>
                  </div>
                  <h3 className={`font-display text-[1.65rem] md:text-[1.85rem] uppercase leading-[0.94] mb-4 ${index === 1 ? "text-white" : "text-secondary"}`}>
                    {item.title}
                  </h3>
                  <ul className={`space-y-2.5 text-[0.93rem] leading-relaxed ${index === 1 ? "text-white/78" : "text-muted-foreground"}`}>
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${index === 1 ? "bg-primary" : "bg-primary"}`} />
                        <span className="max-w-[16rem]">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="container grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div className="bg-muted border-2 border-secondary p-8">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3">● Company Snapshot</div>
            <h2 className="font-display text-4xl md:text-5xl uppercase leading-tight">
              {company.tagline} <br />
              
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              AAYUSH ENTERPRISES" is an organization helping workplaces become more safer and smarter since a decade with dedicated support to ensure precious live's are improved across workplaces
            </p>
            <Button asChild className="mt-8 bg-secondary text-secondary-foreground font-bold uppercase h-12 px-7">
              <Link to="/about">About The Company</Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {brochureHighlights.map((item, index) => (
              <div key={item.label} className={`border-2 p-6 ${index % 2 === 0 ? "bg-card border-secondary" : "bg-primary border-primary text-primary-foreground"}`}>
                <div className="text-xs font-bold uppercase tracking-[0.3em] mb-3 opacity-75">{item.label}</div>
                <div className="font-display text-3xl uppercase leading-tight">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 md:py-28 bg-background">
        <div className="container grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3">
              <span className="text-primary">â—</span> FAQ
            </div>
            <h2 className="font-display text-4xl md:text-5xl uppercase leading-tight">Questions?<br />We&apos;ve Got Answers.</h2>
            <p className="mt-4 text-muted-foreground">Use this brochure-backed summary to understand the company scope before you enquire.</p>
            <Button asChild className="mt-6 bg-secondary text-secondary-foreground font-bold uppercase">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b-2 border-secondary">
                <AccordionTrigger className="text-left font-display text-xl uppercase hover:no-underline py-5 hover:text-primary-foreground hover:bg-secondary px-2 [&[data-state=open]]:bg-secondary [&[data-state=open]]:text-primary-foreground [&[data-state=open]]:px-4">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2 pb-5 px-2 text-base">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
};

export default Home;


