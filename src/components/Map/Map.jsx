import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMapEvents } from 'https://cdn.esm.sh/react-leaflet/hooks'
import { Link } from "react-router-dom";
import L from "leaflet";
import PopUpAddLocation from "./PopUpAddLocation";
import img2 from "../../assets/locate.png";


const playIcon = new L.Icon({
  iconUrl: img2,
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const homeIcon = new L.Icon({
  iconUrl: img2,
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = () => {
  const position = [10.022796496820478, 105.76794007971952];
  const [locations, setLocations] = useState([]);
  const southWest = L.latLng(1.16, 103.59);
  const northEast = L.latLng(1.48, 104.05);
  const bounds = L.latLngBounds(southWest, northEast);

  const [searchPostalCode, setSearchPostalCode] = useState("");
  const [searchMarker, setSearchMarker] = useState(null);
  const [invalidPostalCode, setInvalidPostalCode] = useState(false);
  const mapRef = useRef(null);
  const [filterIcon, setFilterIcon] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetch("/api/location")
      .then((response) => response.json())
      .then((data) => setLocations(data));
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchMarker(null);
    setInvalidPostalCode(false);

    // Use a geocoding API to get the latitude and longitude for the entered postal code.
    const geocodingApiUrl = `/api/location/post-code/${searchPostalCode}`;
    fetch(geocodingApiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          // Set an error message if the postal code is invalid
          setSearchMarker({ error: true });
          setInvalidPostalCode(true);
          return;
        }

        
        const [result] = data;
        console.log(result);
        const { latitude, longitude } = result;
        console.log('data',latitude)
        // Set the search marker on the map.
        setSearchMarker({ latitude, longitude });
        // Reset the map view to the initial position and zoom level
        // mapRef.current.setView(position, 8);
        mapRef.current.flyTo([latitude, longitude], 16);
      })
      .catch((error) => {
        console.log(error);
        // setInvalidPostalCode(true);
        setSearchMarker({ error: true });
      });
  };

  // Playground/Pool marker zoom in
  const handleMarkerClick = (location) => {
    const { latitude, longitude } = location;
    mapRef.current.flyTo([latitude, longitude], 16);
  };

  // Searched postal code marker zoom in
  const handleSearchMarkerClick = () => {
    mapRef.current.flyTo([searchMarker.lat, searchMarker.lon], 14);
  };

  // Search All Icons
  const handleResetClick = () => {
    setFilterIcon(null);
  };

  // Change tabs
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleAddMarker = (event) => {
    console.log('====================================');
    console.log(event);
    console.log('====================================');
  }

  console.log(searchMarker);
  return (
    <div>
      <div className="ml-4 tabs mb-3 mt-3">
        <a
          className={`tab ${
            activeTab === "all" ? "bg-primary text-white rounded-lg" : ""
          }`}
          onClick={() => {
            handleTabClick("all");
            handleResetClick();
          }}
        >
          Show All
        </a>
        {/* <div
          className={`tab gap-2 ${
            activeTab === "playgrounds"
              ? "bg-primary text-white rounded-lg"
              : ""
          }`}
          onClick={() => {
            handleTabClick("playgrounds");
            setFilterIcon(playIcon);
          }}
        >
          Show Top Restaurant
          <img
            className="w-6 h-6"
            src="https://cdn-icons-png.flaticon.com/512/6643/6643359.png"
            alt="playground"
          />
        </div> */}

        <form className="ml-20 flex" onSubmit={handleSearchSubmit}>
          <label>
            <input
              className="input input-sm input-bordered input-primary w-full max-w-xs"
              type="text"
              placeholder="Enter Postal Code"
              value={searchPostalCode}
              onChange={(e) => setSearchPostalCode(e.target.value)}
              
            />
          </label>
          <button
            className="btn ml-2 mr-6 btn-primary btn-sm text-black"
            type="submit"
            disabled={!searchPostalCode}
          >
            Search
          </button>
        </form>
        
      </div>

      <MapContainer
        center={position}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "550px" }}
        bounds={bounds}
        minZoom={12}
        maxZoom={18}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => {
          if (
            !filterIcon ||
            location.locationType === 'Restaurant'
          ) {
            return (
              <Marker
                key={location._id}
                position={[location.latitude, location.longitude]}
                icon={
                  playIcon
                }
                eventHandlers={{
                  click: () => handleMarkerClick(location),
                }}
              >
                <Popup>
                  <img
                    src={location.image}
                    alt="Location Image"
                    style={{ width: "300px", height: "220px" }}
                  />
                  <br />
                  <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>
                    {location.locationName}
                  </h1>
                  <br />
                  {location.address}, VietNam ({location.postalCode})<br />
                  <br />
                  <Link to={`/location/${location._id}`}>
                    <button>View More</button>
                  </Link>
                </Popup>
              </Marker>
            );
          }
        })}

        {searchMarker && searchMarker.lat && searchMarker.lon && (
          <Marker
            position={[searchMarker.lat, searchMarker.lon]}
            icon={homeIcon}
            eventHandlers={{
              click: handleSearchMarkerClick,
            }}
          >
            {searchMarker.error ? (
              <Popup>
                Invalid postal code. Please enter a Singapore postal code.
              </Popup>
            ) : (
              <Popup>Searched Postal Code: {searchPostalCode}</Popup>
            )}
          </Marker>
        )}
      </MapContainer>
      
    </div>
  );
};

export default Map;
