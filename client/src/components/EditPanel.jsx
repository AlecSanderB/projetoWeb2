import React from "react";
import FactoryEditPanel from "./FactoryEditPanel";
import MachineEditPanel from "./MachineEditPanel";
import ChestEditPanel from "./ChestEditPanel";

export default function EditPanel(props) {
  const { type } = props;

  if (type === "factory") return <FactoryEditPanel {...props} />;
  if (type === "machine") return <MachineEditPanel {...props} />;
  if (type === "chest") return <ChestEditPanel {...props} />;

  return null;
}