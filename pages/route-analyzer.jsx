import React, { useState } from 'react';
import Layout from '@/components/layout';
import { service } from '@/helper/service';

const RouteAnalyzer = () => {
  const [address, setAddress] = useState('');
  const [maxDistance, setMaxDistance] = useState(30);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeAddress = async () => {
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await service.get(`/order/route-suggestions?address=${encodeURIComponent(address)}&maxDistance=${maxDistance}`);
      
      if (response.status) {
        setSuggestions(response.suggestions || []);
      } else {
        setError(response.message || 'Failed to get route suggestions');
      }
    } catch (err) {
      setError('Error analyzing address: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeAddress();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              🎯 Route Assignment Analyzer
            </h1>
            
            <p className="text-gray-600 mb-6">
              Analyze any address to see which routes are nearby and could potentially handle pickups or deliveries from that location.
            </p>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address to Analyze
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., San Francisco, CA or 123 Main St, New York, NY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Distance (km)
                  </label>
                  <input
                    type="number"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseInt(e.target.value) || 30)}
                    min="1"
                    max="200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🔍 Analyzing...' : '🎯 Analyze Address'}
              </button>
            </form>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">❌ {error}</p>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  📍 Route Suggestions for "{address}" (within {maxDistance}km)
                </h2>
                
                <div className="grid gap-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={suggestion.routeId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {index + 1}. {suggestion.routeName}
                        </h3>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {suggestion.distance}km away
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">
                            <strong>Match Point:</strong> {suggestion.matchLocation}
                          </p>
                          <p className="text-gray-600">
                            <strong>Match Type:</strong> 
                            <span className={`ml-1 font-medium ${
                              suggestion.matchType === 'start' ? 'text-green-600' :
                              suggestion.matchType === 'end' ? 'text-blue-600' : 'text-orange-600'
                            }`}>
                              {suggestion.matchType === 'start' ? '🏁 Route Start' :
                               suggestion.matchType === 'end' ? '🏁 Route End' : '🛑 Route Stop'}
                            </span>
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600">
                            <strong>Route:</strong> {suggestion.startLocation?.city}, {suggestion.startLocation?.state} 
                            → {suggestion.endLocation?.city}, {suggestion.endLocation?.state}
                          </p>
                          <p className="text-gray-600">
                            <strong>Stops:</strong> {suggestion.stopsCount} intermediate stops
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suggestions.length === 0 && !loading && !error && address && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">
                  ⚠️ No routes found within {maxDistance}km of "{address}". 
                  Try increasing the distance or check if routes are properly configured with coordinates.
                </p>
              </div>
            )}

            <div className="mt-8 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold text-gray-900 mb-2">💡 How it works:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• The system calculates distance from your address to route start points, end points, and stops</li>
                <li>• Routes within the specified distance are considered potential matches</li>
                <li>• When creating orders, the system automatically finds the best route based on both pickup and delivery locations</li>
                <li>• Orders are auto-assigned when the combined distance score meets the threshold (≥30/100)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RouteAnalyzer;
