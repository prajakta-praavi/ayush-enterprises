import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/products";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-card border-2 border-secondary hover:shadow-bold transition-all hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1">
          {product.category}
        </div>
        <div className="absolute bottom-3 right-3 h-10 w-10 grid place-items-center bg-secondary text-secondary-foreground translate-x-12 group-hover:translate-x-0 transition-transform">
          <ArrowUpRight className="h-5 w-5" />
        </div>
      </div>
      <div className="p-5 border-t-2 border-secondary">
        <h3 className="font-display text-xl uppercase leading-tight transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{product.shortDesc}</p>
        <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-wider text-secondary">
          View Details <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
