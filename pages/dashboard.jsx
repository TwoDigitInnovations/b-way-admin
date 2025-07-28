import React from "react";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
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
  MoreHorizontal,
} from "lucide-react";
import Layout from "@/components/layout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statsCards = [
    {
      title: "Active Routes",
      value: "18",
      change: "13% active",
      changeText: "Broaches",
      icon: "/images/img5.png",

      trend: "up",
    },
    {
      title: "Orders in Transit",
      value: "46",
      change: "7% Up from past week",
      icon: "/images/img6.png",
      color: "yellow",
      trend: "up",
    },
    {
      title: "Sales this Week",
      value: "92000",
      change: "7% Up from past week",
      icon: "/images/img7.png",
      color: "green",
      trend: "up",
    },
    {
      title: "Facilities",
      value: "204",
      change: "Active Broaches",
      icon: "/images/img3.png",
      color: "red",
      trend: "up",
    },
    {
      title: "Compliance Alerts",
      value: "204",
      change: "5 Flagged alerts",
      icon: "/images/img4.png",
      color: "blue",
      trend: "up",
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
    <Layout title={"Dashboard"}>
      <div className="mb-8">
        <h2 className="text-lg lg:text-xl font-medium text-gray-900 mb-4 lg:mb-6">
          Welcome to B-Way Logistics
        </h2>

        {/* Stats Cards */}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5  gap-4 lg:gap-6 mb-6 lg:mb-8">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-3 border-b-2 lg:p-4 border border-gray-200 min-h-[110px]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xs lg:text-sm font-medium text-gray-600 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                      {card.value}
                    </p>
                    <div className="flex items-center text-xs">
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">
                        {card.change}
                      </span>
                      {card.changeText && (
                        <span className="text-gray-500 ml-1">
                          {card.changeText}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center ${
                      typeof card.icon === "string"
                        ? ""
                        : card.color === "blue"
                        ? "bg-blue-100"
                        : card.color === "yellow"
                        ? "bg-yellow-100"
                        : card.color === "green"
                        ? "bg-green-100"
                        : card.color === "red"
                        ? "bg-red-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt={card.title}
                        className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                      />
                    ) : (
                      <Icon
                        className={`w-6 h-6 ${
                          card.color === "blue"
                            ? "text-blue-600"
                            : card.color === "yellow"
                            ? "text-yellow-600"
                            : card.color === "green"
                            ? "text-green-600"
                            : card.color === "red"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6 lg:mb-8">
          {/* Action Buttons - Now Vertical */}
          {/* <div className="lg:col-span-1">
            <div className="space-y-3">
              {actionButtons.map((button, index) => {
                const Icon = button.icon;
                return (
                  <button
                    key={index}
                    className="w-full bg-[#003C72] hover:bg-[#003C72] text-white p-2 lg:p-3 rounded-lg flex items-center space-x-2 transition-colors text-left min-h-[50px]"
                  >
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt={button.title}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <Icon className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="font-medium text-xs lg:text-sm leading-tight whitespace-pre-line">
                      {button.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div> */}

          {/* Recent Orders Table */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                  Recent Orders
                </h3>
                <button className="text-[#003C72] hover:text-[#003C72] font-medium text-sm lg:text-base">
                  View All
                </button>
              </div>

              {/* Table */}
              <DataTable
                value={orders}
                stripedRows
                tableStyle={{ minWidth: "50rem" }}
                rowClassName={() => "hover:bg-gray-50"}
                size="small"
                // style={{ overflow: "visible" }}
                // scrollable={false}
                // columnResizeMode="expand"
                // resizableColumns
                // paginator
                // rows={10}
                // rowsPerPageOptions={[5, 10, 25, 50]}
              >
                <Column
                  field="no"
                  header="No."
                  bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
                  body={(rowData, options) => (
                    <span className="text-gray-600">
                      {options.rowIndex + 1}
                    </span>
                  )}
                />
                <Column
                  field="facilityName"
                  header="Facility Name"
                  bodyStyle={{
                    verticalAlign: "middle",
                    fontSize: "14px",
                  }}
                />
                <Column
                  field="orderId"
                  header="Order ID"
                  bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
                />
                <Column
                  field="items"
                  header="Item(s)"
                  bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
                />
                <Column
                  field="qty"
                  header="Qty"
                  bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
                />
                <Column
                  field="status"
                  header="Status"
                  bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
                  body={(rowData) => (
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${rowData.statusColor} truncate`}
                    >
                      {rowData.status}
                    </span>
                  )}
                />{" "}
                <Column
                  field="assignedDriver"
                  header="Driver"
                  bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
                />
                <Column
                  field="route"
                  header="Route"
                  bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
                />
                <Column
                  field="route"
                  header="Route"
                  bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
                />
                <Column
                  field="eta"
                  header="ETA"
                  bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
                />
                <Column
                  header="Action"
                  bodyStyle={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    overflow: "visible",
                    position: "relative",
                  }}
                  body={(rowData, options) => (
                    <div className="relative flex justify-center">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setSelectedRowData(rowData);
                          // menuRef.current.toggle(event);
                        }}
                        className="text-secondary hover:text-secondary font-medium text-sm"
                      >
                        View
                      </button>
                    </div>
                  )}
                />
              </DataTable>

              <div className="overflow-hidden">
                <table className="w-full table-fixed">
                  <thead className="bg-[#003C72] text-white">
                    <tr>
                      <th className="w-12 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        No.
                      </th>
                      <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Facility Name
                      </th>
                      <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Item(s)
                      </th>
                      <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="w-20 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Status
                      </th>
                      <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">
                        Driver
                      </th>
                      <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">
                        Route
                      </th>
                      <th className="w-20 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                        ETA
                      </th>
                      <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-sm text-gray-900 truncate">
                          {index + 1}
                        </td>
                        <td
                          className="px-2 py-2 text-sm text-secondary font-medium truncate"
                          title={order.facilityName}
                        >
                          {order.facilityName}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-900 truncate">
                          {order.orderId}
                        </td>
                        <td
                          className="px-2 py-2 text-sm text-gray-900 truncate"
                          title={order.items}
                        >
                          {order.items}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-900 truncate">
                          {order.qty}
                        </td>
                        <td className="px-2 py-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.statusColor} truncate`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-900 hidden lg:table-cell truncate">
                          {order.assignedDriver}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-900 hidden lg:table-cell truncate">
                          {order.route}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-900 hidden md:table-cell truncate">
                          {order.eta}
                        </td>
                        <td className="px-2 py-2">
                          <button className="text-secondary hover:text-secondary font-medium text-sm">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
