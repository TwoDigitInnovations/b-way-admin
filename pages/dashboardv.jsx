import React from 'react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
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
  FileBarChart
} from 'lucide-react';
import Sidebar from '../components/sidebar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('operational');

  const statsCards = [
    {
      title: 'Active Routes',
      value: '18',
      change: '13% active',
      changeText: 'Broaches',
      icon: '/images/img5.png',
      trend: 'up'
    },
    {
      title: 'Orders in Transit',
      value: '46',
      change: '7% Up from past week',
      icon: '/images/img6.png',
      color: 'yellow',
      trend: 'up'
    },
    {
      title: 'Sales this Week',
      value: '92000',
      change: '7% Up from past week',
      icon: '/images/img7.png',
      color: 'green',
      trend: 'up'
    },
    {
      title: 'Facilities',
      value: '204',
      change: 'Active Broaches',
      icon: '/images/img3.png',
      color: 'red',
      trend: 'up'
    },
    {
      title: 'Compliance Alerts',
      value: '204',
      change: '5 Flagged alerts',
      icon: '/images/img4.png',
      color: 'blue',
      trend: 'up'
    },
     {
      title: 'Available Drivers',
     
      icon: '/images/driver.png',
     
    },
     {
      title: 'Available Partners',
      
    
      icon: '/images/user.png',
      
    }
  ];

  const actionButtons = [
    {
      title: 'Add Emergency\nDelivery',
      icon: '/images/b1.png',
      color: 'bg-[#003C72] hover:bg-[#003C72]'
    },
    {
      title: 'Real-Time Route\nTracking',
      icon: '/images/b2.png',
      color: 'bg-[#003C72] hover:bg-[#003C72]'
    },
    {
      title: 'Generate Compliance\nReport',
      icon: '/images/b3.png',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Update\nInventory',
      icon: '/images/b4.png',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'View Payments/\nStripe Logs',
      icon: '/images/b5.png',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Support & Excelation\nTickets',
      icon: '/images/b6.png',
      color: 'bg-blue-600 hover:bg-blue-700'
    }
  ];

  // Chart data
  const totalMoneyData = [
    { name: 'MON', value: 12000 },
    { name: 'TUE', value: 8000 },
    { name: 'WED', value: 15000 },
    { name: 'THU', value: 10000 },
    { name: 'FRI', value: 23000 },
    { name: 'SAT', value: 7000 },
    { name: 'SUN', value: 14000 }
  ];

  const deliveriesData = [
    { name: '2019', delivered: 18000, pending: 12000 },
    { name: '2020', delivered: 25000, pending: 15000 },
    { name: '2021', delivered: 35000, pending: 18000 },
    { name: '2022', delivered: 28000, pending: 8000 }
  ];

  const orders = [
    {
      no: 1,
      facilityName: 'NYU Langone',
      orderId: 'ORD-20943',
      items: 'IV Admixture - Carthe',
      qty: 12,
      status: 'Hold',
      statusColor: 'bg-red-100 text-red-800',
      assignedDriver: 'David M.',
      route: 'Carla G.',
      eta: '2:10 PM'
    },
    {
      no: 2,
      facilityName: 'Columbia Peds',
      orderId: 'ORD-20943',
      items: 'IV Admixture',
      qty: 20,
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800',
      assignedDriver: 'Carla G.',
      route: 'David M.',
      eta: '8:52 PM'
    },
    {
      no: 3,
      facilityName: 'Oxford Hospital',
      orderId: 'ORD-20943',
      items: 'IV Admixture',
      qty: 15,
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800',
      assignedDriver: 'David J.',
      route: 'Carlin D.',
      eta: '8:52 AM'
    },
    {
      no: 4,
      facilityName: 'Jammu Hospital',
      orderId: 'ORD-20943',
      items: 'IV Admixture - NOU',
      qty: 10,
      status: 'Hold',
      statusColor: 'bg-red-100 text-red-800',
      assignedDriver: 'Carlin D.',
      route: 'David M.',
      eta: '8:52 PM'
    },
    {
      no: 5,
      facilityName: 'Bellevue Hospital',
      orderId: 'ORD-20943',
      items: 'IV Admixture - Carthe',
      qty: 12,
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-800',
      assignedDriver: 'David M.',
      route: 'Carla G.',
      eta: '8:52 AM'
    },
    {
      no: 6,
      facilityName: 'Retanice Logist',
      orderId: 'ORD-20943',
      items: 'IV Osortorua',
      qty: 50,
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800',
      assignedDriver: 'Carla G.',
      route: 'David J.',
      eta: '8:52 AM'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out`}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
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
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-48 lg:w-64"
                />
              </div>

              {/* Mobile search icon */}
              <button className="sm:hidden p-2 text-gray-400 hover:text-gray-600">
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 hidden md:block">System Admin</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
<div className="bg-white  shadow-sm border border-gray-200 p-2 mb-4 lg:mb-6 mt-6">
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
        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-lg lg:text-xl font-medium text-gray-900 mb-4 lg:mb-6">Welcome to B-Way Logistics</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-6 lg:mb-8">
              {statsCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div key={index} className="bg-white rounded-lg p-3 lg:p-4 border border-gray-200 min-h-[110px]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xs lg:text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
                        <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{card.value}</p>
                        <div className="flex items-center text-xs">
                          <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                          <span className="text-green-600 font-medium">{card.change}</span>
                          {card.changeText && <span className="text-gray-500 ml-1">{card.changeText}</span>}
                        </div>
                      </div>
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center ${
                        typeof card.icon === 'string' ? '' : (
                        card.color === 'blue' ? 'bg-blue-100' :
                        card.color === 'yellow' ? 'bg-yellow-100' :
                        card.color === 'green' ? 'bg-green-100' :
                        card.color === 'red' ? 'bg-red-100' : 'bg-gray-100')
                      }`}>
                        {typeof Icon === 'string' ? (
                          <img src={Icon} alt={card.title} className="w-8 h-8 lg:w-10 lg:h-10 object-contain" />
                        ) : (
                          <Icon className={`w-6 h-6 ${
                            card.color === 'blue' ? 'text-blue-600' :
                            card.color === 'yellow' ? 'text-yellow-600' :
                            card.color === 'green' ? 'text-green-600' :
                            card.color === 'red' ? 'text-red-600' : 'text-gray-600'
                          }`} />
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
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900">Activity</h3>
                    <p className="text-lg lg:text-xl font-bold text-gray-900">Total Money Paid</p>
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
                        tickFormatter={(value) => `${value/1000}k`}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#003C72"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Deliveries Overview Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900">Analytics Data</h3>
                    <p className="text-lg lg:text-xl font-bold text-gray-900">Deliveries Overview</p>
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
                        tickFormatter={(value) => `${value/1000}k`}
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
                        {typeof Icon === 'string' ? (
                          <img src={Icon} alt={button.title} className="w-5 h-5 object-contain" />
                        ) : (
                          <Icon className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span className="font-medium text-xs lg:text-sm leading-tight whitespace-pre-line">{button.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900">Recent Orders</h3>
                    <button className="text-[#003C72] hover:text-[#003C72] font-medium text-sm lg:text-base">
                      View All
                    </button>
                  </div>
                  
                  <div className="overflow-hidden">
                    <table className="w-full table-fixed">
                      <thead className="bg-[#003C72] text-white">
                        <tr>
                          <th className="w-12 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">No.</th>
                          <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Facility Name</th>
                          <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                          <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Item(s)</th>
                          <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Qty</th>
                          <th className="w-20 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                          <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Driver</th>
                          <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Route</th>
                          <th className="w-20 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">ETA</th>
                          <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.no}</td>
                            <td className="px-2 py-2 text-sm text-orange-600 font-medium truncate" title={order.facilityName}>{order.facilityName}</td>
                            <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.orderId}</td>
                            <td className="px-2 py-2 text-sm text-gray-900 truncate" title={order.items}>{order.items}</td>
                            <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.qty}</td>
                            <td className="px-2 py-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.statusColor} truncate`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-sm text-gray-900 hidden lg:table-cell truncate">{order.assignedDriver}</td>
                            <td className="px-2 py-2 text-sm text-gray-900 hidden lg:table-cell truncate">{order.route}</td>
                            <td className="px-2 py-2 text-sm text-gray-900 hidden md:table-cell truncate">{order.eta}</td>
                            <td className="px-2 py-2">
                              <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
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
      </div>
    </div>
  );
}

export default App;