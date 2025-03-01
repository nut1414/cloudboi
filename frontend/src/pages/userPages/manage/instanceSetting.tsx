import React,{useState} from "react";

import SettingWrapper from "../../../components/settingPageComponents/SettingWrapper";
import InstanceSettingComponent from "../../../components/settingPageComponents/InstanceSettingComponent";

const InstanceSetting: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    return ( 
        <SettingWrapper active={activeTab} setActive={setActiveTab}>
            <InstanceSettingComponent active={activeTab} />
        </SettingWrapper>
    );
};

export default InstanceSetting;
