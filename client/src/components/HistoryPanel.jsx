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
} from "recharts";
import {
  getCardStyles,
  buttonContainerStyle,
  getButtonStyles,
  toggleButtonStyles,
  toggleCircleStyle,
} from "../styles/Styles";

export default function HistoryPanel({ type, id, darkMode }) {
  const [history, setHistory] = useState([]);
  const [timeRange, setTimeRange] = useState("30d");
  const [showRendered, setShowRendered] = useState(true);
  const [showEnabled, setShowEnabled] = useState(true);

  const endpoint =
    type === "machine"
      ? `/machine-history?machine_id=${id}`
      : type === "chest"
      ? `/chest-history?chest_id=${id}`
      : null;

  const loadHistory = async () => {
    if (!endpoint || String(id).startsWith("temp-")) return;

    try {
      const data = await apiGet(endpoint);
      if (!Array.isArray(data)) return;

      const cleaned = data
        .filter((e) => e.timestamp && !isNaN(new Date(e.timestamp)))
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime()
        );

      setHistory(cleaned);
    } catch (err) {
      console.warn(`Failed to fetch ${type} history:`, err.message || err);
    }
  };

  useEffect(() => {
    loadHistory();
    const i = setInterval(loadHistory, 60000);
    return () => clearInterval(i);
  }, [id, type]);

  const filteredHistory = useMemo(() => {
    const now = Date.now();
    const ranges = {
      "1h": now - 3600000,
      "1d": now - 86400000,
      "7d": now - 7 * 86400000,
      "30d": now - 30 * 86400000,
    };
    return history.filter(
      (e) => new Date(e.timestamp).getTime() >= ranges[timeRange]
    );
  }, [history, timeRange]);

  const chartData = useMemo(() => {
    if (!filteredHistory.length) return [];

    const MAX_POINTS = 50;
    const step = Math.max(1, Math.ceil(filteredHistory.length / MAX_POINTS));

    return filteredHistory.filter((_, i) => i % step === 0).map((entry) => {
      const d = new Date(entry.timestamp);
      const short =
        ["1h", "1d", "7d"].includes(timeRange)
          ? `${d.getHours().toString().padStart(2, "0")}:${d
              .getMinutes()
              .toString()
              .padStart(2, "0")}`
          : `${d.getMonth() + 1}/${d.getDate()}`;

      return {
        realTimestamp: entry.timestamp,
        displayTimestamp: short,
        rendered: entry.is_rendered ? 1 : 0,
        enabled: entry.is_enabled ? 1 : 0,
        amount: entry.amount,
      };
    });
  }, [filteredHistory, timeRange]);

  const tooltipPrefix = ["1h", "1d", "7d"].includes(timeRange)
    ? "Time:"
    : "Day:";

  return (
    <div style={getCardStyles(darkMode)}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h3 style={{ margin: 0 }}>
          {type[0].toUpperCase() + type.slice(1)} History
        </h3>

        {type === "machine" && (
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <div
              style={toggleButtonStyles(showRendered, darkMode)}
              onClick={() => setShowRendered((s) => !s)}
            >
              <span style={toggleCircleStyle("#f0dd05")} />
              Rendered
            </div>
            <div
              style={toggleButtonStyles(showEnabled, darkMode)}
              onClick={() => setShowEnabled((s) => !s)}
            >
              <span style={toggleCircleStyle("#4caf50")} />
              Enabled
            </div>
          </div>
        )}
      </div>

      <div style={buttonContainerStyle}>
        {["30d", "7d", "1d", "1h"].map((r) => (
          <button
            key={r}
            style={getButtonStyles(timeRange === r, darkMode)}
            onClick={() => setTimeRange(r)}
          >
            {r === "30d"
              ? "Last 30 Days"
              : r === "7d"
              ? "Last 7 Days"
              : r === "1d"
              ? "Last Day"
              : "Last Hour"}
          </button>
        ))}
      </div>

      {!chartData.length ? (
        <p>No history available.</p>
      ) : (
        <ResponsiveContainer key={type + id} width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{
              top: type === "chest" ? 5 : 20,
              bottom: type === "chest" ? 5 : 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#555" : "#ccc"}
              vertical={false}
            />

            <XAxis
              dataKey="realTimestamp"
              stroke={darkMode ? "#fff" : "#000"}
              interval="preserveStartEnd"
              angle={-30}
              textAnchor="end"
              height={40}
              tickFormatter={(t) => {
                const d = new Date(t);
                return ["1h", "1d", "7d"].includes(timeRange)
                  ? `${d.getHours().toString().padStart(2, "0")}:${d
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`
                  : `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />

            {type === "chest" ? (
              <YAxis stroke={darkMode ? "#fff" : "#000"} />
            ) : (
              <YAxis hide domain={[-0.2, 1.2]} />
            )}

            <Tooltip
              formatter={(v) =>
                type === "machine" ? (v === 1 ? "True" : "False") : v
              }
              labelFormatter={(_, payload) =>
                `${tooltipPrefix} ${payload?.[0]?.payload?.displayTimestamp}`
              }
              contentStyle={{
                backgroundColor: darkMode ? "#333" : "#fff",
                border: "1px solid",
                borderColor: darkMode ? "#555" : "#ccc",
                color: darkMode ? "#fff" : "#000",
              }}
              labelStyle={{
                color: darkMode ? "#fff" : "#000",
                fontWeight: "bold",
              }}
              itemStyle={{ color: darkMode ? "#fff" : "#000" }}
            />

            {type === "machine" && showRendered && (
              <Line type="linear" dataKey="rendered" stroke="#f0dd05" dot={{ r: 3 }} />
            )}

            {type === "machine" && showEnabled && (
              <Line type="linear" dataKey="enabled" stroke="#4caf50" dot={{ r: 3 }} />
            )}

            {type === "chest" && (
              <Line type="linear" dataKey="amount" stroke="#f57c00" dot={{ r: 3 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}