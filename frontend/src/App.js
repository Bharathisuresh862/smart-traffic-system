// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup
// } from "react-leaflet";
// import HeatmapLayer from "react-leaflet-heatmap-layer";
// import L from "leaflet";

// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement
// } from "chart.js";
// import { Line } from "react-chartjs-2";

// import "leaflet/dist/leaflet.css";

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

// // Camera icon
// const cameraIcon = new L.Icon({
//   iconUrl: "/camera.png",
//   iconSize: [35, 35],
// });

// function App() {
//   const [data, setData] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [selectedCamera, setSelectedCamera] = useState(null);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       axios
//         .get("https://smart-traffic-system-ea56.onrender.com/data")
//         .then(res => {
//           setData(res.data);

//           const total = res.data.reduce((sum, cam) => sum + cam.vehicles, 0);

//           setHistory(prev => {
//             const updated = [...prev, total];
//             return updated.slice(-15);
//           });

//           // 🚨 Congestion alert
//           res.data.forEach(cam => {
//             if (cam.vehicles > 30) {
//               console.log(`Heavy traffic at ${cam.name}`);
//             }
//           });

//         })
//         .catch(err => console.log(err));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // 🚦 Signal logic
//   const getSignalTime = (vehicles) => {
//     if (vehicles < 10) return 20;
//     if (vehicles < 25) return 40;
//     return 60;
//   };

//   // 🚨 Status
//   const getStatus = (vehicles) => {
//     if (vehicles < 10) return "🟢 Normal";
//     if (vehicles < 25) return "🟡 Moderate";
//     return "🔴 Heavy";
//   };

//   // 📈 Prediction
//   const predictTraffic = () => {
//     if (history.length < 2) return 0;
//     const last = history[history.length - 1];
//     const prev = history[history.length - 2];
//     return Math.round(last + (last - prev));
//   };

//   const chartData = {
//     labels: history.map((_, i) => i + 1),
//     datasets: [
//       {
//         label: "Traffic Density",
//         data: history,
//         borderWidth: 2,
//         tension: 0.4
//       }
//     ]
//   };

//   const totalVehicles = data.reduce((s, c) => s + c.vehicles, 0);
//   const totalPeople = data.reduce((s, c) => s + c.people, 0);

//   return (
//     <div style={{
//       background: "linear-gradient(135deg,#0f172a,#020617)",
//       color: "white",
//       minHeight: "100vh",
//       padding: "20px"
//     }}>

//       <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//         🚦 Smart Traffic Intelligence System
//       </motion.h1>

//       {/* KPI */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "repeat(4,1fr)",
//         gap: "20px"
//       }}>
//         <Card title="🚗 Vehicles" value={totalVehicles} />
//         <Card title="👥 People" value={totalPeople} />
//         <Card title="📍 Cameras" value={data.length} />
//         <Card title="📈 Prediction" value={predictTraffic()} />
//       </div>

//       {/* MAP + CHART */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1fr 1fr",
//         gap: "20px",
//         marginTop: "20px"
//       }}>

//         {/* MAP */}
//         <div style={{ background: "#1e293b", padding: "10px", borderRadius: "10px" }}>
//           <h3>🗺️ Traffic Map</h3>

//           <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: "300px" }}>
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//             {/* 🔥 Heatmap */}
//             <HeatmapLayer
//               points={data.map(cam => [cam.lat, cam.lng, cam.vehicles])}
//               longitudeExtractor={m => m[1]}
//               latitudeExtractor={m => m[0]}
//               intensityExtractor={m => m[2]}
//             />

//             {data.map(cam => (
//               // <Marker key={cam.id} position={[cam.lat, cam.lng]} icon={cameraIcon}>
//               <Marker key={cam._id} position={[cam.lat, cam.lng]} icon={cameraIcon}>
//                 <Popup>
//                   <h4>{cam.name}</h4>
//                   🚗 {cam.vehicles}<br />
//                   👥 {cam.people}<br />
//                   🚦 {getSignalTime(cam.vehicles)} sec<br />
//                   Status: {getStatus(cam.vehicles)}<br /><br />

//                   <button onClick={() => setSelectedCamera(cam)}>
//                     View Live Feed
//                   </button>
//                 </Popup>
//               </Marker>
//             ))}
//           </MapContainer>
//         </div>

//         {/* CHART */}
//         <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
//           <h3>📊 Traffic Trend</h3>
//           <Line data={chartData} />
//         </div>
//       </div>

//       {/* VIDEO */}
//       {selectedCamera && (
//         <div style={{ marginTop: "20px", background: "#1e293b", padding: "10px" }}>
//           <h3>📺 {selectedCamera.name}</h3>

//           <video width="100%" controls autoPlay muted>
//             <source
//               src={`https://smart-traffic-system-ea56.onrender.com/videos/${selectedCamera.video}`}
//               type="video/mp4"
//             />
//           </video>

//           <button onClick={() => setSelectedCamera(null)}>Close</button>
//         </div>
//       )}

//     </div>
//   );
// }

// // CARD
// function Card({ title, value }) {
//   return (
//     <motion.div whileHover={{ scale: 1.05 }} style={{
//       background: "#1e293b",
//       padding: "20px",
//       borderRadius: "10px",
//       textAlign: "center"
//     }}>
//       <h3>{title}</h3>
//       <h1>{value}</h1>
//     </motion.div>
//   );
// }

// export default App;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup
// } from "react-leaflet";
// // import HeatmapLayer from "react-leaflet-heatmap-layer";
// import L from "leaflet";
// import "leaflet.heat";

// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement
// } from "chart.js";
// import { Line } from "react-chartjs-2";

// import "leaflet/dist/leaflet.css";

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

// // CCTV icon
// const cameraIcon = new L.Icon({
//   iconUrl: "/camera.png",
//   iconSize: [35, 35],
// });

// function App() {
//   const [data, setData] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [selectedCamera, setSelectedCamera] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       axios
//         .get("https://smart-traffic-system-ea56.onrender.com/data")
//         .then(res => {
//           setData(res.data);
//           setLoading(false);

//           const total = res.data.reduce((sum, cam) => sum + cam.vehicles, 0);

//           setHistory(prev => {
//             const updated = [...prev, total];
//             return updated.slice(-15);
//           });

//           // 🚨 Alert system
//           res.data.forEach(cam => {
//             if (cam.vehicles > 30) {
//               console.log(`🚨 Heavy traffic at ${cam.name}`);
//             }
//           });
//         })
//         .catch(err => console.log(err));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // 📈 Prediction
//   const predictTraffic = () => {
//     if (history.length < 2) return 0;
//     const last = history[history.length - 1];
//     const prev = history[history.length - 2];
//     return Math.round(last + (last - prev));
//   };

//   const chartData = {
//     labels: history.map((_, i) => i + 1),
//     datasets: [
//       {
//         label: "Traffic Density",
//         data: history,
//         borderWidth: 2,
//         tension: 0.4
//       }
//     ]
//   };

//   const totalVehicles = data.reduce((s, c) => s + c.vehicles, 0);
//   const totalPeople = data.reduce((s, c) => s + c.people, 0);

//   // 🚨 Status
//   const getStatus = (vehicles) => {
//     if (vehicles < 10) return "🟢 Normal";
//     if (vehicles < 25) return "🟡 Moderate";
//     return "🔴 Heavy";
//   };

//   if (loading) return <h2 style={{ color: "white" }}>Loading data...</h2>;

//   return (
//     <div style={{
//       background: "linear-gradient(135deg,#0f172a,#020617)",
//       color: "white",
//       minHeight: "100vh",
//       padding: "20px"
//     }}>

//       <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//         🚦 Smart Traffic Intelligence System
//       </motion.h1>

//       {/* KPI */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "repeat(4,1fr)",
//         gap: "20px"
//       }}>
//         <Card title="🚗 Vehicles" value={totalVehicles} />
//         <Card title="👥 People" value={totalPeople} />
//         <Card title="📍 Cameras" value={data.length} />
//         <Card title="📈 Prediction" value={predictTraffic()} />
//       </div>

//       {/* MAP + CHART */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1fr 1fr",
//         gap: "20px",
//         marginTop: "20px"
//       }}>

//         {/* MAP */}
//         <div style={{ background: "#1e293b", padding: "10px", borderRadius: "10px" }}>
//           <h3>🗺️ Traffic Map</h3>

//           <MapContainer
//             center={[data[0]?.lat || 12.9716, data[0]?.lng || 77.5946]}
//             zoom={13}
//             style={{ height: "300px" }}
//           >
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//             {/* 🔥 Heatmap */}
//             <HeatmapLayer
//               points={data.map(cam => [cam.lat, cam.lng, cam.vehicles])}
//               longitudeExtractor={m => m[1]}
//               latitudeExtractor={m => m[0]}
//               intensityExtractor={m => m[2]}
//             />

//             {data.map(cam => (
//               <Marker key={cam._id} position={[cam.lat, cam.lng]} icon={cameraIcon}>
//                 <Popup>
//                   <h4>{cam.name}</h4>
//                   🚗 {cam.vehicles}<br />
//                   👥 {cam.people}<br />
//                   🚦 {cam.signalTime} sec<br />
//                   Status: {getStatus(cam.vehicles)}<br /><br />

//                   <button onClick={() => setSelectedCamera(cam)}>
//                     View Live Feed
//                   </button>
//                 </Popup>
//               </Marker>
//             ))}
//           </MapContainer>
//         </div>

//         {/* CHART */}
//         <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
//           <h3>📊 Traffic Trend</h3>
//           <Line data={chartData} />
//         </div>
//       </div>

//       {/* VIDEO */}
//       {selectedCamera && (
//         <div style={{ marginTop: "20px", background: "#1e293b", padding: "10px" }}>
//           <h3>📺 {selectedCamera.name}</h3>

//           <video key={selectedCamera._id} width="100%" controls autoPlay muted>
//             <source
//               src={`https://smart-traffic-system-ea56.onrender.com/videos/${selectedCamera.video}`}
//               type="video/mp4"
//             />
//           </video>

//           <button onClick={() => setSelectedCamera(null)}>Close</button>
//         </div>
//       )}

//     </div>
//   );
// }

// // CARD COMPONENT
// function Card({ title, value }) {
//   return (
//     <motion.div whileHover={{ scale: 1.05 }} style={{
//       background: "#1e293b",
//       padding: "20px",
//       borderRadius: "10px",
//       textAlign: "center"
//     }}>
//       <h3>{title}</h3>
//       <h1>{value}</h1>
//     </motion.div>
//   );
// }

// export default App;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

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

// 📷 Camera Icon
const cameraIcon = new L.Icon({
  iconUrl: "/camera.png",
  iconSize: [35, 35],
});

/* ===========================
   🔥 HEATMAP COMPONENT
=========================== */
function Heatmap({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!data.length) return;

    const points = data.map(cam => [
      cam.lat,
      cam.lng,
      cam.vehicles
    ]);

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [data, map]);

  return null;
}

/* ===========================
   🚀 MAIN APP
=========================== */
function App() {
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("https://smart-traffic-system-ea56.onrender.com/data")
        .then(res => {
          setData(res.data);
          setLoading(false);

          const total = res.data.reduce((sum, cam) => sum + cam.vehicles, 0);

          setHistory(prev => {
            const updated = [...prev, total];
            return updated.slice(-15);
          });

          // 🚨 Alerts
          res.data.forEach(cam => {
            if (cam.vehicles > 30) {
              console.log(`🚨 Heavy traffic at ${cam.name}`);
            }
          });
        })
        .catch(err => console.log(err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 📈 Prediction
  const predictTraffic = () => {
    if (history.length < 2) return 0;
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    return Math.round(last + (last - prev));
  };

  // 🚦 Status
  const getStatus = (vehicles) => {
    if (vehicles < 10) return "🟢 Normal";
    if (vehicles < 25) return "🟡 Moderate";
    return "🔴 Heavy";
  };

  const chartData = {
    labels: history.map((_, i) => i + 1),
    datasets: [
      {
        label: "Traffic Density",
        data: history,
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const totalVehicles = data.reduce((s, c) => s + c.vehicles, 0);
  const totalPeople = data.reduce((s, c) => s + c.people, 0);

  if (loading) return <h2 style={{ color: "white" }}>Loading data...</h2>;

  return (
    <div style={{
      background: "linear-gradient(135deg,#0f172a,#020617)",
      color: "white",
      minHeight: "100vh",
      padding: "20px"
    }}>

      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        🚦 Smart Traffic Intelligence System
      </motion.h1>

      {/* KPI */}
      <div style={{
        display: "grid",
        gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "repeat(4,1fr)",
        gap: "20px"
      }}>
        <Card title="🚗 Vehicles" value={totalVehicles} />
        <Card title="👥 People" value={totalPeople} />
        <Card title="📍 Cameras" value={data.length} />
        <Card title="📈 Prediction" value={predictTraffic()} />
      </div>

      {/* MAP + CHART */}
      <div style={{
        display: "grid",
        gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1fr 1fr",
        gap: "20px",
        marginTop: "20px"
      }}>

        {/* MAP */}
        <div style={{ background: "#1e293b", padding: "10px", borderRadius: "10px" }}>
          <h3>🗺️ Traffic Map</h3>

          <MapContainer
            center={[data[0]?.lat || 12.9716, data[0]?.lng || 77.5946]}
            zoom={13}
            style={{ height: "300px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* 🔥 HEATMAP */}
            <Heatmap data={data} />

            {data.map(cam => (
              <Marker key={cam._id} position={[cam.lat, cam.lng]} icon={cameraIcon}>
                <Popup>
                  <h4>{cam.name}</h4>
                  🚗 {cam.vehicles}<br />
                  👥 {cam.people}<br />
                  🚦 {cam.signalTime} sec<br />
                  Status: {getStatus(cam.vehicles)}<br /><br />

                  <button onClick={() => setSelectedCamera(cam)}>
                    View Live Feed
                  </button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* CHART */}
        <div style={{ background: "#1e293b", padding: "20px", borderRadius: "10px" }}>
          <h3>📊 Traffic Trend</h3>
          <Line data={chartData} />
        </div>
      </div>

      {/* VIDEO */}
      {selectedCamera && (
        <div style={{
          marginTop: "20px",
          background: "#1e293b",
          padding: "15px",
          borderRadius: "10px"
        }}>
          <h3>📺 {selectedCamera.name}</h3>

          <video key={selectedCamera._id} width="100%" controls autoPlay muted>
            <source
              src={`https://smart-traffic-system-ea56.onrender.com/videos/${selectedCamera.video}`}
              type="video/mp4"
            />
          </video>

          <button onClick={() => setSelectedCamera(null)}>
            Close
          </button>
        </div>
      )}

    </div>
  );
}

/* ===========================
   🎨 CARD COMPONENT
=========================== */
function Card({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center"
      }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </motion.div>
  );
}

export default App;