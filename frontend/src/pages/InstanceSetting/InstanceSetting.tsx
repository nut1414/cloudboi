import React,{useState} from "react";

import SettingWrapper from "../../components/Instance/Setting/SettingWarpper";
import InstanceSettingComponent from "../../components/Instance/Setting/InstanceSettingComponent";

const InstanceSetting: React.FC = () => {
    const [activeTab, setActiveTab] = useState("AccessMenu");

    return ( 
        <SettingWrapper active={activeTab} setActive={setActiveTab}>
            <InstanceSettingComponent active={activeTab} />
        </SettingWrapper>
    );
};

export default InstanceSetting;
