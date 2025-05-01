import React from "react"
import AccessMenu from "./AccessMenu"
import PowersMenu from "./PowerMenu"
import NetworkingMenu from "./NetworkingMenu"
import DestroyMenu from "./DestroyMenu"
import MonitorMenu from "./MonitorMenu"
import TabContentContainer from "../../Common/Tab/TabContentContainer"
import { UserInstanceResponse } from "../../../client"

interface InstanceSettingContentProps {
  active: string
  instance: UserInstanceResponse
  instanceState: any
  isInstanceRunning: boolean
  isInstanceStopped: boolean
  isLoading: boolean
  getInstanceStateAndUpdate: () => void
  startInstance: () => void
  stopInstance: () => void
  restartInstance: () => void
  deleteInstance: () => void
  resetPassword: (password: string) => void
}

const InstanceSettingContent: React.FC<InstanceSettingContentProps> = ({
  active,
  instance,
  instanceState,
  isInstanceRunning,
  isInstanceStopped,
  isLoading,
  getInstanceStateAndUpdate,
  startInstance,
  stopInstance,
  restartInstance,
  deleteInstance,
  resetPassword
}) => {
  return (
    <TabContentContainer>
      <div className={active === "AccessMenu" ? "block" : "hidden"}>
        <AccessMenu 
          instance={instance}
          isInstanceRunning={isInstanceRunning}
          resetPassword={resetPassword}
          isLoading={isLoading}
        />
      </div>
      <div className={active === "PowersMenu" ? "block" : "hidden"}>
        <PowersMenu 
          instance={instance}
          isInstanceRunning={isInstanceRunning}
          isInstanceStopped={isInstanceStopped}
          startInstance={startInstance}
          stopInstance={stopInstance}
          restartInstance={restartInstance}
          isLoading={isLoading}
        />
      </div>
      <div className={active === "NetworkingMenu" ? "block" : "hidden"}>
        <NetworkingMenu 
          instanceState={instanceState}
          isLoading={isLoading}
        />
      </div>
      <div className={active === "MonitorMenu" ? "block" : "hidden"}>
        <MonitorMenu 
          instanceState={instanceState}
          getInstanceStateAndUpdate={getInstanceStateAndUpdate}
          isLoading={isLoading}
        />
      </div>
      <div className={active === "DestroyMenu" ? "block" : "hidden"}>
        <DestroyMenu 
          instance={instance}
          deleteInstance={deleteInstance}
          isLoading={isLoading}
        />
      </div>
    </TabContentContainer>
  )
}

export default InstanceSettingContent
