import React, { useContext } from "react";
import {
  LayoutDashboard,
  Package,
  Route,
  Building2,
  Truck,
  FileText,
  BarChart3,
  MapPin,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { userContext } from "@/pages/_app";

const Sidebar = () => {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      // href: user?.role === "ADMIN" ? "/dashboard" : "/dashboard",
      href: "/dashboard",
      role: ["ADMIN", "CLIENT", "DRIVER", "DISPATCHER", "HOSPITAL"],
    },
    {
      icon: "/images/s1.png",
      label: "Items",
      href: "/items",
      role: ["ADMIN", "DISPATCHER", "CLIENT"],
    },
    {
      icon: "/images/s1.png",
      label: "Orders",
      href: "/ordersv",
      role: ["ADMIN", "DISPATCHER", "CLIENT", "HOSPITAL"],
    },
    {
      icon: "/images/s1.png",
      label: "New Delivery Request",
      href: "/new-order",
      role: ["HOSPITAL"],
    },
    {
      icon: "/images/s2.png",
      label: "Routes & Schedules",
      href: "/allroutes",
      role: ["ADMIN", "HOSPITAL"],
    },
    {
      icon: "/images/s3.png",
      label: "Hospitals & Facilities",
      href: "/allhospitals",
      role: ["ADMIN"],
    },
    {
      icon: "/images/s4.png",
      label: "Drivers & Vehicles",
      href: "/alldrivers",
      role: ["ADMIN"],
    },
    {
      icon: "/images/s8.png",
      label: "Dispatchers",
      href: "/alldispatchers",
      role: ["ADMIN"],
    },
    {
      icon: "/images/s5.png",
      label: "Compliance Reports",
      href: "/compliance-report",
      role: ["ADMIN"],
    },
    {
      icon: "/images/s8.png",
      label: "Billing & Invoices",
      href: "/billing-invoices",
      role: ["ADMIN", "DISPATCHER"],
    },
    {
      icon: "/images/s8.png",
      label: "Billing & Invoices",
      href: "/billing-and-invoice",
      role: ["CLIENT"],
    },
    {
      icon: "/images/notifications.svg",
      label: "Notification & Alert",
      href: "/alerts",
      role: ["CLIENT"],
    },
    {
      icon: "/images/manage_accounts.svg",
      label: "Account Information",
      href: "/account-info",
      role: ["HOSPITAL"],
    },
    {
      icon: "/images/headset_mic.svg",
      label: "Support & Help Center",
      href: "/support",
      role: ["HOSPITAL"],
    },
    // {
    //   icon: "/images/s6.png",
    //   label: "Fate Tracking/ Custody factory",
    //   role: ["ADMIN"],
    // },
    {
      icon: "/images/s7.png",
      label: "Settings",
      href: "/settings",
      role: ["ADMIN", "DISPATCHER"],
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Image src="/images/Logo.png" height={150} width={150} alt="img" />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.href && router.pathname === item.href;
            const userRole = user?.role || "CLIENT";
            const isVisible = item.role.includes(userRole);
            if (!isVisible) return null;
            return (
              <li key={index}>
                {item.href ? (
                  <Link href={item.href}>
                    <span
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#FF54221A] text-[#FF4B00] border-r-2 border-[#FF4B00]"
                          : "text-[#003C72] hover:bg-gray-50"
                      }`}
                    >
                      {typeof Icon === "string" ? (
                        <img
                          src={Icon}
                          alt={item.label}
                          className="w-5 h-5 object-contain"
                          style={
                            isActive
                              ? {
                                  filter:
                                    "brightness(0) saturate(100%) invert(41%) sepia(99%) saturate(7492%) hue-rotate(2deg) brightness(101%) contrast(104%)",
                                }
                              : {}
                          }
                        />
                      ) : (
                        <Icon
                          className="w-5 h-5"
                          style={isActive ? { color: "#FF4B00" } : {}}
                        />
                      )}
                      <span>{item.label}</span>
                    </span>
                  </Link>
                ) : (
                  <a
                    href="#"
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-[#003C72] hover:bg-gray-50`}
                  >
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt={item.label}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                    <span>{item.label}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
