const mongoose = require("mongoose");

const cameraSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  video: String,
  vehicles: { type: Number, default: 0 },
  people: { type: Number, default: 0 }
});

module.exports = mongoose.model("Camera", cameraSchema);