import React from "react"
import OverviewMenu from "./OverviewMenu"
import HistoryMenu from "./HistoryMenu"
import TopUpMenu from "./TopUpMenu"
import TabContentContainer from "../../Common/Tab/TabContentContainer"

interface UserBillingContentProps {
  active: string
}

const UserBillingContent: React.FC<UserBillingContentProps> = ({ active }) => {
  return (
    <TabContentContainer>
      <div className={active === "OverviewMenu" ? "block" : "hidden"}>
        <OverviewMenu />
      </div>
      <div className={active === "HistoryMenu" ? "block" : "hidden"}>
        <HistoryMenu />
      </div>
      <div className={active === "TopUpMenu" ? "block" : "hidden"}>
        <TopUpMenu />
      </div>
    </TabContentContainer>
  )
}

export default UserBillingContent