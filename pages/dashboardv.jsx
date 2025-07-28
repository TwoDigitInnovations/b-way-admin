import React from "react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  Package,
  DollarSign,
  MapPin,
  AlertTriangle,
  Plus,
  Eye,
  Route,
  FileText,
  CreditCard,
  LifeBuoy,
  Menu,
  X,
  Home,
  Users,
  Truck,
  Settings,
  FileBarChart,
  LogOut,
} from "lucide-react";
import Operational from "@/components/Operational";
import Investor from "@/components/Investor";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import isAuth from "@/components/isAuth";

function Dashboard({user}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("operational");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const router = useRouter();

  const statsCards = [
    {
      title: "Active Routes",
      value: "18",
      change: "13% active",
      changeText: "Broaches",
      icon: "/images/img5.png",
      trend: "up",
      role: ["ADMIN", "DISPATCHER", "USER"],
    },
    {
      title: "Orders in Transit",
      value: "46",
      change: "7% Up from past week",
      icon: "/images/img6.png",
      color: "yellow",
      trend: "up",
      role: ["ADMIN", "DISPATCHER", "USER"],
    },
    {
      title: "Sales this Week",
      value: "92000",
      change: "7% Up from past week",
      icon: "/images/img7.png",
      color: "green",
      trend: "up",
      role: ["ADMIN", "DISPATCHER", "USER"],
    },
    {
      title: "Facilities",
      value: "204",
      change: "Active Broaches",
      icon: "/images/img3.png",
      color: "red",
      trend: "up",
      role: ["ADMIN", "DISPATCHER", "USER"],
    },
    {
      title: "Compliance Alerts",
      value: "204",
      change: "5 Flagged alerts",
      icon: "/images/img4.png",
      color: "blue",
      trend: "up",
      role: ["ADMIN", "DISPATCHER", "USER"],
    },
    {
      title: "Available Drivers",
      value: "204",
      icon: "/images/driver.png",
      change: "5 Flagged alerts",
      trend: "up",
      role: ["ADMIN"]
    },
    {
      title: "Available Partners",
      value: "400",
      icon: "/images/user.png",
      change: "5 Flagged alerts",
      trend: "up",
      role: ["ADMIN"]
    },
  ];

  const actionButtons = [
    {
      title: "Add Emergency\nDelivery",
      icon: "/images/b1.png",
      color: "bg-[#003C72] hover:bg-[#003C72]",
    },
    {
      title: "Real-Time Route\nTracking",
      icon: "/images/b2.png",
      color: "bg-[#003C72] hover:bg-[#003C72]",
    },
    {
      title: "Generate Compliance\nReport",
      icon: "/images/b3.png",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Update\nInventory",
      icon: "/images/b4.png",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "View Payments/\nStripe Logs",
      icon: "/images/b5.png",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Support & Excelation\nTickets",
      icon: "/images/b6.png",
      color: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  // Chart data
  const totalMoneyData = [
    { name: "MON", value: 12000 },
    { name: "TUE", value: 8000 },
    { name: "WED", value: 15000 },
    { name: "THU", value: 10000 },
    { name: "FRI", value: 23000 },
    { name: "SAT", value: 7000 },
    { name: "SUN", value: 14000 },
  ];

  const totalDeliveryData = [
    { name: "North", value: 12000 },
    { name: "South", value: 8000 },
    { name: "East", value: 15000 },
    { name: "West", value: 10000 },
  ];

  const customerLoyaltyData = [
    { name: "Retained", value: 12000 },
    { name: "Churned", value: 8000 },
  ];

  const deliveriesData = [
    { name: "2019", delivered: 18000, pending: 12000 },
    { name: "2020", delivered: 25000, pending: 15000 },
    { name: "2021", delivered: 35000, pending: 18000 },
    { name: "2022", delivered: 28000, pending: 8000 },
  ];

  const orders = [
    {
      no: 1,
      facilityName: "NYU Langone",
      orderId: "ORD-20943",
      items: "IV Admixture - Carthe",
      qty: 12,
      status: "Hold",
      statusColor: "bg-red-100 text-red-800",
      assignedDriver: "David M.",
      route: "Carla G.",
      eta: "2:10 PM",
    },
    {
      no: 2,
      facilityName: "Columbia Peds",
      orderId: "ORD-20943",
      items: "IV Admixture",
      qty: 20,
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-800",
      assignedDriver: "Carla G.",
      route: "David M.",
      eta: "8:52 PM",
    },
    {
      no: 3,
      facilityName: "Oxford Hospital",
      orderId: "ORD-20943",
      items: "IV Admixture",
      qty: 15,
      status: "Active",
      statusColor: "bg-green-100 text-green-800",
      assignedDriver: "David J.",
      route: "Carlin D.",
      eta: "8:52 AM",
    },
    {
      no: 4,
      facilityName: "Jammu Hospital",
      orderId: "ORD-20943",
      items: "IV Admixture - NOU",
      qty: 10,
      status: "Hold",
      statusColor: "bg-red-100 text-red-800",
      assignedDriver: "Carlin D.",
      route: "David M.",
      eta: "8:52 PM",
    },
    {
      no: 5,
      facilityName: "Bellevue Hospital",
      orderId: "ORD-20943",
      items: "IV Admixture - Carthe",
      qty: 12,
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-800",
      assignedDriver: "David M.",
      route: "Carla G.",
      eta: "8:52 AM",
    },
    {
      no: 6,
      facilityName: "Retanice Logist",
      orderId: "ORD-20943",
      items: "IV Osortorua",
      qty: 50,
      status: "Active",
      statusColor: "bg-green-100 text-green-800",
      assignedDriver: "Carla G.",
      route: "David J.",
      eta: "8:52 AM",
    },
  ];

  return (
    <Layout title="Dashboard">
      {user?.role === "ADMIN" && (
      <div className="bg-white shadow-sm border border-gray-200 p-2 mb-4 lg:mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("operational")}
            className={`text-lg lg:text-xl font-medium pb-2 border-b-2 transition-colors ${
              activeTab === "operational"
                ? "text-[#003C72] border-[#003C72]"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Operational
          </button>
          <button
            onClick={() => setActiveTab("investor")}
            className={`text-lg lg:text-xl font-medium pb-2 border-b-2 transition-colors ${
              activeTab === "investor"
                ? "text-[#003C72] border-[#003C72]"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Investor
          </button>
        </div>
      </div>
      )}
      {/* Main Dashboard Content */}
      {activeTab === "operational" ? (
        <Operational
          statsCards={statsCards}
          totalMoneyData={totalMoneyData}
          deliveriesData={deliveriesData}
          actionButtons={actionButtons}
          orders={orders}
        />
      ) : (
        <Investor
          totalDeliveryData={totalDeliveryData}
          customerLoyaltyData={customerLoyaltyData}
        />
      )}
    </Layout>
  );
}

export default isAuth(Dashboard);
