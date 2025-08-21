import React from "react";
import { useState, useEffect } from "react";
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
  Wifi,
  WifiOff,
} from "lucide-react";
import Operational from "@/components/Operational";
import Investor from "@/components/Investor";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import isAuth from "@/components/isAuth";
import { Api } from "@/helper/service";
import { useSocket } from "@/contexts/SocketContext";

function Dashboard({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("operational");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(user);

  const { isConnected, orders: realtimeOrders } = useSocket();

  const router = useRouter();

  useEffect(() => {
    if (!currentUser && typeof window !== "undefined") {
      const userData = localStorage.getItem("userDetail");
      if (userData) {
        try {
          setCurrentUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }
  }, [currentUser]);

  console.log("Current user in dashboard:", currentUser);
  console.log("Socket connection status:", isConnected);
  console.log("Real-time orders count:", realtimeOrders.length);

  const fetchRecentOrders = async () => {
    try {
      setLoading(true);
      const response = await Api("GET", "/order/recent?limit=6", null, router);

      if (response?.status) {
        setRecentOrders(response.data);
      } else {
        console.error("Failed to fetch recent orders:", response?.message);
      }
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayOrders = React.useMemo(() => {
    console.log("Combining orders:", {
      realtimeOrdersCount: realtimeOrders.length,
      recentOrdersCount: recentOrders.length,
      realtimeOrders: realtimeOrders,
      recentOrders: recentOrders,
    });

    const realtimeOrderIds = new Set(realtimeOrders.map((order) => order._id));
    const filteredRecentOrders = recentOrders.filter(
      (order) => !realtimeOrderIds.has(order._id)
    );
    const combined = [...realtimeOrders, ...filteredRecentOrders];

    console.log("Combined orders result:", {
      combinedCount: combined.length,
      finalOrders: combined.slice(0, 6),
    });

    return combined.slice(0, 6);
  }, [realtimeOrders, recentOrders]);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const statsCards = [
    {
      title: "Active Routes",
      value: "18",
      change: "13% active",
      changeText: "Broaches",
      icon: "/images/img5.png",
      trend: "up",
      role: ["ADMIN", "DISPATCHER", "CLIENT", "HOSPITAL"],
    },
    {
      title: "Proof Of Delivery",
      value: "18",
      changeText: "per route,  schedule hour.",
      icon: "/images/img5.png",
      // trend: "up",
      color: "yellow",
      role: ["CLIENT", "HOSPITAL"],
    },
    {
      title: "Missing Delivery",
      value: "18",
      changeText: "Delayed or Missing delivery",
      icon: "/images/img5.png",
      // trend: "up",
      role: ["CLIENT"],
    },
    {
      title: "Delivery Completed",
      value: "18",
      changeText: "Active Broaches",
      icon: "/images/img5.png",
      // trend: "up",
      role: ["CLIENT"],
    },
    {
      title: "Orders in Transit",
      value: "46",
      change: "",
      icon: "/images/img6.png",
      color: "yellow",
      trend: "up",
      role: ["ADMIN", "DISPATCHER", "HOSPITAL"],
    },
    {
      title: "Sales this Week",
      value: "92000",
      change: "7% Up from past week",
      icon: "/images/img7.png",
      color: "green",
      trend: "up",
      role: ["ADMIN", "DISPATCHER", "HOSPITAL"],
    },
    {
      title: "Facilities",
      value: "204",
      change: "Active Broaches",
      icon: "/images/img3.png",
      color: "red",
      trend: "up",
      role: ["ADMIN", "DISPATCHER", "HOSPITAL"],
    },
    {
      title: "Compliance Alerts",
      value: "204",
      change: "5 Flagged alerts",
      icon: "/images/img4.png",
      color: "blue",
      trend: "up",
      role: ["ADMIN", "DISPATCHER", "CLIENT", "HOSPITAL"],
    },
    {
      title: "Daily Work Completed",
      value: "50%",
      changeText: "Based on total totes delivered today",
      icon: "/images/wait.png",
      color: "blue",
      // trend: "up",
      role: ["CLIENT", "HOSPITAL"],
    },
    {
      title: "Available Drivers",
      value: "204",
      icon: "/images/driver.png",
      change: "5 Flagged alerts",
      trend: "up",
      role: ["ADMIN"],
    },
    {
      title: "Available Partners",
      value: "400",
      icon: "/images/user.png",
      change: "5 Flagged alerts",
      trend: "up",
      role: ["ADMIN"],
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

  const orders = displayOrders;

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

          {/* <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isConnected
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4" />
                <span>Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span>Offline</span>
              </>
            )}
          </div> */}
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
          loading={loading}
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
