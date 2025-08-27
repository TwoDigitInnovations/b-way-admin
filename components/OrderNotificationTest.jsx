import React, { useState, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Package, CheckCircle, MapPin, AlertTriangle } from 'lucide-react';

const OrderNotificationTest = () => {
  const { socket, isConnected, orders } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState('CLIENT'); // Default to CLIENT for testing

  useEffect(() => {
    if (!socket) return;

    // Listen for various order events
    const handleNewOrder = (data) => {
      console.log('🆕 New order notification received:', data);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'NEW_ORDER',
        title: 'New Order Created',
        message: data.message,
        timestamp: data.timestamp,
        order: data.order
      }, ...prev.slice(0, 9)]);
    };

    const handleOrderStatusUpdate = (data) => {
      console.log('📊 Order status update received:', data);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'STATUS_UPDATE',
        title: 'Order Status Updated',
        message: data.message,
        timestamp: data.timestamp,
        order: data.order
      }, ...prev.slice(0, 9)]);
    };

    const handleRouteAssigned = (data) => {
      console.log('🗺️ Route assignment received:', data);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'ROUTE_ASSIGNED',
        title: 'Route Assigned',
        message: data.message,
        timestamp: data.timestamp,
        order: data.order,
        route: data.route
      }, ...prev.slice(0, 9)]);
    };

    // Add event listeners
    socket.on('new_order', handleNewOrder);
    socket.on('order_status_update', handleOrderStatusUpdate);
    socket.on('route_assigned', handleRouteAssigned);

    return () => {
      socket.off('new_order', handleNewOrder);
      socket.off('order_status_update', handleOrderStatusUpdate);
      socket.off('route_assigned', handleRouteAssigned);
    };
  }, [socket]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'NEW_ORDER':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'STATUS_UPDATE':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ROUTE_ASSIGNED':
        return <MapPin className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'NEW_ORDER':
        return 'bg-blue-50 border-blue-200';
      case 'STATUS_UPDATE':
        return 'bg-green-50 border-green-200';
      case 'ROUTE_ASSIGNED':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-orange-50 border-orange-200';
    }
  };

  const testJoinRoom = (role) => {
    setUserRole(role);
    if (socket && isConnected) {
      socket.emit('join', {
        userId: `test-${role.toLowerCase()}-${Date.now()}`,
        role: role
      });
      console.log(`🔄 Rejoined as ${role}`);
    }
  };

  const createTestOrder = async () => {
    try {
      // Get auth token from cookies or localStorage
      const authToken = localStorage.getItem('userToken') || 
                       document.cookie.split('; ').find(row => row.startsWith('userToken='))?.split('=')[1];
      
      if (!authToken) {
        console.error('❌ No auth token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          items: [{
            itemId: '68904a7eae592a9b4bf42140', // Patient Monitor
            qty: 2,
            price: 1500
          }]
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Test order created successfully:', result);
        setNotifications(prev => [{
          id: Date.now(),
          type: 'TEST_ORDER_CREATED',
          title: 'Test Order Created',
          message: `Successfully created ${result.orders?.length || 1} test order(s)`,
          timestamp: new Date().toISOString(),
          order: result.orders?.[0] || result.data
        }, ...prev.slice(0, 9)]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to create test order:', response.status, errorData);
        setNotifications(prev => [{
          id: Date.now(),
          type: 'ERROR',
          title: 'Order Creation Failed',
          message: `Error ${response.status}: ${errorData.message || response.statusText}`,
          timestamp: new Date().toISOString()
        }, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('❌ Error creating test order:', error);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'ERROR',
        title: 'Network Error',
        message: `Failed to create test order: ${error.message}`,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 9)]);
    }
  };

  return (
    <div className="fixed top-4 left-4 w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-hidden">
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Order Notification Test</h3>
        
        {/* Connection Status */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Connection:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Role Testing */}
        <div className="mb-3">
          <span className="text-sm text-gray-600 block mb-2">Test as Role:</span>
          <div className="flex gap-2">
            {['ADMIN', 'CLIENT', 'HOSPITAL', 'CLINIC'].map(role => (
              <button
                key={role}
                onClick={() => testJoinRoom(role)}
                className={`px-3 py-1 rounded text-xs ${
                  userRole === role 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Test Actions */}
        <div className="mb-3">
          <button
            onClick={createTestOrder}
            disabled={!isConnected}
            className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-gray-300"
          >
            Create Test Order
          </button>
        </div>

        {/* Current Orders Count */}
        <div className="text-sm text-gray-600 mb-3">
          Orders in Context: {orders.length}
        </div>
      </div>

      {/* Notifications List */}
      <div className="border-t pt-3">
        <h4 className="font-medium text-sm mb-2">Recent Notifications:</h4>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {notifications.length === 0 ? (
            <div className="text-gray-500 text-sm italic">No notifications yet...</div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-2 rounded border ${getNotificationBg(notification.type)}`}
              >
                <div className="flex items-start gap-2">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-xs text-gray-600 truncate">
                      {notification.message}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderNotificationTest;
