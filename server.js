require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./schema'); // Import User schema

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to database"))
    .catch(err => console.error("Error connecting to database", err));

// POST API to Create User
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;

        // Validate input
        if (!name || !email || !age) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create and save new user
        const newUser = new User({ name, email, age });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", error: error.message });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));