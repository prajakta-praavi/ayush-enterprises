import PageHero from "@/components/PageHero";
import { brands } from "@/data/brochure";

const groupedBrands = Array.from(new Set(brands.map((brand) => brand.category))).map((category) => ({
  category,
  items: brands.filter((brand) => brand.category === category),
}));

const initials = (name: string) =>
  name
    .replace(/[^A-Z0-9]+/gi, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const Brands = () => {
  return (
    <>
      <PageHero
        title="Our Brands"
        subtitle="The brochure includes 24 represented brands across PPE, environmental protection, fire safety, gas detection, electrical safety, signage and other industrial safety categories."
      />

      <section className="py-20 md:py-28 bg-background">
        <div className="container space-y-12">
          {groupedBrands.map((group) => (
            <div key={group.category}>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">● Category</div>
                  <h2 className="font-display text-3xl md:text-4xl uppercase">{group.category}</h2>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {group.items.length} Brand{group.items.length > 1 ? "s" : ""}
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.items.map((brand) => (
                  <article key={brand.name} className="group border-2 border-secondary bg-card p-6 hover:bg-secondary hover:text-secondary-foreground transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="h-14 w-14 shrink-0 grid place-items-center bg-primary text-primary-foreground border-2 border-secondary font-display text-lg">
                        {initials(brand.name)}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary">
                        Logo
                      </div>
                    </div>
                    <div className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-muted text-secondary mb-3">
                      {brand.category}
                    </div>
                    <h3 className="font-display text-2xl uppercase leading-tight mb-3">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-secondary-foreground/75">{brand.summary}</p>
                    <ul className="mt-4 space-y-2">
                      {brand.details.map((detail) => (
                        <li key={detail} className="text-xs leading-relaxed flex gap-2">
                          <span className="text-primary font-bold shrink-0">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Brands;

