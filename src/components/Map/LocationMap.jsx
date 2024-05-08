import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useParams } from "react-router-dom";

const locationIcon = new L.Icon({
  iconUrl: "https://i.ibb.co/JBPfMBf/ball-pit.png",
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LocationMap = () => {
  const { id } = useParams();

  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetch(`/api/location/${id}`)
      .then((response) => response.json())
      .then((data) => setLocation(data));
  }, [id]);

  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer
      center={[location.latitude, location.longitude]}
      zoom={14}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "300px" }}
      minZoom={15}
      maxZoom={18}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[location.latitude, location.longitude]}
        icon={locationIcon}
      >
        <Popup>
          Address: <br />
          <br />
          {location.address}, Singapore ({location.postalCode})<br />
          <br />
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationMap;
