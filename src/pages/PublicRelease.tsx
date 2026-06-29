import PageHero from "@/components/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileCheck, FileText, ShieldCheck, UsersRound } from "lucide-react";

const releases = [
  {
    title: "Code of Conduct",
    description: "Company conduct principles and ethical expectations for responsible business practices.",
    icon: FileCheck,
    pdf: `${import.meta.env.BASE_URL}assets/code-of-conduct.pdf`,
  },
  {
    title: "EHS Policy",
    description: "Environment, health, and safety commitments for safe and responsible operations.",
    icon: ShieldCheck,
    pdf: `${import.meta.env.BASE_URL}assets/ehs-policy.pdf`,
  },
  {
    title: "Quality Policy",
    description: "Quality standards and continual improvement commitments across products and services.",
    icon: FileText,
    pdf: `${import.meta.env.BASE_URL}assets/quality-policy.pdf`,
  },
  {
    title: "Human Rights Policy",
    description: "Human rights principles covering dignity, fairness, and respectful workplace conduct.",
    icon: UsersRound,
    pdf: `${import.meta.env.BASE_URL}assets/human-rights-policy.pdf`,
  },
];

const PublicRelease = () => {
  return (
    <>
      <PageHero
        title="Public Release"
        subtitle="Official announcements, notices, and public documents published by Aayush Enterprises."
        breadcrumb="Public Release"
      />

      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-3xl mb-10">
            <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary">Official Information</Badge>
            <h2 className="font-display text-4xl md:text-5xl uppercase leading-tight">
              Public statements and release material in one place.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              This page can be used to share public-facing updates with customers, partners, and visitors. Keep the
              content short, factual, and easy to verify.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {releases.map((item) => (
              <Card key={item.title} className="flex h-full flex-col border-2 border-secondary shadow-none">
                <CardHeader>
                  <div className="h-12 w-12 grid place-items-center bg-secondary text-secondary-foreground mb-4">
                    <item.icon className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <CardTitle className="font-display text-2xl uppercase leading-tight">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider">
                    <a href={item.pdf} download>
                      Download PDF <Download className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PublicRelease;
