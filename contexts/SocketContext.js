import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [orders, setOrders] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    
    let userData = null;
    
    const userCookie = Cookies.get('userData');
    if (userCookie) {
      try {
        userData = JSON.parse(userCookie);
      } catch (error) {
        console.error('Error parsing user data from cookies:', error);
      }
    }
    
    if (!userData) {
      const userLocalStorage = localStorage.getItem('userDetail');
      if (userLocalStorage) {
        try {
          userData = JSON.parse(userLocalStorage);
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
    }
    
    if (!userData) {
      const userToken = Cookies.get('userToken') || localStorage.getItem('userToken');
      if (userToken) {
        userData = { userId: 'anonymous', role: 'USER' };
      }
    }
    
    if (!userData) {
      console.warn('No user data found for Socket.IO connection');
      console.log('Checking cookies:', document.cookie);
      console.log('Checking localStorage:', {
        userDetail: localStorage.getItem('userDetail'),
        userToken: localStorage.getItem('userToken')
      });
      return;
    }

    console.log('Initializing Socket.IO with user data:', userData);
    console.log('Connecting to:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
    setInitialized(true);

    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('📡 Connected to Socket.IO server');
      setIsConnected(true);
      
      const joinData = {
        userId: userData._id,
        role: userData.role
      };
      
      console.log('Sending join request with data:', joinData);
      socketInstance.emit('join', joinData);
      
      console.log('Joined rooms with:', {
        userId: userData._id,
        role: userData.role
      });
      
      if (userData.role === 'ADMIN') {
        console.log(' Admin user - should be in admin_room');
      } else if (userData.role === 'CLIENT') {
        console.log(' Client user - should be in client_room');
      } else if (userData.role === 'USER' || userData.role === 'HOSPITAL') {
        console.log('Hospital user - should be in hospital_room');
      }
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server. Reason:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      setIsConnected(false);
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('Socket.IO reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
    });

    socketInstance.on('reconnect_error', (error) => {
      console.error('Socket.IO reconnection error:', error);
    });

    socketInstance.on('new_order', (data) => {
      console.log('New order received:', data);
      
      setOrders(prevOrders => {
        console.log('Adding new order to state. Previous count:', prevOrders.length);
        const newOrders = [data.order, ...prevOrders];
        console.log('New orders count:', newOrders.length);
        return newOrders;
      });
      
      toast.success(`New order ${data.order.orderId} created`, {
        duration: 4000,
        position: 'top-right',
      });
    });

    socketInstance.on('order_status_update', (data) => {
      console.log('Order status update received:', data);
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data.order._id 
            ? { ...order, status: data.order.status }
            : order
        )
      );
      
      toast.info(`Order ${data.order.orderId} status: ${data.order.status}`, {
        duration: 4000,
        position: 'top-right',
      });
    });

    socketInstance.on('route_assigned', (data) => {
      console.log('Route assignment received:', data);

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data.order._id 
            ? { ...order, route: data.route }
            : order
        )
      );
      
      toast.success(`Route ${data.route.routeName} assigned to order ${data.order.orderId}`, {
        duration: 4000,
        position: 'top-right',
      });
    });

    return () => {
      console.log('🧹 Cleaning up Socket.IO connection');
      if (socketInstance) {
        socketInstance.off('connect');
        socketInstance.off('disconnect');
        socketInstance.off('connect_error');
        socketInstance.off('reconnect');
        socketInstance.off('reconnect_error');
        socketInstance.off('new_order');
        socketInstance.off('order_status_update');
        socketInstance.off('route_assigned');
        socketInstance.disconnect();
      }
    };
  }, []); 

  const emitEvent = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  const addOrder = (order) => {
    setOrders(prevOrders => [order, ...prevOrders]);
  };

  const updateOrder = (orderId, updates) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order._id === orderId 
          ? { ...order, ...updates }
          : order
      )
    );
  };

  const removeOrder = (orderId) => {
    setOrders(prevOrders => 
      prevOrders.filter(order => order._id !== orderId)
    );
  };

  const value = {
    socket,
    isConnected,
    orders,
    setOrders,
    addOrder,
    updateOrder,
    removeOrder,
    emitEvent
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
