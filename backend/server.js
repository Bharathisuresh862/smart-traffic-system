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



// const express = require("express");
// const cors = require("cors");
// const path = require("path");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // serve videos
// app.use("/videos", express.static(path.join(__dirname, "../ai-model")));

// let cameras = [
//   { id: 1, name: "Junction A", lat: 12.9716, lng: 77.5946, video: "video1.mp4", vehicles: 0, people: 0 },
//   { id: 3, name: "Junction C", lat: 12.968, lng: 77.58, video: "video3.mp4", vehicles: 0, people: 0 }
// ];

// app.post("/data", (req, res) => {
//   const { cameraId, vehicles, people } = req.body;
//   const cam = cameras.find(c => c.id === cameraId);

//   if (cam) {
//     cam.vehicles = vehicles;
//     cam.people = people;
//   }

//   res.send("Updated");
// });

// app.get("/", (req, res) => {
//   res.send("Backend is working 🚀");
// });

// app.get("/data", (req, res) => {
//   res.json(cameras);
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log("Server running on port", PORT);
// });

require("dotenv").config();

console.log("URI:", process.env.MONGO_URI);  // 2) debug here


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");

const Camera = require("./models/Camera");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Serve videos
app.use("/videos", express.static(path.join(__dirname, "../ai-model")));

// Root test
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// 🚦 Signal logic
function getSignalTime(v) {
  if (v < 10) return 20;
  if (v < 25) return 40;
  return 60;
}

// 📊 GET data
app.get("/data", async (req, res) => {
  try {
    const cams = await Camera.find();

    const updated = cams.map(c => ({
      ...c._doc,
      signalTime: getSignalTime(c.vehicles)
    }));

    res.json(updated);
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
});

// 🤖 AI update
app.post("/data", async (req, res) => {
  const { cameraId, vehicles, people } = req.body;

  await Camera.findByIdAndUpdate(cameraId, {
    vehicles,
    people
  });

  res.send("Updated");
});

// 🔐 LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ role: "admin" }, "secret", { expiresIn: "1h" });
    return res.json({ token });
  }

  res.status(401).send("Invalid");
});

// 📡 ESP32 signal
let signal = 0;

app.post("/signal", (req, res) => {
  signal = req.body.signal;
  res.send("Signal updated");
});

app.get("/signal", (req, res) => {
  res.json({ signal });
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});