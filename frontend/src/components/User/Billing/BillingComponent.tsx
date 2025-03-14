import React from "react";
import OverviewMenu from "./OverviewMenu/OverviewMenu";
import HistoryMenu from "./HistoryMenu/HistoryMenu";
import TopUpMenu from "./TopUpMenu/TopUpMenu";

interface BillingComponentProps {
    active: string;
}

const menus: { [key: string]: React.ComponentType } = {
    OverviewMenu,
    HistoryMenu,
    TopUpMenu
};

const BillingComponent: React.FC<BillingComponentProps> = ({ active }) => {
    const ActiveMenu = menus[active] || null;
    return ActiveMenu ? <ActiveMenu /> : null;
};

export default BillingComponent;
