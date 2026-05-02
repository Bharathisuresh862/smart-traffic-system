import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import L from "leaflet";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";
import { Line } from "react-chartjs-2";

import "leaflet/dist/leaflet.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

// Custom CCTV icon
const cameraIcon = new L.Icon({
  iconUrl: "/camera.png",
  iconSize: [35, 35],
});

function App() {
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // axios.get("http://127.0.0.1:5000/data")
        axios.get("https://smart-traffic-system-ea56.onrender.com/data")

        .then(res => {
          setData(res.data);

          const total = res.data.reduce((sum, cam) => sum + cam.vehicles, 0);

          setHistory(prev => {
            const updated = [...prev, total];
            return updated.slice(-15);
          });
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: history.map((_, i) => i + 1),
    datasets: [{
      label: "Traffic Density",
      data: history,
      borderWidth: 2,
      tension: 0.4
    }]
  };

  const totalVehicles = data.reduce((s, c) => s + c.vehicles, 0);
  const totalPeople = data.reduce((s, c) => s + c.people, 0);

  return (
    <div style={{
      background: "linear-gradient(135deg,#0f172a,#020617)",
      color: "white",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "Segoe UI"
    }}>

      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        🚦 Smart Traffic Intelligence System
      </motion.h1>

      {/* KPI CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "20px"
      }}>
        <Card title="🚗 Vehicles" value={totalVehicles} />
        <Card title="👥 People" value={totalPeople} />
        <Card title="📍 Cameras" value={data.length} />
      </div>

      {/* MAIN GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginTop: "30px"
      }}>

        {/* MAP */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: "15px",
            padding: "10px"
          }}
        >
          <h3>🗺️ Traffic Map</h3>

          <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: "300px", borderRadius: "10px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {data.map(cam => (
              <Marker key={cam.id} position={[cam.lat, cam.lng]} icon={cameraIcon}>
                <Popup>
                  <div>
                    <h4>{cam.name}</h4>
                    🚗 {cam.vehicles} <br />
                    👥 {cam.people} <br /><br />

                    <button onClick={() => setSelectedCamera(cam)}>
                      View Live Feed
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* CHART */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            padding: "20px",
            borderRadius: "15px"
          }}
        >
          <h3>📊 Traffic Trend</h3>
          <Line data={chartData} />
        </motion.div>
      </div>

      {/* VIDEO PANEL */}
      {selectedCamera && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: "20px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            padding: "15px",
            borderRadius: "15px"
          }}
        >
          <h3>📺 {selectedCamera.name} Live Feed</h3>

          <video
            key={selectedCamera.id}
            width="100%"
            controls
            autoPlay
            muted
            style={{ borderRadius: "10px" }}
          >
            <source
              // src={`http://127.0.0.1:5000/videos/${selectedCamera.video}`}
                src={`https://smart-traffic-system-ea56.onrender.com/videos/${selectedCamera.video}`}
              type="video/mp4"
            />
          </video>

          <button
            style={{
              marginTop: "10px",
              padding: "8px 15px",
              borderRadius: "8px",
              border: "none",
              background: "#ef4444",
              color: "white",
              cursor: "pointer"
            }}
            onClick={() => setSelectedCamera(null)}
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  );
}

// Animated Card
function Card({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        padding: "20px",
        borderRadius: "15px",
        textAlign: "center"
      }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </motion.div>
  );
}

export default App;