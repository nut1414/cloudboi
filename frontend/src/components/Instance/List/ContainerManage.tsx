import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Instance } from "../../../tmp/type";

interface ContainerManageProps {
    instances: Instance[];
}

const ContainerManage: React.FC<ContainerManageProps> = ({ instances }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="max-h-[600px] overflow-y-auto">
            {instances.map(instance => (
                <div key={instance.id} className="grid grid-cols-6 text-black bg-red-300 mt-1 border-b py-2 px-4">
                    <span className="text-center">{instance.name}</span>
                    <span className="text-center">{instance.os}</span>
                    <span className="text-center">{instance.usage}</span>
                    <span className="text-center ml-8">{instance.type}</span>
                    <span className={`ml-8 text-center font-semibold ${instance.status === "Running" ? "text-green-500" : "text-red-500"}`}>
                        {instance.status}
                    </span>

                    <button
                        className="bg-[#D5C6E0] shadow-md text-black py-2 rounded-2xl"
                        onClick={() => navigate(`${location.pathname}/${instance.id}`)}
                    >
                        View Instance
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ContainerManage;
