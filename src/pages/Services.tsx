import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageHero from "@/components/PageHero";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { serviceSections } from "@/data/brochure";

const serviceParamKey = "service";
const systemInstallationService = "Complete System Installations";
const carHireService = "Car Hire";
const fireInstallationItems = new Set([
  "Fire Fighting System Installation & Maintenance",
  "Fire Hydrant System",
  "Fire Sprinkler System",
  "Fire Alarm System",
  "Auto / Manual Flooding Systems",
]);

const BulletItem = ({ item }: { item: string }) => (
  <li className="flex gap-3 text-sm leading-relaxed">
    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
    <span>{item}</span>
  </li>
);

const renderBulletList = (items: string[], className = "") => {
  const splitIndex = Math.ceil(items.length / 2);
  const columns = [items.slice(0, splitIndex), items.slice(splitIndex)].filter((column) => column.length > 0);

  return (
    <div className={`grid gap-x-8 gap-y-3 sm:grid-cols-2 ${className}`}>
      {columns.map((column, index) => (
        <ul key={index} className="grid content-start gap-3">
          {column.map((item) => (
            <BulletItem key={item} item={item} />
          ))}
        </ul>
      ))}
    </div>
  );
};

const getSystemInstallationItems = (items: string[]) => ({
  fireItems: items.filter((item) => fireInstallationItems.has(item)),
  otherItems: items.filter((item) => !fireInstallationItems.has(item)),
});
const normalizeService = (value: string | null) => {
  if (!value) {
    return serviceSections[0].title;
  }

  const match = serviceSections.find((section) => section.title === value);
  return match?.title ?? serviceSections[0].title;
};

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeService, setActiveService] = useState(() => normalizeService(searchParams.get(serviceParamKey)));

  useEffect(() => {
    setActiveService(normalizeService(searchParams.get(serviceParamKey)));
  }, [searchParams]);

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="The brochure groups Aayush Enterprises into five service verticals: training, consulting, digital printing, car hire and complete system installations."
      />

      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <Tabs
            value={activeService}
            onValueChange={(value) => {
              setActiveService(value);
              setSearchParams({ [serviceParamKey]: value });
            }}
            className="w-full"
          >
            <TabsList className="w-full flex flex-wrap h-auto justify-start gap-2 bg-transparent p-0 mb-8">
              {serviceSections.map((section) => (
                <TabsTrigger
                  key={section.title}
                  value={section.title}
                  className="px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-2 border-secondary data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-bold"
                >
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {serviceSections.map((section) => (
              <TabsContent key={section.title} value={section.title}>
                <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
                  <div className="bg-secondary text-secondary-foreground p-8 border-2 border-secondary">
                    <div className="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-3">● Brochure Vertical</div>
                    <h2 className="font-display text-4xl uppercase mb-4">{section.title}</h2>
                    <p className="text-sm text-secondary-foreground/75 leading-relaxed">{section.description}</p>
                  </div>
                  <div className="border-2 border-secondary bg-card p-5 sm:p-7">
                    {section.title === systemInstallationService ? (() => {
                      const { fireItems, otherItems } = getSystemInstallationItems(section.items);

                      return (
                        <>
                          <h3 className="mb-3 font-display text-2xl uppercase text-secondary">
                            Fire Fighting System Installation
                          </h3>
                          {renderBulletList(fireItems)}
                          {renderBulletList(otherItems, "mt-5")}
                        </>
                      );
                    })() : renderBulletList(section.items)}
                    {section.title === carHireService && (
                      <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider">
                        <Link to="/enquiry">For More Inquiry</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </>
  );
};

export default Services;
