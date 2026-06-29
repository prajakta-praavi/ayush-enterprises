import { Outlet, Link, NavLink } from "react-router-dom";
import { FileText, Home, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-aayush.webp";

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/", label: "Public Home", icon: Home },
  { to: "/products", label: "Products", icon: FileText },
  { to: "/public-release", label: "Public Release", icon: FileText },
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,hsl(var(--muted))_0%,hsl(var(--background))_36%)]">
      <header className="border-b-2 border-secondary bg-background/95 backdrop-blur">
        <div className="container flex h-20 items-center justify-between gap-4">
          <Link to="/admin" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Aayush Enterprises"
              className="h-10 w-auto max-w-[180px] object-contain"
            />
            <div className="hidden sm:block">
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Content Studio
              </div>
              <div className="font-display text-lg uppercase leading-none">Control Panel</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="hidden sm:inline-flex border-2 border-secondary font-bold uppercase tracking-wider">
              <Link to="/">View Site</Link>
            </Button>
            <div className="hidden rounded-full border-2 border-secondary bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-secondary sm:inline-flex">
              UI only
            </div>
          </div>
        </div>
      </header>

      <div className="container grid gap-8 py-8 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-2xl border-2 border-secondary bg-card p-4 shadow-bold">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                No backend yet
              </div>
              <div className="font-display text-xl uppercase">Workspace Menu</div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {adminNav.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/admin"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-transparent bg-muted text-muted-foreground hover:border-secondary hover:text-secondary",
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
