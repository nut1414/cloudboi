import React from "react"
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
  return (
    <TabContentContainer>
      <div className={active === "AccessMenu" ? "block" : "hidden"}>
        <AccessMenu />
      </div>
      <div className={active === "PowersMenu" ? "block" : "hidden"}>
        <PowersMenu />
      </div>
      <div className={active === "NetworkingMenu" ? "block" : "hidden"}>
        <NetworkingMenu />
      </div>
      <div className={active === "MonitorMenu" ? "block" : "hidden"}>
        <MonitorMenu />
      </div>
      <div className={active === "DestroyMenu" ? "block" : "hidden"}>
        <DestroyMenu />
      </div>
    </TabContentContainer>
  )
}

export default InstanceSettingContent
