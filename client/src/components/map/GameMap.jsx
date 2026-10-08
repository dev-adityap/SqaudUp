import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix for default Leaflet marker icons breaking in Vite build tools
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function GameMap({ games }) {
  // Default map center (Adjust coordinates to your region if needed, e.g., local city center)
  const defaultCenter = [22.5726, 88.3639]; 

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl relative z-10">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', background: '#0f0f13' }}
      >
        {/* Dark CartoDB tile layer matching your SquadUp theme */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {games.map((game) => {
          const coords = game.location?.coordinates;
          if (!coords || coords.length !== 2) return null;

          // MongoDB GeoJSON is [lng, lat], but Leaflet expects [lat, lng]
          const latLng = [coords[1], coords[0]];
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latLng[0]},${latLng[1]}`;

          return (
            <Marker key={game._id} position={latLng}>
              <Popup>
                <div className="p-2 text-black">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ff5500] bg-orange-100 px-2 py-0.5 rounded">
                    {game.sport}
                  </span>
                  <h4 className="font-bold text-base mt-1 mb-1">{game.title}</h4>
                  <p className="text-xs text-gray-600 mb-3">{game.venue?.name || 'Local Venue'}</p>
                  
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/games/${game._id}`} 
                      className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-neutral-800 transition"
                    >
                      View Squad
                    </Link>
                    <a 
                      href={googleMapsUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#ff5500] text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-[#e04c00] transition flex items-center gap-1"
                    >
                      Directions ↗
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}