import React from "react"
import AccessMenu from "./AccessMenu"
import PowersMenu from "./PowerMenu"
import NetworkingMenu from "./NetworkingMenu"
import DestroyMenu from "./DestroyMenu"

interface InstanceSettingContentProps {
  active: string
}

const InstanceSettingContent: React.FC<InstanceSettingContentProps> = ({ active }) => {
  switch (active) {
    case "AccessMenu":
      return <AccessMenu />
    case "PowersMenu":
      return <PowersMenu />
    case "NetworkingMenu":
      return <NetworkingMenu />
    case "DestroyMenu":
      return <DestroyMenu />
    default:
      return <AccessMenu />
  }
}

export default InstanceSettingContent
