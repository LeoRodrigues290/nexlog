import React, { useState, useEffect } from "react";
import axios from "axios";

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
      <div>
        <h1>NexLog Dashboard</h1>
        <label>Filtro:</label>
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="">Todos</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
        <div>
          {logs.map(log => (
              <div key={log._id}>
                <p><strong>{log.level.toUpperCase()}</strong>: {log.message}</p>
                <small>{new Date(log.timestamp).toLocaleString()}</small>
              </div>
          ))}
        </div>
      </div>
  );
}

export default App;
