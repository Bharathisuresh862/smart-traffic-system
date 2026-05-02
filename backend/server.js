// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Serve video files
// app.use("/videos", express.static(path.join(__dirname, "../ai-model")));

// // Camera data
// let cameras = [
//   {
//     id: 1,
//     name: "Junction A",
//     lat: 12.9716,
//     lng: 77.5946,
//     video: "video1.mp4",
//     vehicles: 0,
//     people: 0
//   },
//   {
//     id: 2,
//     name: "Junction B",
//     lat: 12.975,
//     lng: 77.599,
//     video: "video2.mp4",
//     vehicles: 0,
//     people: 0
//   },
//   {
//     id: 3,
//     name: "Junction C",
//     lat: 12.968,
//     lng: 77.58,
//     video: "video3.mp4",
//     vehicles: 0,
//     people: 0
//   }
// ];

// // Receive data from AI
// app.post("/data", (req, res) => {
//   const { cameraId, vehicles, people } = req.body;

//   const cam = cameras.find(c => c.id === cameraId);

//   if (cam) {
//     cam.vehicles = vehicles;
//     cam.people = people;
//     console.log(`Updated ${cam.name}:`, cam);
//   }

//   res.send("Updated");
// });

// // Send camera data
// app.get("/data", (req, res) => {
//   res.json(cameras);
// });

// app.listen(5000, "0.0.0.0", () => {
//   console.log("Server running on port 5000");
// });



const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// serve videos
app.use("/videos", express.static(path.join(__dirname, "../ai-model")));

let cameras = [
  { id: 1, name: "Junction A", lat: 12.9716, lng: 77.5946, video: "video1.mp4", vehicles: 0, people: 0 },
  { id: 3, name: "Junction C", lat: 12.968, lng: 77.58, video: "video3.mp4", vehicles: 0, people: 0 }
];

app.post("/data", (req, res) => {
  const { cameraId, vehicles, people } = req.body;
  const cam = cameras.find(c => c.id === cameraId);

  if (cam) {
    cam.vehicles = vehicles;
    cam.people = people;
  }

  res.send("Updated");
});

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

app.get("/data", (req, res) => {
  res.json(cameras);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});