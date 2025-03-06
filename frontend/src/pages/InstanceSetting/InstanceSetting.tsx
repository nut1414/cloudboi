import React,{useState} from "react";

import SettingWrapper from "../../components/InstanceSettingPage/SettingWarpper";
import InstanceSettingComponent from "../../components/InstanceSettingPage/InstanceSettingComponent";

const InstanceSetting: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    return ( 
        <SettingWrapper active={activeTab} setActive={setActiveTab}>
            <InstanceSettingComponent active={activeTab} />
        </SettingWrapper>
    );
};

export default InstanceSetting;
