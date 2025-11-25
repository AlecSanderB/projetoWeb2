import React, { useState, useEffect, useMemo } from "react";
import { apiGet } from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import {
  getCardStyles,
  buttonContainerStyle,
  getButtonStyles,
  toggleButtonStyles,
  toggleCircleStyle
} from "../styles/Styles";

export default function HistoryPanel({ type, id, darkMode }) {
  const [history, setHistory] = useState([]);
  const [timeRange, setTimeRange] = useState("30d");
  const [showRendered, setShowRendered] = useState(true);
  const [showEnabled, setShowEnabled] = useState(true);

  const endpoint = type === "machine"
    ? `/machine-history?machine_id=${id}`
    : type === "chest"
      ? `/chest-history?chest_id=${id}`
      : null;

  const loadHistory = async () => {
    if (!endpoint) return;
    try {
      const data = await apiGet(endpoint);
      data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setHistory(data);
    } catch (err) {
      console.error(`Failed to fetch ${type} history`, err);
    }
  };

  useEffect(() => {
    loadHistory();
    const interval = setInterval(loadHistory, 60000);
    return () => clearInterval(interval);
  }, [id, type]);

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
          case "1d":
          case "7d":
            formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
            break;
          case "30d":
          default:
            formattedTime = `${date.getMonth() + 1}/${date.getDate()}`;
        }

        if (type === "machine") {
          return {
            timestamp: formattedTime,
            rendered: entry.is_rendered ? 1 : 0,
            enabled: entry.is_enabled ? 1 : 0
          };
        } else {
          return {
            timestamp: formattedTime,
            amount: entry.amount
          };
        }
      });
  }, [filteredHistory, timeRange, type]);

  const tooltipLabelPrefix = ["1h", "1d", "7d"].includes(timeRange) ? "Time:" : "Day:";

  return (
    <div style={getCardStyles(darkMode)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h3 style={{ margin: 0 }}>{type.charAt(0).toUpperCase() + type.slice(1)} History</h3>
        {type === "machine" && (
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <div style={toggleButtonStyles(showRendered, darkMode)} onClick={() => setShowRendered(!showRendered)}>
              <span style={toggleCircleStyle("#f0dd05")} />
              Rendered
            </div>
            <div style={toggleButtonStyles(showEnabled, darkMode)} onClick={() => setShowEnabled(!showEnabled)}>
              <span style={toggleCircleStyle("#4caf50")} />
              Enabled
            </div>
          </div>
        )}
      </div>

      <div style={buttonContainerStyle}>
        <button style={getButtonStyles(timeRange === "30d", darkMode)} onClick={() => setTimeRange("30d")}>Last 30 Days</button>
        <button style={getButtonStyles(timeRange === "7d", darkMode)} onClick={() => setTimeRange("7d")}>Last 7 Days</button>
        <button style={getButtonStyles(timeRange === "1d", darkMode)} onClick={() => setTimeRange("1d")}>Last Day</button>
        <button style={getButtonStyles(timeRange === "1h", darkMode)} onClick={() => setTimeRange("1h")}>Last Hour</button>
      </div>

      {chartData.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: type !== "chest" ? 20 : 5, bottom: type !== "chest" ? 20 : 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#555" : "#ccc"}
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              stroke={darkMode ? "#fff" : "#000"}
              interval="preserveStartEnd"
              angle={-30}
              textAnchor="end"
              height={40}
            />
            {type === "chest" ? (
              <YAxis stroke={darkMode ? "#fff" : "#000"} />
            ) : (
              <YAxis hide domain={[-0.2, 1.2]} />
            )}
            <Tooltip
              formatter={(value) => type === "machine" ? (value === 1 ? "True" : "False") : value}
              labelFormatter={label => `${tooltipLabelPrefix} ${label}`}
              contentStyle={{
                backgroundColor: darkMode ? "#333" : "#fff",
                border: "1px solid",
                borderColor: darkMode ? "#555" : "#ccc",
                color: darkMode ? "#fff" : "#000",
              }}
              labelStyle={{ color: darkMode ? "#fff" : "#000", fontWeight: "bold" }}
              itemStyle={{ color: darkMode ? "#fff" : "#000" }}
            />
            {type === "machine" && showRendered && <Line type="linear" dataKey="rendered" stroke="#f0dd05" dot={{ r: 3 }} />}
            {type === "machine" && showEnabled && <Line type="linear" dataKey="enabled" stroke="#4caf50" dot={{ r: 3 }} />}
            {type === "chest" && <Line type="linear" dataKey="amount" stroke="#f57c00" dot={{ r: 3 }} />}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}