import React, { use, useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { userContext } from "@/pages/_app";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Operational({
  statsCards,
  totalMoneyData,
  deliveriesData,
  actionButtons,
  orders,
  loading = false,
}) {
  const [user, setUser] = useContext(userContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const router = useRouter();

    const getStatusStyle = (status) => {
    const statusStyles = {
      Active: "bg-green-100 text-green-800 border border-green-200",
      Inactive: "bg-red-100 text-red-800 border border-red-200",
      Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      Completed: "bg-blue-100 text-blue-800 border border-blue-200",
      Cancelled: "bg-gray-100 text-gray-800 border border-gray-200",
      Flagged: "bg-orange-100 text-secondary border border-orange-200",
      Hold: "bg-purple-100 text-purple-800 border border-purple-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <main className="flex-1 overflow-auto p-4 lg:p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-lg lg:text-xl font-medium text-gray-900 mb-4 lg:mb-6">
          Welcome to B-Way Logistics
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            if (
              Array.isArray(card.role) &&
              !card.role.includes(user?.role?.toUpperCase())
            ) {
              return null;
            }

            return (
              <div
                key={index}
                className="bg-white rounded-lg p-3 lg:p-4 border border-gray-200 min-h-[110px]"
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

        {/* Charts Section */}
        {user?.role === "ADMIN" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {/* Total Money Paid Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                    Activity
                  </h3>
                  <p className="text-lg lg:text-xl font-bold text-gray-900">
                    Total Money Paid
                  </p>
                </div>
                <select className="bg-[#003C72] text-white px-3 py-1 rounded text-sm">
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={totalMoneyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Bar dataKey="value" fill="#003C72" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Deliveries Overview Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                    Analytics Data
                  </h3>
                  <p className="text-lg lg:text-xl font-bold text-gray-900">
                    Deliveries Overview
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#003C72] rounded mr-1"></div>
                    <span>2.01M</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary rounded mr-1"></div>
                    <span>2.20M</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deliveriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Bar
                      dataKey="delivered"
                      fill="#003C72"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="pending"
                      fill="#ff6b35"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6 lg:mb-8">
          {/* Action Buttons - Now Vertical */}
          {user?.role === "ADMIN" && (
            <div className="col-span-1">
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
            </div>
          )}

          {/* Recent Orders Table */}
          <div className={`col-span-${user?.role === "ADMIN" ? "4" : "5"}`}>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                  Recent Orders
                </h3>
                <button className="text-[#003C72] hover:text-[#003C72] font-medium text-sm lg:text-base"
                  onClick={() => router.push('/ordersv')}
                >
                  View All
                </button>
              </div>

              <div className="overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#003C72]"></div>
                    <p className="mt-2 text-gray-600">Loading recent orders...</p>
                  </div>
                ) : orders && orders.length > 0 ? (
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
                    body={(rowData) => getStatusStyle(rowData.status)}
                  />
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
                          onClick={() => {
                            setSelectedOrder(rowData);
                            setShowOrderModal(true);
                          }}
                          className="text-secondary hover:text-secondary font-medium text-sm w-full bg-secondary/20 hover:bg-secondary/40 cursor-pointer py-1 px-2 rounded"
                        >
                          View
                        </button>
                      </div>
                    )}
                  />
                </DataTable>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-600">No recent orders found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <span className="text-gray-500">×</span>
              </button>
            </div>
            <div className="p-4">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="text-sm text-gray-900">{selectedOrder.orderId || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Facility</dt>
                  <dd className="text-sm text-gray-900">{selectedOrder.facilityName || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Item(s)</dt>
                  <dd className="text-sm text-gray-900">{selectedOrder.items || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                  <dd className="text-sm text-gray-900">{selectedOrder.qty || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900">{selectedOrder.status || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Driver</dt>
                  <dd className="text-sm text-gray-900">{selectedOrder.assignedDriver || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Route</dt>
                  <dd className="text-sm text-gray-900">{selectedOrder.route || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">ETA</dt>
                  <dd className="text-sm text-gray-900">{selectedOrder.eta || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
