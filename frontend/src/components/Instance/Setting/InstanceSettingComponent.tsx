import React from "react";
import AccessMenu from "./AccessMenu/AccessMenu";
import GraphsMenu from "./GraphsMenu/GraphsMenu";
import PowersMenu from "./PowersMenu/PowerMenu";
import NetworkingMenu from "./NetworkingMenu/NetworkingMenu";
import DestroyMenu from "./DestroyMenu/DestroyMenu";

const menus: { [key: string]: React.ComponentType } = {
  AccessMenu,
  GraphsMenu,
  PowersMenu,
  NetworkingMenu,
  DestroyMenu
};

const InstanceSettingComponent: React.FC<{ active: string }> = ({ active }) => {
  const ActiveMenu = menus[active] || null;
  return ActiveMenu ? <ActiveMenu /> : null;
};

export default InstanceSettingComponent;
