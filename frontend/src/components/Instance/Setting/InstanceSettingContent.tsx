import React, { useMemo } from "react"
import AccessMenu from "./AccessMenu"
import PowersMenu from "./PowerMenu"
import NetworkingMenu from "./NetworkingMenu"
import DestroyMenu from "./DestroyMenu"
import MonitorMenu from "./MonitorMenu"
import TabContentContainer from "../../Common/Tab/TabContentContainer"

interface InstanceSettingContentProps {
  active: string
}

const InstanceSettingContent: React.FC<InstanceSettingContentProps> = ({ active }) => {
  const activeMenu = useMemo(() => {
    switch (active) {
      case "AccessMenu":
        return <AccessMenu />
      case "PowersMenu":
        return <PowersMenu />
      case "NetworkingMenu":
        return <NetworkingMenu />
      case "MonitorMenu":
        return <MonitorMenu />
      case "DestroyMenu":
        return <DestroyMenu />
      default:
        return <AccessMenu />
    }
  }, [active])

  return <TabContentContainer>{activeMenu}</TabContentContainer>
}

export default InstanceSettingContent
