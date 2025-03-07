import React from "react";

import OverviewMenu from "./OverviewMenu/OverviewMenu";
import HistoryMenu from "./HistoryMenu/HistoryMenu";
import TopUpMenu from "./TopUpMenu/TopUpMenu";

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