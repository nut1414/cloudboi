import React from "react"

function Billing() {
    return (
        <div className="absolute top-4 left-80 z-0 ">
            <div className="flex flex-col  justify-start items-start">
                <p className=" text-5xl">Billing</p>
            </div>
        </div>
    )
}

export default React.memo(Billing)