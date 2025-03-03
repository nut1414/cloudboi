import React from "react"

import InstanceTerminal from "../../components/Instance/InstanceTerminal"
import { useParams } from "react-router-dom"


const Setting: React.FC = () => {
    const instanceName = useParams<{ instanceName: string }>().instanceName || ''
    const apiBaseUrl = 'ws://localhost:8000'
    
    return (
        <div className="text-black absolute top-4 left-80 z-0">
            <div className="flex flex-col  justify-start items-start">
                <p className=" text-5xl">Setting</p>
                <InstanceTerminal
                    instanceName={instanceName}
                    apiBaseUrl={apiBaseUrl}
                />
            </div>
        </div>
    )
}

export default React.memo(Setting)