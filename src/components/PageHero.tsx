import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
};

const PageHero = ({ title, subtitle, breadcrumb }: Props) => {
  return (
    <section className="relative bg-secondary text-secondary-foreground overflow-hidden border-b-4 border-primary">
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, hsl(var(--primary)) 0 20px, transparent 20px 40px)`,
      }} />
      <div className="container relative py-20 md:py-28">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
          <Link to="/" className="hover:underline">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span>{breadcrumb ?? title}</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl uppercase">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-secondary-foreground/70">{subtitle}</p>
        )}
      </div>
    </section>
  );
};

export default PageHero;
