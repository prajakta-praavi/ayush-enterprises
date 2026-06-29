import type { ReactNode } from "react";

type AdminRouteProps = {
  children: ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  // Temporary design-mode bypass: authentication will be added back later.
  return <>{children}</>;
};

export default AdminRoute;
