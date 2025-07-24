import Currency from "@/helper/currency";
import { ChartColumn, LucidePhoneForwarded, Tv } from "lucide-react";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
export default function Investor({ totalDeliveryData, customerLoyaltyData }) {
  return (
    <main className="flex-1 overflow-auto p-4 lg:p-6">
      {/* Main Content */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary mb-2">
          Investor & Growth Analytics Dashboard
        </h2>
        <h2 className="text-lg font-regular text-gray-900 my-2">
          Key Performance Indicators
        </h2>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-5 gap-5 mb-6">
          <div className="bg-white rounded-lg p-3 lg:p-4 border border-gray-200 flex flex-col items-start">
            <span className="text-gray-600 text-sm">
              Total Revenue (This Quarter)
            </span>
            <span className="text-2xl font-bold text-black">{Currency(1500000)}</span>
          </div>
          <div className="bg-white rounded-lg p-3 lg:p-4 border border-gray-200 flex flex-col items-start">
            <span className="text-gray-600 text-sm">Year-over-Year Growth</span>
            <span className="text-2xl font-bold text-black">20%</span>
          </div>
          <div className="bg-white rounded-lg p-3 lg:p-4 border border-gray-200 flex flex-col items-start">
            <span className="text-gray-600 text-sm">
              Customer Retention Rate
            </span>
            <span className="text-2xl font-bold text-black">85%</span>
          </div>
          <div className="bg-white rounded-lg p-3 lg:p-4 border border-gray-200 flex flex-col items-start">
            <span className="text-gray-600 text-sm">Net New Customers</span>
            <span className="text-2xl font-bold text-black">500</span>
          </div>
          <div className="bg-white rounded-lg p-3 lg:p-4 border border-gray-200 flex flex-col items-start">
            <span className="text-gray-600 text-sm">Active Market Regions</span>
            <span className="text-2xl font-bold text-black">5</span>
          </div>
        </div>

        {/* Section Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Delivery Volume Overview */}
          <div>
            <h1 className="bg-white px-4 py-2 text-lg font-semibold text-black mb-2">
              Delivery Volume Overview
            </h1>
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700">
                  Delivery Volume by Region
                </span>
              </div>
              <div className="text-3xl font-bold text-black pb-2">
                150,000
              </div>
                <span className="text-sm text-gray-500">2022-2024 <span className="text-green-600">+15%</span></span>
              <div className="flex space-x-6 mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={totalDeliveryData}>
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
          </div>

          {/* Customer Retention Breakdown */}
          <div>
            <h1 className="bg-white px-4 py-2 text-lg font-semibold text-black mb-2">
              Customer Retention Breakdown
            </h1>
            <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700">
                  Customer Loyalty Over Time
                </span>
              </div>
              <div className="text-3xl font-bold text-blue-900">85%</div>
              <span className="text-sm text-gray-500">
                Current Quarter <span className="text-green-400">+5%</span>
              </span>
              <div className="mt-3 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={customerLoyaltyData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      fontSize={12}
                    />
                    <Bar dataKey="value" fill="#003C72" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5 mb-6">
            <h1 className="bg-white px-4 py-2 col-span-4 text-lg font-semibold text-black mb-2">
              Customer Retention Breakdown
            </h1>
          <div className="flex flex-col items-start bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <span className="text-gray-500 text-sm">
              Customer Acquisition Cost (CAC)
            </span>
            <span className="text-2xl font-bold text-black">{Currency(500)}</span>
          </div>
          <div className="flex flex-col items-start bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <span className="text-gray-500 text-sm">
              Customer Lifetime Value (CLTV)
            </span>
            <span className="text-2xl font-bold text-black">{Currency(5000)}</span>
          </div>
          <div className="flex flex-col items-start bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <span className="text-gray-500 text-sm">Average Order Value</span>
            <span className="text-2xl font-bold text-black">{Currency(1000)}</span>
          </div>
          <div className="flex flex-col items-start bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <span className="text-gray-500 text-sm">
              Monthly Recurring Revenue (MRR)
            </span>
            <span className="text-2xl font-bold text-black">{Currency(10000)}</span>
          </div>
        </div>

        {/* Announcements & Documents */}
        <div>
            <h3 className="font-semibold text-gray-700 mb-4">
            Investor Announcements & Documents
          </h3>
        <div className="bg-white rounded shadow p-4">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-gray-200 rounded">
                <ChartColumn className="h-5 w-5 text-black" />
              </span>
              <div>
                <span className="block font-medium text-sm text-black">Milestone Updates</span>
                <span className="block text-xs text-gray-500">
                  View recent investor updates
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-gray-200 rounded">
                <LucidePhoneForwarded className="h-5 w-5 text-black" />
              </span>
              <div>
                <span className="block font-medium text-sm text-black">Investor Reports</span>
                <span className="block text-xs text-gray-500">
                  Access downloadable investor reports (PDFs)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-gray-200 rounded">
                <Tv className="h-5 w-5 text-black" />
              </span>
              <div>
                <span className="block font-medium text-sm text-black">Pitch Decks</span>
                <span className="block text-xs text-gray-500">Pitch decks</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}
