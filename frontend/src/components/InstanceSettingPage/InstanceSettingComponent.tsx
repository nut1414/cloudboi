import React from "react";

import AccessMenu from "./AccessMenu/AccessMenu";
import GraphsMenu from "./GraphsMenu/GraphsMenu";
import PowersMenu from "./PowersMenu/PowerMenu";
import NetworkingMenu from "./NetworkingMenu/NetworkingMenu";
import DestroyMenu from "./DestroyMenu/DestroyMenu";

interface InstanceSettingComponentProps {
    active: number;
}

const InstanceSettingComponent: React.FC<InstanceSettingComponentProps> = ({ active }) => {

    return (
        <>
            {active === 0 &&
                (<>
                   <AccessMenu/>
                </>)
            }

            {active === 1 &&
                (<>
                  <GraphsMenu/>
                </>)
            }
            {active === 2 &&
                (<>
                    <PowersMenu />
                </>)
            }
            {active === 3 &&
                (<>
                    <NetworkingMenu/>
                </>)
            }
             {active === 4 &&
                (<>
                   <DestroyMenu/>
                </>)
            }
        </>
    );
};
export default InstanceSettingComponent;