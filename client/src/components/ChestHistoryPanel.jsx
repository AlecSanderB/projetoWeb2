import React, { useState, useEffect, useMemo } from "react";
import { apiGet } from "../api/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export default function ChestHistoryPanel({ chestId, darkMode }) {
    const [history, setHistory] = useState([]);
    const [timeRange, setTimeRange] = useState("30d");

    const loadHistory = async () => {
        try {
            const data = await apiGet(`/chest-history?chest_id=${chestId}`);
            data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setHistory(data);
        } catch (err) {
            console.error("Failed to fetch chest history", err);
        }
    };

    useEffect(() => {
        loadHistory();
        const interval = setInterval(loadHistory, 60000);
        return () => clearInterval(interval);
    }, [chestId]);

    const filteredHistory = useMemo(() => {
        const now = new Date();
        let cutoff;

        switch (timeRange) {
            case "1h":
                cutoff = new Date(now.getTime() - 60 * 60 * 1000);
                break;
            case "1d":
                cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case "7d":
                cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "30d":
            default:
                cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        return history.filter(entry => new Date(entry.timestamp) >= cutoff);
    }, [history, timeRange]);

    const chartData = filteredHistory.map(entry => {
        const date = new Date(entry.timestamp);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;
        return {
            timestamp: formattedTime,
            amount: entry.amount
        };
    });

    const xAxisInterval = useMemo(() => {
        if (chartData.length <= 10) return 0;
        return Math.ceil(chartData.length / 10);
    }, [chartData]);

    const buttonContainerStyle = {
        display: "flex",
        marginBottom: "10px",
        gap: "5px",
        width: "100%",
    };

    const buttonStyle = (range) => ({
        flex: 1,
        padding: "8px 0",
        cursor: "pointer",
        backgroundColor: timeRange === range ? "#1976d2" : darkMode ? "#444" : "#eee",
        color: timeRange === range ? "#fff" : darkMode ? "#fff" : "#000",
        border: "none",
        borderRadius: "4px",
        textAlign: "center",
    });

    return (
        <div
            style={{
                backgroundColor: darkMode ? "#2a2a3d" : "#fff",
                padding: "15px",
                borderRadius: "12px",
                boxShadow: darkMode ? "0 4px 12px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.1)",
            }}
        >
            <h3 style={{ marginTop: 0 }}>Chest History</h3>

            <div style={buttonContainerStyle}>
                <button style={buttonStyle("30d")} onClick={() => setTimeRange("30d")}>Last 30 Days</button>
                <button style={buttonStyle("7d")} onClick={() => setTimeRange("7d")}>Last 7 Days</button>
                <button style={buttonStyle("1d")} onClick={() => setTimeRange("1d")}>Last Day</button>
                <button style={buttonStyle("1h")} onClick={() => setTimeRange("1h")}>Last Hour</button>
            </div>

            {chartData.length === 0 ? (
                <p>No history available.</p>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#555" : "#ccc"} />
                        <XAxis
                            dataKey="timestamp"
                            stroke={darkMode ? "#fff" : "#000"}
                            interval={xAxisInterval}
                            tick={{ fontSize: 12 }}
                            angle={-30}
                            textAnchor="end"
                            height={40}
                        />
                        <YAxis
                            stroke={darkMode ? "#fff" : "#000"}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            formatter={(value) => Number(value).toFixed(0)}
                            labelFormatter={(label) => `Time: ${label}`}
                            contentStyle={{
                                backgroundColor: darkMode ? "#333" : "#fff",
                                border: "1px solid",
                                borderColor: darkMode ? "#555" : "#ccc",
                                color: darkMode ? "#fff" : "#000",
                            }}
                            labelStyle={{ color: darkMode ? "#fff" : "#000", fontWeight: "bold" }}
                            itemStyle={{ color: darkMode ? "#fff" : "#000" }}
                        />


                        <Line type="linear" dataKey="amount" stroke="#f57c00" dot={{ r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}