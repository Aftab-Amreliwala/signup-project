const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // React se request allow karo

// MongoDB Connect
mongoose.connect("mongodb://localhost:27017/signupDB")
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("Error:", err));

// Schema
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// Register Route
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Sab fields bharo" });
    }

    // Duplicate email check
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered hai" });
    }

    // Save karo
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "Registration successful!" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));