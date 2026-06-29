import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { whatsappLink } from "@/lib/whatsapp";
import ProductCard from "@/components/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container py-32 text-center">
        <h1 className="font-display text-5xl uppercase mb-4">Product Not Found</h1>
        <Button asChild><Link to="/products">Back to Products</Link></Button>
      </div>
    );
  }

  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <section className="bg-muted border-b-2 border-secondary">
        <div className="container py-6">
          <Link to="/products" className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary">
            <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to Products
          </Link>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container grid lg:grid-cols-2 gap-12">
          <div className="bg-muted border-2 border-secondary aspect-square overflow-hidden">
            <img src={product.image} alt={product.name} width={800} height={800} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="inline-block bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 mb-4">
              {product.category}
            </div>
            <h1 className="font-display text-4xl md:text-5xl uppercase leading-tight">{product.name}</h1>
            <p className="mt-5 text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-8">
              <h3 className="font-display text-xl uppercase mb-4 flex items-center">
                <span className="h-1 w-8 bg-primary mr-3" /> Specifications
              </h3>
              <dl className="border-2 border-secondary divide-y-2 divide-secondary">
                {product.specs.map((s, i) => (
                  <div key={i} className="grid grid-cols-[1fr_2fr] text-sm">
                    <dt className="px-4 py-3 font-bold uppercase text-xs tracking-wider bg-muted">{s.label}</dt>
                    <dd className="px-4 py-3">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <ul className="mt-6 space-y-2 text-sm">
              {["Bulk discounts available", "Custom branding for 50+ units", "Pan-India dispatch in 48hrs"].map((b) => (
                <li key={b} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {b}</li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-whatsapp text-white hover:bg-whatsapp/90 font-bold uppercase h-14 px-7">
                <a href={whatsappLink(`Hi! I'm interested in: ${product.name}. Please share pricing.`)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2" /> Enquire on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-secondary font-bold uppercase h-14 px-7">
                <Link to="/enquiry"><FileText className="mr-2" /> Send Enquiry</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl uppercase mb-10">Related Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
