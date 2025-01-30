import SettingWrapper from "../../components/settingPageComponents/SettingWrapper";
import InstanceConsole from "../../components/settingPageComponents/accessPageComponents/InstanceConsole";
import ResetRootPassword from "../../components/settingPageComponents/accessPageComponents/ResetRootPassword";

function AccessPage() {

    return (
        <>
            <SettingWrapper>
                <InstanceConsole />
                <ResetRootPassword />
            </SettingWrapper>
        </>)

} export default AccessPage;