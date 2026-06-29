import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CarFront, GraduationCap, MessageCircle, Printer, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/whatsapp";
import completeSystemInstallation from "@/assets/complete system installation .jpeg";
import industrialConsultingServices from "@/assets/industrial consulting services.jpeg";
import capabilityBuilding from "@/assets/capability building.jpeg";
import revampingImage from "@/assets/revamping image.jpeg";
import carHireServices from "@/assets/car hire services.jpeg";
import heroBanner from "@/assets/hero_banner.png";

type ServiceHighlight = {
  title: string;
  icon: LucideIcon;
  image?: string;
  imageAlt?: string;
};

const serviceHighlights: ServiceHighlight[] = [
  {
    title: "Complete System Installations",
    icon: GraduationCap,
    image: completeSystemInstallation,
    imageAlt: "Complete system installation",
  },
  {
    title: "Industrial Consulting Services",
    icon: ShieldCheck,
    image: industrialConsultingServices,
    imageAlt: "Industrial consulting services",
  },
  {
    title: "Capability Building Bandwidth",
    icon: Printer,
    image: capabilityBuilding,
    imageAlt: "Capability building",
  },
  {
    title: "A complete revamping of workplace with interactive displays",
    icon: CarFront,
    image: revampingImage,
    imageAlt: "Revamping workplace with interactive displays",
  },
  {
    title: "Car Hire Services",
    icon: Wrench,
    image: carHireServices,
    imageAlt: "Car hire services",
  },
];

const HeroSlider = () => {
  return (
    <section className="relative min-h-[760px] overflow-hidden bg-secondary md:h-[88vh] md:min-h-[720px]">
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Complete Safety Solutions Since 2017"
          width={1920}
          height={1080}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <div className="relative z-10 container flex min-h-[760px] flex-col justify-between gap-8 py-20 sm:py-24 md:h-full md:min-h-0 md:py-24 lg:py-28">
        <div className="flex w-full max-w-7xl flex-1 flex-col justify-between gap-8 text-secondary-foreground animate-slide-up">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.95]">
              SECURING SAFER WORKPLACES
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-secondary-foreground/85 sm:text-lg md:mt-6 md:text-xl">
              Aayush Enterprises is  a one stop solution for all your needs towards making workplaces safer.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-[3.25rem] w-full px-6 text-sm font-bold uppercase tracking-wider shadow-yellow sm:h-14 sm:w-auto sm:px-8 sm:text-base"
              >
                <Link to="/services">
                  View Services <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent text-secondary-foreground border-2 border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary h-[3.25rem] w-full px-6 text-sm font-bold uppercase tracking-wider sm:h-14 sm:w-auto sm:px-8 sm:text-base"
              >
                <a href={whatsappLink("Hello, I would like to know more about Aayush Enterprises and the brochure range.")} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2" /> WhatsApp Us
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-black/30 p-4 shadow-2xl backdrop-blur-md sm:rounded-[1.5rem] md:p-5 lg:p-6">
            <div className="mb-3 text-[0.62rem] font-bold uppercase leading-relaxed tracking-[0.18em] text-secondary-foreground/70 sm:mb-4 sm:tracking-[0.35em]">
              End-to-end installation and integration solutions for seamless operations.
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-5">
              {serviceHighlights.map((service) => (
                <Link
                  key={service.title}
                  to={`/services?service=${encodeURIComponent(service.title)}`}
                  aria-label={`Open ${service.title}`}
                  className="group flex min-h-[5.75rem] min-w-[15rem] items-start gap-3 rounded-xl border border-white/15 bg-white/10 px-3 py-3 transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:min-w-0 md:min-h-[6.25rem] md:gap-4 md:px-4 md:py-4 xl:min-h-[7rem]"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 md:h-14 md:w-14 md:rounded-xl">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.imageAlt ?? service.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <service.icon className="h-6 w-6 transition-transform duration-200 group-hover:scale-105" strokeWidth={2.5} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold uppercase leading-snug text-secondary-foreground sm:text-sm md:text-[0.9rem]">
                      {service.title}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
