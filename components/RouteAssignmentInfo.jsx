import React from 'react';

const RouteAssignmentInfo = ({ order }) => {
  if (!order.routeAssignment) {
    return null;
  }

  const { routeAssignment } = order;

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">
        🎯 Route Assignment Details
      </h4>
      
      {routeAssignment.assigned ? (
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✅ Auto-Assigned
            </span>
            <span className="ml-2 text-sm text-gray-600">
              to <strong>{routeAssignment.routeName}</strong>
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Match Score:</span>
              <div className="font-semibold text-blue-600">
                {routeAssignment.matchScore?.toFixed(1)}/100
              </div>
            </div>
            
            {routeAssignment.efficiency && (
              <div>
                <span className="text-gray-500">Efficiency:</span>
                <div className="font-semibold text-green-600">
                  {routeAssignment.efficiency?.toFixed(1)}%
                </div>
              </div>
            )}
            
            {routeAssignment.pickupDistance && (
              <div>
                <span className="text-gray-500">Pickup Distance:</span>
                <div className="font-semibold text-orange-600">
                  {routeAssignment.pickupDistance?.toFixed(1)}km
                </div>
              </div>
            )}
            
            {routeAssignment.deliveryDistance && (
              <div>
                <span className="text-gray-500">Delivery Distance:</span>
                <div className="font-semibold text-purple-600">
                  {routeAssignment.deliveryDistance?.toFixed(1)}km
                </div>
              </div>
            )}
          </div>
          
          <p className="text-xs text-gray-600 italic">
            {routeAssignment.message}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ⚠️ Unassigned
            </span>
            <span className="ml-2 text-sm text-gray-600">
              Manual assignment required
            </span>
          </div>
          
          <div className="text-xs">
            <span className="text-gray-500">Reason:</span>
            <span className="ml-1 text-red-600 font-medium">
              {routeAssignment.reason}
            </span>
          </div>
          
          {routeAssignment.matchScore > 0 && (
            <div className="text-xs">
              <span className="text-gray-500">Best Match Score:</span>
              <span className="ml-1 text-orange-600 font-medium">
                {routeAssignment.matchScore?.toFixed(1)}/100 (below threshold)
              </span>
            </div>
          )}
          
          <p className="text-xs text-gray-600 italic">
            {routeAssignment.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default RouteAssignmentInfo;
