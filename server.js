const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./schema"); // Import the schema

dotenv.config();

const app = express();
app.use(express.json()); // Ensure request body is parsed

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Error connecting to database:", err));

app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password } = req.body; // Ensure these fields exist

    // Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: "Validation error", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));