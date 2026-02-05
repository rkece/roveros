import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Widget from '../components/Widget';
import L from 'leaflet';
import { useSocket } from '../hooks/useSocket';

// Fix Leaflet Default Icon Issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to center map on Rover
const MapRecenter = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
};

const MapView = () => {
    const { socket } = useSocket();
    // Default position (Los Angeles)
    const position = { lat: 34.0522, lng: -118.2437 };

    const [roverPos, setRoverPos] = React.useState(position);
    const [path, setPath] = React.useState<[number, number][]>([]);

    useEffect(() => {
        if (!socket) return;
        socket.on('rover:telemetry', (data: any) => {
            if (data.coordinates) {
                setRoverPos(data.coordinates);
                setPath(prev => {
                    // Only add if position changed significantly to avoid clutter
                    const last = prev[prev.length - 1];
                    if (!last || last[0] !== data.coordinates.lat || last[1] !== data.coordinates.lng) {
                        return [...prev, [data.coordinates.lat, data.coordinates.lng]];
                    }
                    return prev;
                });
            }
        });
        return () => {
            socket.off('rover:telemetry');
        };
    }, [socket]);

    return (
        <div className="h-full flex flex-col gap-6">
            <Widget title="Global Positioning System" className="flex-1 min-h-[600px] p-0 overflow-hidden relative border-neo-primary/30">
                <MapContainer center={[position.lat, position.lng]} zoom={15} scrollWheelZoom={true} className="h-full w-full z-0 bg-neo-bg">
                    {/* Dark Matter Map Tiles */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    <Marker position={[roverPos.lat, roverPos.lng]}>
                        <Popup>
                            <div className="text-neo-bg font-sans">
                                <b>Rover X1</b><br />
                                Status: ONLINE<br />
                                Battery: 84%
                            </div>
                        </Popup>
                    </Marker>

                    <Circle center={[roverPos.lat, roverPos.lng]} radius={50} pathOptions={{ color: '#00ccff', fillColor: '#00ccff', fillOpacity: 0.1 }} />
                    <Polyline positions={path} pathOptions={{ color: '#00ccff', weight: 2, dashArray: '5, 10' }} />

                    <MapRecenter lat={roverPos.lat} lng={roverPos.lng} />
                </MapContainer>

                {/* Overlay UI */}
                <div className="absolute bottom-6 left-6 z-[400] bg-neo-panel backdrop-blur-md p-4 rounded-lg border border-white/10 shadow-lg">
                    <h4 className="text-neo-primary font-orbitron text-sm mb-1">COORDINATES</h4>
                    <p className="font-mono text-white text-lg">{roverPos.lat.toFixed(6)} N</p>
                    <p className="font-mono text-white text-lg">{roverPos.lng.toFixed(6)} W</p>
                </div>
            </Widget>
        </div>
    );
};

export default MapView;
