import React, { useMemo } from "react"
import OverviewMenu from "./OverviewMenu"
import HistoryMenu from "./HistoryMenu"
import TopUpMenu from "./TopUpMenu"
import TabContentContainer from "../../Common/Tab/TabContentContainer"

interface UserBillingContentProps {
  active: string
}

const UserBillingContent: React.FC<UserBillingContentProps> = ({ active }) => {
  const activeMenu = useMemo(() => {
    switch (active) {
      case "HistoryMenu":
        return <HistoryMenu />
      case "TopUpMenu":
        return <TopUpMenu />
      case "OverviewMenu":
      default:
        return <OverviewMenu />
    }
  }, [active])

  return <TabContentContainer>{activeMenu}</TabContentContainer>
}

export default UserBillingContent