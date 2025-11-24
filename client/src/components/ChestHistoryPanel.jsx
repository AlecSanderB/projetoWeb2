import React, { useState, useEffect, useMemo } from "react";
import { apiGet } from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Brush
} from "recharts";

export default function MachineHistoryPanel({ machineId, darkMode }) {
  const [history, setHistory] = useState([]);
  const [timeRange, setTimeRange] = useState("30d");
  const [showRendered, setShowRendered] = useState(true);
  const [showEnabled, setShowEnabled] = useState(true);

  const loadHistory = async () => {
    try {
      const data = await apiGet(`/machine-history?machine_id=${machineId}`);
      data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch machine history", err);
    }
  };

  useEffect(() => {
    loadHistory();
    const interval = setInterval(loadHistory, 60000);
    return () => clearInterval(interval);
  }, [machineId]);

  // Filter history based on time range
  const filteredHistory = useMemo(() => {
    const now = new Date();
    let cutoff;
    switch (timeRange) {
      case "1h": cutoff = new Date(now.getTime() - 60 * 60 * 1000); break;
      case "1d": cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); break;
      case "7d": cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
      case "30d":
      default: cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    return history.filter(entry => new Date(entry.timestamp) >= cutoff);
  }, [history, timeRange]);

  // Downsample / format chart data
  const MAX_POINTS = 50;
  const chartData = useMemo(() => {
    if (filteredHistory.length === 0) return [];
    const step = Math.ceil(filteredHistory.length / MAX_POINTS);

    return filteredHistory
      .filter((_, index) => index % step === 0)
      .map(entry => {
        const date = new Date(entry.timestamp);
        let formattedTime;

        switch (timeRange) {
          case "1h":
            formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
            break;
          case "1d":
          case "7d":
            formattedTime = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
            break;
          case "30d":
          default:
            formattedTime = `${date.getMonth() + 1}/${date.getDate()}`;
        }

        return {
          timestamp: formattedTime,
          rendered: entry.is_rendered ? 1 : 0,
          enabled: entry.is_enabled ? 1 : 0,
        };
      });
  }, [filteredHistory, timeRange]);

  const buttonContainerStyle = {
    display: "flex",
    marginBottom: "10px",
    gap: "5px",
    width: "100%"
  };

  const buttonStyle = (range) => ({
    flex: 1,
    padding: "8px 0",
    cursor: "pointer",
    backgroundColor: timeRange === range ? "#1976d2" : darkMode ? "#444" : "#eee",
    color: timeRange === range ? "#fff" : darkMode ? "#fff" : "#000",
    border: "none",
    borderRadius: "4px",
    textAlign: "center"
  });

  const toggleButtonStyle = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "4px",
    backgroundColor: active ? "#1976d2" : darkMode ? "#555" : "#eee",
    color: active ? "#fff" : darkMode ? "#fff" : "#000",
    fontWeight: "bold",
  });

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#2a2a3d" : "#fff",
        padding: "15px",
        borderRadius: "12px",
        boxShadow: darkMode ? "0 4px 12px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h3 style={{ margin: 0 }}>Machine History</h3>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <div style={toggleButtonStyle(showRendered)} onClick={() => setShowRendered(!showRendered)}>
            <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#f0dd05", marginRight: "5px" }} />
            Rendered
          </div>
          <div style={toggleButtonStyle(showEnabled)} onClick={() => setShowEnabled(!showEnabled)}>
            <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#4caf50", marginRight: "5px" }} />
            Enabled
          </div>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button style={buttonStyle("30d")} onClick={() => setTimeRange("30d")}>Last 30 Days</button>
        <button style={buttonStyle("7d")} onClick={() => setTimeRange("7d")}>Last 7 Days</button>
        <button style={buttonStyle("1d")} onClick={() => setTimeRange("1d")}>Last Day</button>
        <button style={buttonStyle("1h")} onClick={() => setTimeRange("1h")}>Last Hour</button>
      </div>

      {chartData.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#555" : "#ccc"} />
            <XAxis
              dataKey="timestamp"
              stroke={darkMode ? "#fff" : "#000"}
              interval="preserveStartEnd"
              angle={-30}
              textAnchor="end"
              height={40}
            />
            <YAxis stroke={darkMode ? "#fff" : "#000"} />
            <Tooltip
              formatter={value => Number(value).toFixed(0)}
              labelFormatter={label => `Time: ${label}`}
              contentStyle={{
                backgroundColor: darkMode ? "#333" : "#fff",
                border: "1px solid",
                borderColor: darkMode ? "#555" : "#ccc",
                color: darkMode ? "#fff" : "#000"
              }}
              labelStyle={{ color: darkMode ? "#fff" : "#000", fontWeight: "bold" }}
              itemStyle={{ color: darkMode ? "#fff" : "#000" }}
            />
            {showRendered && <Line type="linear" dataKey="rendered" stroke="#f0dd05" dot={{ r: 3 }} />}
            {showEnabled && <Line type="linear" dataKey="enabled" stroke="#4caf50" dot={{ r: 3 }} />}
            <Brush dataKey="timestamp" height={30} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}