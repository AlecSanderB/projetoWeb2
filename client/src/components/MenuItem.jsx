import React, { useEffect, useState } from "react";
import { getMenuRowStyle, getMenuButtonStyle, getMenuItemStyle } from "../styles/Styles";

export default function MenuItem({
  item,
  type,
  childrenItems = [],
  selectItem,
  collapsedMap,
  setCollapsedMap,
  darkMode,
  selectedItem,
  level = 0,
}) {
  const itemIdStr = String(item.id);
  const [isExpanded, setIsExpanded] = useState(!collapsedMap[itemIdStr]);
  const hasChildren = childrenItems.length > 0;

  const isSelected = selectedItem?.type === type && String(selectedItem?.id) === itemIdStr;

  const hasSelectedDescendant = childrenItems.some(child => {
    const childIdStr = String(child.id);
    if (selectedItem?.type === child.type && String(selectedItem.id) === childIdStr) return true;
    if (child.children) return child.children.some(gc => selectedItem?.type === gc.type && String(selectedItem.id) === String(gc.id));
    return false;
  });

  useEffect(() => {
    if (hasChildren && hasSelectedDescendant) {
      setIsExpanded(true);
      setCollapsedMap(itemIdStr, false);
    }
  }, [hasSelectedDescendant]);

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
      setCollapsedMap(itemIdStr, isExpanded);
    }
  };

  const handleSelect = () => selectItem({ ...item, type, id: itemIdStr });

  const displayName = item.name?.trim() || item.item_name?.trim() || "<unnamed>";

  const uniqueChildren = Array.from(new Map(childrenItems.map(c => [c.id, c])).values());

  return (
    <div>
      <div style={getMenuRowStyle(level)}>
        <button
          onClick={handleToggle}
          style={getMenuButtonStyle(hasChildren, isSelected, hasSelectedDescendant, darkMode)}
        >
          {hasChildren ? (isExpanded ? "▼" : "▶") : <span style={{ display: "inline-block", width: "14px" }} />}
        </button>

        <span onClick={handleSelect} style={getMenuItemStyle(isSelected, hasSelectedDescendant, darkMode)}>
          {type === "factory" ? "🏭 " : type === "machine" ? "⚙️ " : "📦 "}
          {type === "chest" && item.amount != null ? `(${item.amount}) ` : ""}
          {displayName}
        </span>
      </div>

      {hasChildren && isExpanded &&
        uniqueChildren.map(child => (
          <MenuItem
            key={child.tempId || child.id}
            item={child}
            type={child.type}
            childrenItems={child.children || []}
            selectItem={selectItem}
            collapsedMap={collapsedMap}
            setCollapsedMap={setCollapsedMap}
            darkMode={darkMode}
            selectedItem={selectedItem}
            level={level + 1}
          />
        ))}
    </div>
  );
}