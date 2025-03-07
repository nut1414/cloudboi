import React from "react";

const EstimateUsagePaid: React.FC = () => {

    return (
        <>
              <div className="mt-10 bg-red-300  shadow-md h-[300px] w-[780px] rounded-2xl flex flex-col  justify-start items-start ">
              

              <div className=" mt-10  justify-center grid grid-cols-2 ">
                  <div className="bg-[#F5E6E8] shadow-md h-[180px] w-[200px] mt-4 ml-20  rounded-xl flex justify-center items-center ">
                      <p>Estimate Due</p>
                  </div>
                  <div>
                      <div className="bg-[#F5E6E8] shadow-md h-[80px] w-[250px] mt-4 ml-10  rounded-xl  flex justify-center items-center">
                         <p>Total Usage</p>
                      </div>
                      <div className="bg-[#F5E6E8] shadow-md h-[80px] w-[250px] mt-4 ml-10  rounded-xl  flex justify-center items-center">
                          <p>Total Paide</p>
                      </div>
                  </div>  
                 
                
              </div>
          </div>
        </>
    );
};

export default EstimateUsagePaid;
