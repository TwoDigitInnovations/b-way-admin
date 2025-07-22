import React from 'react';
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen, title }) => (
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
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
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
);

export default Header; 