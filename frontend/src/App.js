import React, { useState, useEffect } from "react";
import { Container, Typography, Select, MenuItem, Card, CardContent } from "@mui/material";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Registre as escalas e elementos
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetchLogs();
    }, [filter]);

    const fetchLogs = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/logs${filter ? `?level=${filter}` : ""}`);
            setLogs(response.data);
        } catch (error) {
            console.error("Erro ao buscar logs:", error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                NexLog Dashboard
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Filtro:
            </Typography>
            <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                displayEmpty
                fullWidth
            >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
            </Select>
            <div style={{ marginTop: 20 }}>
                {logs.map((log) => (
                    <Card key={log._id} variant="outlined" style={{ marginBottom: 10 }}>
                        <CardContent>
                            <Typography variant="h6">{log.level.toUpperCase()}</Typography>
                            <Typography variant="body2">{log.message}</Typography>
                            <Typography color="textSecondary" variant="caption">
                                {new Date(log.timestamp).toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div style={{ marginTop: 20 }}>
                <LogsChart logs={logs} />
            </div>
        </Container>
    );
}

function LogsChart({ logs }) {
    const levelsCount = logs.reduce((acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
    }, {});

    const data = {
        labels: ["Info", "Warning", "Error"],
        datasets: [
            {
                label: "Quantidade de Logs",
                data: ["info", "warning", "error"].map(level => levelsCount[level] || 0),
                backgroundColor: ["#4A90E2", "#F5A623", "#D0021B"],
            },
        ],
    };

    return <Bar data={data} />;
}

export default App;
