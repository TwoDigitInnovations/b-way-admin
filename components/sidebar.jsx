import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Route, 
  Building2, 
  Truck, 
  FileText, 
  BarChart3, 
  MapPin, 
  Settings 
} from 'lucide-react';
import Image from 'next/image';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: '/images/s1.png', label: 'Orders' },
    { icon: '/images/s2.png', label: 'Routes & Schedules' },
    { icon: '/images/s3.png', label: 'Hospitals & Facilities' },
    { icon: '/images/s4.png', label: 'Drivers & Vehicles' },
    { icon: '/images/s8.png', label: 'Billing & Invoices' },
    { icon: '/images/s5.png', label: 'Compliance Reports' },
    { icon: '/images/s6.png', label: 'Fate Tracking/ Cutsdody factory' },
    { icon: '/images/s7.png', label: 'Settings' }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
         <Image src='/images/Logo.png' height={150} width={150} />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
        {menuItems.map((item, index) => {
  const Icon = item.icon;
  return (
    <li key={index}>
      <a
        href="#"
        className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          item.active
            ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-500'
            : 'text-[#003C72] hover:bg-gray-50'
        }`}
      >
        {typeof Icon === 'string' ? (
          <img src={Icon} alt={item.label} className="w-5 h-5 object-contain" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
        <span>{item.label}</span>
      </a>
    </li>
  );
})}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;