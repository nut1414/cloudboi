import React from "react";
import { PowerIcon, ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";
import Section from "../../../components/Common/Section";
import Button from "../../../components/Common/Button";
import MenuContainer from "./MenuContainer";

const PowerMenu: React.FC = () => {
    const handleTurnOff = () => {
        // Handle turn off
    };

    const handleRestart = () => {
        // Handle restart
    };

    return (
        <MenuContainer>
            <Section
                title="Power Management"
                icon={<PowerIcon className="w-5 h-5" />}
                description="Control the power state of your instance. Changes will take effect immediately."
            >
                <div className="flex space-x-4">
                    <Button
                        label="Turn Off Instance"
                        onClick={handleTurnOff}
                        variant="outline"
                        icon={<PowerIcon className="w-5 h-5" />}
                    />

                    <Button
                        label="Restart Instance"
                        onClick={handleRestart}
                        variant="outline"
                        icon={<ArrowPathIcon className="w-5 h-5" />}
                    />
                </div>
            </Section>
        </MenuContainer>
    );
};

export default PowerMenu;