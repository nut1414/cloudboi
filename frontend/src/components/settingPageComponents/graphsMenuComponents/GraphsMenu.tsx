import React from "react";

import InstanceConsoleGraphs from "./InstanceConsole";
import CpuUsageGraph from "./CpuUsageGraph";


const GraphsMenu: React.FC = () => {

    return (
        <>
            <InstanceConsoleGraphs />
            <CpuUsageGraph />
        </>
    );
};
export default GraphsMenu;
