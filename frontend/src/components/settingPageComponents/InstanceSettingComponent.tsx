import React from "react";

import AccessMenu from "./accessMenuComponents/accessMenu";
import GraphsMenu from "./graphsMenuComponents/GraphsMenu";
import PowersMenu from "./powersMenuComponents/PowersMenu";
import NetworkingMenu from "./networkingMenuComponents/NetworkingMenu";
import DestroyMenu from "./destroyMenuComponents/destroyMenu";

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