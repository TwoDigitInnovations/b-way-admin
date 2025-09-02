import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const isAuth = (Component) => {
  return function IsAuth(props) {
    const router = useRouter();
    console.log(router);
    let auth = false;
    let user;
    let isLoading = true;
    
    if (typeof window !== "undefined") {
      user = localStorage.getItem("userDetail");
      isLoading = false;
    }

    const publicRoutes = [
      "/",
      "/login", 
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-email"
    ];

    const roleAccessMap = {
      ADMIN: [
        "/dashboard",
        "/orders",
        "/allroutes",
        "/allhospitals",
        "/alldrivers",
        "/alldispatchers",
        "/compliance-report",
        "/settings",
        "/change-password",
        "/account-info",
        "/admin-only",
      ],
      CLIENT: ["/dashboard", "/orders", "/allroutes", "/settings", "/change-password", "/account-info"],
      HOSPITAL: ["/dashboard", "/orders", "/allroutes", "/settings", "/change-password", "/account-info"],
      DRIVER: ["/dashboard", "/orders", "/my-deliveries", "/change-password", "/account-info"],
      DISPATCHER: ["/dashboard", "/orders", "/settings", "/billing-invoices", "/change-password", "/account-info", "/allroutes", "/compliance-report", "/alldrivers"],
    };

    const currentRoute = router?.pathname;

    // If it's a public route, allow access without authentication
    if (publicRoutes.includes(currentRoute)) {
      auth = true;
    } else if (user) {
      const u = JSON.parse(user);
      const token = localStorage.getItem("token") || Cookies.get("token") || "";
      const role = u?.role;

      const allowedRoutes = new Set(roleAccessMap[role] || []);
      auth = !!(token && allowedRoutes.has(currentRoute));
    }

    useEffect(() => {
      if (!router.isReady || isLoading) return;
      
      if (!auth && !publicRoutes.includes(currentRoute)) {
        localStorage.clear();
        router.replace("/");
      }
    }, [auth, currentRoute, router.isReady, isLoading]);

    return <Component {...props} />;
  };
};

export default isAuth;
