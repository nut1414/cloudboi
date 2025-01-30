import SettingWrapper from "../../components/settingPageComponents/SettingWrapper";
import PrivateNetwork from "../../components/settingPageComponents/networkingPageComponents/PrivateNetwork";
import PublicNetwork from "../../components/settingPageComponents/networkingPageComponents/PublicNetwork";


function NetworkingPage() {

    return (<>
        <SettingWrapper>
            <div className="mt-8 bg-red-300 mb-10 shadow-md h-[550px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
                <PrivateNetwork />
                <PublicNetwork />
            </div>
        </SettingWrapper>
    </>)


} export default NetworkingPage;