import React from "react";

import OverviewMenu from "./overviewMenuComponent/OverviewMenu";
import HistoryMenu from "./historyMenuComponent/HistoryMenu";
import TopUpMenu from "./top_upMenuComponent/Top-UpMenu";

interface BillingComponentProps {
    active: number;
}

const BillingComponent: React.FC<BillingComponentProps> = ({ active }) => {

    return (
        <>
         {active === 0 &&
                (<>
                   <OverviewMenu/>
                </>)
            }
          {active === 1 &&
                (<>
                   <HistoryMenu/>
                </>)
            }
              {active === 2 &&
                (<>
                   <TopUpMenu/>
                </>)
            }

        </>
    );
};
export default BillingComponent;