import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Clock, Route, Maximize2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

const RouteMapViewer = ({ 
  routeData, 
  height = "400px", 
  showControls = true,
  onFullscreen = null
}) => {
  const [loading, setLoading] = useState(true);
  const [mapBounds, setMapBounds] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [markers, setMarkers] = useState([]);

  const startLocation = routeData?.startLocation;
  const endLocation = routeData?.endLocation;
  const stops = routeData?.stops || [];
  const geometry = routeData?.geometry || [];

  useEffect(() => {
    if (!routeData) return;

    try {
      let bounds = [];
      let newMarkers = [];

      if (startLocation?.coordinates) {
        const [lng, lat] = startLocation.coordinates;
        newMarkers.push({
          position: [lat, lng],
          type: 'start',
          title: 'Start Location',
          address: startLocation.address,
          city: startLocation.city,
          state: startLocation.state,
          color: '#10B981'
        });
        bounds.push([lat, lng]);
      }

      stops.forEach((stop, index) => {
        if (stop.coordinates) {
          const [lng, lat] = stop.coordinates;
          newMarkers.push({
            position: [lat, lng],
            type: 'stop',
            title: `Stop ${index + 1}`,
            address: stop.name || stop.address,
            color: '#F59E0B'
          });
          bounds.push([lat, lng]);
        }
      });

      if (endLocation?.coordinates) {
        const [lng, lat] = endLocation.coordinates;
        newMarkers.push({
          position: [lat, lng],
          type: 'end',
          title: 'End Location',
          address: endLocation.address,
          city: endLocation.city,
          state: endLocation.state,
          color: '#EF4444'
        });
        bounds.push([lat, lng]);
      }

      let routeCoords = [];
      if (geometry && geometry.length > 0) {
        routeCoords = geometry.map(coord => [coord[1], coord[0]]);
        bounds.push(...routeCoords);
      }

      setMarkers(newMarkers);
      setRouteCoordinates(routeCoords);
      
      if (bounds.length > 0) {
        setMapBounds(bounds);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error processing route data:', error);
      setLoading(false);
    }
  }, [routeData]);

  const CustomMarker = ({ marker }) => {
    if (typeof window === 'undefined') return null;

    const L = require('leaflet');
    
    const icon = L.divIcon({
      html: `
        <div style="
          background-color: ${marker.color}; 
          border-radius: 50%; 
          width: 32px; 
          height: 32px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: white; 
          font-size: 14px; 
          border: 3px solid white; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          font-weight: bold;
        ">
          ${marker.type === 'start' ? 'S' : marker.type === 'end' ? 'E' : (markers.filter(m => m.type === 'stop').indexOf(marker) + 1)}
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

    return (
      <Marker position={marker.position} icon={icon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-semibold mb-1" style={{ color: marker.color }}>
              {marker.title}
            </h3>
            <p className="text-sm text-gray-700">{marker.address || 'No address'}</p>
            {marker.city && (
              <p className="text-xs text-gray-500 mt-1">
                {marker.city}, {marker.state}
              </p>
            )}
          </div>
        </Popup>
      </Marker>
    );
  };

  const RouteInfo = () => (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{routeData?.routeName}</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            routeData?.status === 'Active' ? 'bg-green-100 text-green-800' :
            routeData?.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {routeData?.status}
          </span>
          {onFullscreen && (
            <button
              onClick={onFullscreen}
              className="p-1 hover:bg-gray-100 rounded"
              title="View fullscreen"
            >
              <Maximize2 size={16} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <Navigation className="text-green-600" size={16} />
          <div>
            <p className="font-medium text-black">Start</p>
            <p className="text-gray-600 truncate">{startLocation?.address || 'N/A'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Route className="text-blue-600" size={16} />
          <div>
            <p className="font-medium text-black">Stops</p>
            <p className="text-gray-600">{stops.length} stop(s)</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="text-orange-600" size={16} />
          <div>
            <p className="font-medium text-black">ETA</p>
            <p className="text-gray-600">{routeData?.eta || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Fallback text
  const StaticMapFallback = () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
      <div className="text-center p-4">
        <MapPin className="mx-auto mb-2 text-gray-400" size={48} />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Route Overview</h3>
        <div className="text-sm text-gray-500 space-y-1 max-w-xs">
          <p><strong className='text-black'>Start:</strong> {startLocation?.address || 'N/A'}</p>
          <p><strong className='text-black'>End:</strong> {endLocation?.address || 'N/A'}</p>
          <p><strong className='text-black'>Stops:</strong> {stops.length}</p>
          {routeData?.eta && <p><strong className='text-black'>ETA:</strong> {routeData.eta}</p>}
        </div>
        <p className="text-xs text-gray-400 mt-3">Map visualization unavailable</p>
      </div>
    </div>
  );

  if (!routeData) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No route data available</p>
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-auto bg-white shadow-sm">
      {showControls && <RouteInfo />}
      
      <div className="relative" style={{ height }}>
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading map...</span>
            </div>
          </div>
        )}
        
        {!loading && typeof window !== 'undefined' && mapBounds ? (
          <MapContainer
            style={{ height: '100%', width: '100%' }}
            bounds={mapBounds}
            boundsOptions={{ padding: [20, 20] }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Render markers */}
            {markers.map((marker, index) => (
              <CustomMarker key={index} marker={marker} />
            ))}
            
            {/* Render route line */}
            {routeCoordinates.length > 0 && (
              <Polyline
                positions={routeCoordinates}
                color="#3B82F6"
                weight={4}
                opacity={0.8}
                smoothFactor={1}
              />
            )}
          </MapContainer>
        ) : (
          !loading && <StaticMapFallback />
        )}
      </div>
    </div>
  );
};

export default RouteMapViewer;
