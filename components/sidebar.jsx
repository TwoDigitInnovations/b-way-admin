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
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboardv' },
    { icon: '/images/s1.png', label: 'Orders', href: '/ordersv' },
    { icon: '/images/s2.png', label: 'Routes & Schedules', href: '/allroutes' },
    { icon: '/images/s3.png', label: 'Hospitals & Facilities', href: '/allhospitals' },
    { icon: '/images/s4.png', label: 'Drivers & Vehicles', href: '/alldrivers' },
    { icon: '/images/s8.png', label: 'Dispatchers', href: '/alldispatchers' },
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
  const isActive = item.href && router.pathname === item.href;
  return (
    <li key={index}>
      {item.href ? (
        <Link href={item.href} legacyBehavior>
          <a
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[#FF54221A] text-[#FF4B00] border-r-2 border-[#FF4B00]'
                : 'text-[#003C72] hover:bg-gray-50'
            }`}
          >
            {typeof Icon === 'string' ? (
              <img src={Icon} alt={item.label} className="w-5 h-5 object-contain" style={isActive ? { filter: 'brightness(0) saturate(100%) invert(41%) sepia(99%) saturate(7492%) hue-rotate(2deg) brightness(101%) contrast(104%)' } : {}} />
            ) : (
              <Icon className="w-5 h-5" style={isActive ? { color: '#FF4B00' } : {}} />
            )}
            <span>{item.label}</span>
          </a>
        </Link>
      ) : (
        <a
          href="#"
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-[#003C72] hover:bg-gray-50`}
        >
          {typeof Icon === 'string' ? (
            <img src={Icon} alt={item.label} className="w-5 h-5 object-contain" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
          <span>{item.label}</span>
        </a>
      )}
    </li>
  );
})}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;