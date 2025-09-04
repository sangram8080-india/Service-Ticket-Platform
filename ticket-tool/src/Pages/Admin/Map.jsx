import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const TestMap = () => (
  <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '400px' }}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[20.5937, 78.9629]} />
  </MapContainer>
);

export default TestMap;