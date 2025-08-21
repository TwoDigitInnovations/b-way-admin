import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const QuickLogin = () => {
  const [credentials, setCredentials] = useState({
    email: 'admin@yopmail.com',
    password: '123456'
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.status && result.data) {
        // Store user data and token
        localStorage.setItem('userDetail', JSON.stringify(result.data.user));
        localStorage.setItem('userToken', result.data.token);
        localStorage.setItem('token', result.data.token);
        
        // Store in cookies too
        Cookies.set('userData', JSON.stringify(result.data.user));
        Cookies.set('userToken', result.data.token);
        Cookies.set('token', result.data.token);

        console.log('✅ Login successful:', result.data.user);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        console.error('❌ Login failed:', result.message);
        alert(`Login failed: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      alert(`Login error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const presetUsers = [
    { label: 'Admin', email: 'admin@yopmail.com', password: '123456' },
    { label: 'Hospital (Oslo)', email: 'oslo@yopmail.com', password: '123456' },
    { label: 'Client', email: 'client@yopmail.com', password: '123456' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Quick Login for Testing
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Real-time order notifications test
          </p>
        </div>
        
        {/* Preset Users */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Select User:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {presetUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => setCredentials({ email: user.email, password: user.password })}
                className="w-full text-left px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
              >
                {user.label} ({user.email})
              </button>
            ))}
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            After login, go to{' '}
            <a href="/dashboard" className="font-medium text-indigo-600 hover:text-indigo-500">
              Dashboard
            </a>{' '}
            or{' '}
            <a href="/test-realtime" className="font-medium text-indigo-600 hover:text-indigo-500">
              Test Realtime
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickLogin;
