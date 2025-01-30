import SettingWrapper from "../../components/settingPageComponents/SettingWrapper";
import CpuUsageGraph from "../../components/settingPageComponents/graphsPageComponents/CpuUsageGraph";
import InstanceConsoleGraphs from "../../components/settingPageComponents/graphsPageComponents/InstanceConsole";

function GraphsPage() {


    return (<>
        <SettingWrapper>
            <InstanceConsoleGraphs />
            <CpuUsageGraph />
        </SettingWrapper>
    </>)


} export default GraphsPage;