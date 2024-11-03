const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => console.log(err));

// Define rota para salvar logs
app.post("/api/logs", async (req, res) => {
    const { level, message } = req.body;
    try {
        const log = new Log({ level, message });
        await log.save();
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const Log = require("./models/Log");

// Rota para buscar logs com filtro
app.get("/api/logs", async (req, res) => {
    const { level } = req.query;
    const filter = level ? { level } : {};
    try {
        const logs = await Log.find(filter).sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
