import React, { useState, useEffect } from 'react';
import { X, Package, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';

const NotificationToast = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'NEW_ORDER':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'ORDER_STATUS_UPDATE':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'ROUTE_ASSIGNED':
        return <MapPin className="w-5 h-5 text-purple-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'NEW_ORDER':
        return 'bg-blue-50 border-blue-200';
      case 'ORDER_STATUS_UPDATE':
        return 'bg-green-50 border-green-200';
      case 'ROUTE_ASSIGNED':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-orange-50 border-orange-200';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {notification.title || 'Order Update'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {notification.message}
            </p>
            {notification.order && (
              <p className="mt-1 text-xs text-gray-400">
                Order ID: {notification.order.orderId}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-2">
        <p className="text-xs text-gray-500">
          {new Date(notification.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

const RealtimeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'NEW_ORDER',
        title: 'New Order Created',
        message: data.message,
        order: data.order,
        timestamp: data.timestamp,
      };
      setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 notifications
    };

    const handleOrderStatusUpdate = (data) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'ORDER_STATUS_UPDATE',
        title: 'Order Status Updated',
        message: data.message,
        order: data.order,
        timestamp: data.timestamp,
      };
      setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    };

    const handleRouteAssigned = (data) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'ROUTE_ASSIGNED',
        title: 'Route Assigned',
        message: data.message,
        order: data.order,
        timestamp: data.timestamp,
      };
      setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    };

    socket.on('new_order', handleNewOrder);
    socket.on('order_status_update', handleOrderStatusUpdate);
    socket.on('route_assigned', handleRouteAssigned);

    return () => {
      socket.off('new_order', handleNewOrder);
      socket.off('order_status_update', handleOrderStatusUpdate);
      socket.off('route_assigned', handleRouteAssigned);
    };
  }, [socket]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default RealtimeNotifications;
