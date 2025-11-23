import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { apiPut } from "../api/api";
import {
    getCardStyles,
    getInputStyles,
    getButtonStyles,
    switchLabelStyles,
    switchSliderStyles,
    switchCircleStyles
} from "./EditPanelStyles";
import MachineHistoryPanel from "./MachineHistoryPanel";

export default function MachineEditPanel({
    item,
    saveCallback,
    addChildCallback,
    deleteCallback,
    childrenList = [],
    darkMode
}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [name, setName] = useState(item.name ?? "");
    const [coordX, setCoordX] = useState(item.coord_x ?? 0);
    const [coordY, setCoordY] = useState(item.coord_y ?? 0);
    const [isEnabled, setIsEnabled] = useState(item.is_enabled ?? false);
    const [lastUpdate, setLastUpdate] = useState(item.last_update ? new Date(item.last_update) : null);
    const [rendered, setRendered] = useState(false);

    // --- Sync state when item changes ---
    useEffect(() => {
        setName(item.name ?? "");
        setCoordX(item.coord_x ?? 0);
        setCoordY(item.coord_y ?? 0);
        setIsEnabled(item.is_enabled ?? false);
        setLastUpdate(item.last_update ? new Date(item.last_update) : null);
    }, [item]);

    // --- Live rendered indicator ---
    useEffect(() => {
        const interval = setInterval(() => {
            if (!lastUpdate) return;
            const now = new Date();
            setRendered(now - lastUpdate <= 30000);
        }, 1000);
        return () => clearInterval(interval);
    }, [lastUpdate]);

    const handleDelete = () => {
        deleteCallback(item);
        setShowDeleteModal(false);
    };

    const handleFieldChange = (fieldName, value) => {
        if (fieldName === "is_enabled") setIsEnabled(value);
        if (fieldName === "coord_x") setCoordX(value);
        if (fieldName === "coord_y") setCoordY(value);
        if (fieldName === "name") setName(value);

        saveCallback({ ...item, [fieldName]: value });

        if (fieldName === "is_enabled") {
            apiPut(`/machines/${item.id}`, { ...item, is_enabled: value }).catch(console.error);
        }
    };

    const labelStyle = { margin: 0, lineHeight: "1.2" };

    return (
        <div style={getCardStyles(darkMode)}>
            {/* Name + X + Y */}
            <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: "0.6", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={labelStyle}>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        style={getInputStyles(darkMode)}
                    />
                </div>
                <div style={{ flex: "0.2", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={labelStyle}>X:</label>
                    <input
                        type="number"
                        value={coordX}
                        onChange={(e) => handleFieldChange("coord_x", e.target.value === "" ? 0 : Number(e.target.value))}
                        style={{ ...getInputStyles(darkMode), textAlign: "center", MozAppearance: "textfield" }}
                        inputMode="numeric"
                    />
                </div>
                <div style={{ flex: "0.2", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={labelStyle}>Y:</label>
                    <input
                        type="number"
                        value={coordY}
                        onChange={(e) => handleFieldChange("coord_y", e.target.value === "" ? 0 : Number(e.target.value))}
                        style={{ ...getInputStyles(darkMode), textAlign: "center", MozAppearance: "textfield" }}
                        inputMode="numeric"
                    />
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                    width: "100%",
                    flexWrap: "nowrap",
                }}
            >
                <div style={{ flex: "0 0 16%", display: "flex", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold" }}>ID: {item.id}</span>
                </div>

                <div style={{ flex: "0 0 28%", display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
                    <label style={{ margin: 0 }}>Enabled:</label>
                    <label style={{ ...switchLabelStyles, margin: 0 }}>
                        <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={(e) => handleFieldChange("is_enabled", e.target.checked)}
                            style={{ display: "none" }}
                        />
                        <span
                            style={{
                                ...switchSliderStyles,
                                backgroundColor: isEnabled ? "#4caf50" : "#ccc",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    ...switchCircleStyles,
                                    transform: isEnabled ? "translateX(20px)" : "translateX(0px)",
                                }}
                            />
                        </span>
                    </label>
                </div>

                <div style={{ flex: "0 0 28%", display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
                    <label style={{ margin: 0 }}>Rendered:</label>
                    <div
                        style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: rendered ? "#4caf50" : "#d32f2f",
                        }}
                    />
                </div>

                <div style={{ flex: "0 0 28%", display: "flex", alignItems: "center", gap: "5px", justifyContent: "right" }}>
                    <label style={{ margin: 0 }}>Last Update:</label>
                    <span>{lastUpdate ? lastUpdate.toLocaleTimeString() : "—"}</span>
                </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                    style={{ ...getButtonStyles(darkMode), backgroundColor: "#4caf50", color: "#fff", flex: 1 }}
                    onClick={() => saveCallback({ ...item, name, coord_x: coordX, coord_y: coordY })}
                >
                    Save
                </button>
                {addChildCallback && (
                    <button
                        style={{ ...getButtonStyles(darkMode), backgroundColor: "#1976d2", color: "#fff", flex: 1 }}
                        onClick={addChildCallback}
                    >
                        + Add Chest
                    </button>
                )}
            </div>

            {/* Delete */}
            <div style={{ marginTop: "10px" }}>
                <button
                    style={{ ...getButtonStyles(darkMode), backgroundColor: "#d32f2f", color: "#fff", width: "100%" }}
                    onClick={() => setShowDeleteModal(true)}
                >
                    Delete
                </button>
            </div>

            <DeleteConfirmationModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                itemName={name || "<unnamed>"}
                itemType="machine"
                childrenList={childrenList}
                darkMode={darkMode}
            />
            <div style={{ marginTop: "15px" }}>
                <MachineHistoryPanel machineId={item.id} darkMode={darkMode} />
            </div>
        </div>
    );
}