import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-aayush.webp";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/brands", label: "Brands" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
  { to: "/public-release", label: "Public Release" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-secondary bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Aayush Enterprises"
            className="h-12 w-auto max-w-[200px] object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors relative",
                  isActive
                    ? "text-secondary"
                    : "text-muted-foreground hover:text-secondary"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-8 bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild variant="default" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider border-2 border-secondary shadow-bold">
            <Link to="/enquiry">Get Quote</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t-2 border-secondary bg-background">
          <div className="container py-4 flex flex-col gap-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 text-sm font-bold uppercase tracking-wider border-l-4",
                    isActive
                      ? "border-primary bg-muted text-secondary"
                      : "border-transparent text-muted-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button asChild className="mt-2 bg-primary text-primary-foreground font-bold uppercase">
              <Link to="/enquiry" onClick={() => setOpen(false)}>Get Quote</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
