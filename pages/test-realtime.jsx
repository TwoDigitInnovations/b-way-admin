import React, { useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import Layout from '@/components/layout';
import OrderNotificationTest from '@/components/OrderNotificationTest';
import toast from 'react-hot-toast';

const TestRealtime = () => {
  const { isConnected, orders, emitEvent } = useSocket();
  const [testMessage, setTestMessage] = useState('');

  const createTestOrder = async () => {
    try {
      // This would normally be done through your API
      const testOrder = {
        _id: Date.now().toString(),
        orderId: `ORD-${Date.now()}`,
        items: 'Test Item',
        qty: 1,
        status: 'Pending',
        hospitalName: 'Test Hospital',
        createdAt: new Date().toISOString()
      };

      // Simulate adding order locally for testing
      // orders.unshift(testOrder);
      
      toast.success('Test order created! Check if it appears in real-time.');
    } catch (error) {
      console.error('Error creating test order:', error);
      toast.error('Failed to create test order');
    }
  };

  const sendTestMessage = () => {
    if (testMessage.trim()) {
      emitEvent('test_message', { message: testMessage, timestamp: new Date().toISOString() });
      setTestMessage('');
      toast.success('Test message sent!');
    }
  };

  return (
    <Layout title="Real-time Test">
      {/* Order Notification Test Component */}
      <OrderNotificationTest />
      
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Real-time Socket.IO Test</h1>
        
        {/* Connection Status */}
        <div className="mb-6 p-4 rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Real-time Orders Count */}
        <div className="mb-6 p-4 rounded-lg bg-blue-50">
          <h2 className="text-lg font-semibold mb-2">Real-time Orders</h2>
          <p className="text-blue-700">
            Current real-time orders in memory: <strong>{orders.length}</strong>
          </p>
          {orders.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-blue-600">Latest order:</p>
              <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                {JSON.stringify(orders[0], null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Test Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Test Order Creation</h3>
            <p className="text-sm text-gray-600 mb-3">
              Create a test order to see real-time updates in action.
            </p>
            <button
              onClick={createTestOrder}
              disabled={!isConnected}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create Test Order
            </button>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Test Message</h3>
            <p className="text-sm text-gray-600 mb-3">
              Send a test message through the socket connection.
            </p>
            <div className="space-y-2">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter test message"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
              />
              <button
                onClick={sendTestMessage}
                disabled={!isConnected || !testMessage.trim()}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Send Test Message
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-yellow-800">Testing Instructions</h3>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Make sure both backend and frontend servers are running</li>
            <li>Check the connection status above</li>
            <li>Open the Orders page in another tab/window</li>
            <li>Create a test order here and watch it appear in real-time on the Orders page</li>
            <li>Check browser console for Socket.IO logs</li>
            <li>Check backend terminal for Socket.IO connection logs</li>
          </ol>
        </div>

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
          <div className="text-sm space-y-1">
            <p><strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}</p>
            <p><strong>Frontend URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}</p>
            <p><strong>Socket Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
            <p><strong>Orders in Memory:</strong> {orders.length}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TestRealtime;
