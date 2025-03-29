import React from "react";

import TurnOff from "./TurnOff";

const PowersMenu: React.FC = () => {

  const handleTurnOff = () => {
        
  };

    return (
        <>
          <TurnOff onTurnOff={handleTurnOff} />
        </>
    );
};
export default PowersMenu;
