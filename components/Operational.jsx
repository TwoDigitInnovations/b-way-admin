import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function Operational({
  statsCards,
  totalMoneyData,
  deliveriesData,
  actionButtons,
  orders,
}) {
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
                  <div className="w-3 h-3 bg-orange-500 rounded mr-1"></div>
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
                  <Bar dataKey="pending" fill="#ff6b35" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6 lg:mb-8">
          {/* Action Buttons - Now Vertical */}
          <div className="lg:col-span-1">
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

          {/* Recent Orders Table */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                  Recent Orders
                </h3>
                <button className="text-[#003C72] hover:text-[#003C72] font-medium text-sm lg:text-base">
                  View All
                </button>
              </div>

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
                      <th className="w-20 px-2 py-3 text-xs text-center justify-center font-medium uppercase tracking-wider">
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
                          {order.no}
                        </td>
                        <td
                          className="px-2 py-2 text-sm text-orange-600 font-medium truncate"
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
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md w-20 text-center justify-center ${order.statusColor} truncate`}
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
                          <button className="text-orange-600 hover:text-orange-700 font-medium text-sm w-full bg-orange-500/20 hover:bg-orange-500/40 cursor-pointer py-1 px-2 rounded">
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
    </main>
  );
}
