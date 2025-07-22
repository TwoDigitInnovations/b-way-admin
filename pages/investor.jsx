import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { FileText, Download, Presentation, Menu, X } from 'lucide-react';
import Sidebar from '../components/sidebar';

const BWayLogisticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('investor');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample data for delivery volume chart
  const deliveryData = [
    { name: 'North', value: 40000 },
    { name: 'South', value: 35000 },
    { name: 'East', value: 38000 },
    { name: 'West', value: 37000 }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out`}>
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile hamburger menu */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-2xl font-semibold text-[#003C72]">Investor Dashboard</h1>
            </div>
            {/* (Optional: Add right-side controls here if needed, e.g., profile, notifications) */}
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto">
            {/* Welcome Heading */}
            <div className="p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-bold text-[#003C72] mb-4 lg:mb-6">Welcome to B-Way Logistics</h2>
            </div>
            {/* Tab Navigation */}
            <div className="bg-white shadow-sm border border-gray-200 p-2 my-4 lg:my-6 mx-4 lg:mx-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('operational')}
                  className={`text-lg lg:text-xl font-medium pb-2 border-b-2 transition-colors ${
                    activeTab === 'operational'
                      ? 'text-[#003C72] border-[#003C72]'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  Operational
                </button>
                <button
                  onClick={() => setActiveTab('investor')}
                  className={`text-lg lg:text-xl font-medium pb-2 border-b-2 transition-colors ${
                    activeTab === 'investor'
                      ? 'text-[#003C72] border-[#003C72]'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  Investor
                </button>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-4 lg:p-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#003C72] mb-6">
                Investor & Growth Analytics Dashboard
              </h2>

              {/* Key Performance Indicators */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Key Performance Indicators
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-white p-4 rounded-lg border shadow-xl border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Total Revenue (This Quarter)</p>
                    <p className="text-2xl font-bold text-gray-800">₹1.5M</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border shadow-xl border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Year-over-Year Growth</p>
                    <p className="text-2xl font-bold text-gray-800">20%</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border shadow-xl border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Customer Retention Rate</p>
                    <p className="text-2xl font-bold text-gray-800">85%</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border shadow-xl border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Net New Customers</p>
                    <p className="text-2xl font-bold text-gray-800">500</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border shadow-xl border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Active Market Regions</p>
                    <p className="text-2xl font-bold text-gray-800">5</p>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Delivery Volume Overview */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Delivery Volume Overview
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">Delivery Volume by Region</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-800">150000</span>
                      <span className="text-sm text-gray-500">2022-2024 +15%</span>
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="50%" height="100%">
                      <BarChart data={deliveryData}>
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#003C72' }}
                        />
                        <YAxis hide />
                        <Bar 
                          dataKey="value" 
                          fill="#003C72" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Customer Retention Breakdown */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Customer Retention Breakdown
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">Customer Loyalty Over Time</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-800">85%</span>
                      <span className="text-sm text-green-600">Current Quarter +5%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Retained</span>
                      </div>
                      <div className="w-full bg-gray-200  h-10">
                        <div className="bg-[#003C72] h-10 " style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Churned</span>
                      </div>
                      <div className="w-full bg-gray-200  h-10">
                        <div className="bg-[#003C72] h-10 " style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Insights Panel */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Growth Insights Panel
                </h3>
                <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border shadow-xl border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Customer Acquisition Cost (CAC)</p>
                    <p className="text-2xl font-bold text-gray-800">₹50</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border shadow-xl border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Customer Lifetime Value (CLTV)</p>
                    <p className="text-2xl font-bold text-gray-800">₹500</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border shadow-xl border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Average Order Value</p>
                    <p className="text-2xl font-bold text-gray-800">₹100</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border shadow-xl border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Monthly Recurring Revenue (MRR)</p>
                    <p className="text-2xl font-bold text-gray-800">₹10K</p>
                  </div>
                </div>
              </div>

              {/* Investor Announcements & Documents */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Investor Announcements & Documents
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Milestone Updates</h4>
                      <p className="text-sm text-gray-600">View recent milestone updates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Investor Reports</h4>
                      <p className="text-sm text-gray-600">Access downloadable investor reports (PDFs)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Presentation className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Pitch Decks</h4>
                      <p className="text-sm text-gray-600">Pitch Decks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default BWayLogisticsDashboard;