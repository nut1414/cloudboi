import Footer from "../../components/InstanceCreatePage/Footer";
import ChooseImageVersion from "../../components/InstanceCreatePage/ChooseImageVersion";
import ChooseSizeCpu from "../../components/InstanceCreatePage/ChooseSizeCpu";
import ChooseAuthenMethod from "../../components/InstanceCreatePage/ChooseAuthenMethod";
import FinalizeDetails from "../../components/InstanceCreatePage/FinalizeDetails";
import BillSummary from "../../components/InstanceCreatePage/BillSummary";

function CreateInstance() {
   
    return (
        <>
            
            <div className="  text-black absolute top-4 left-80 z-0 ">
                <div className="flex flex-col  justify-start items-start">

                    <p className=" text-5xl">Create _______</p>                  
                    <ChooseImageVersion/>
                    <ChooseSizeCpu/>
                    <ChooseAuthenMethod/>
                    <FinalizeDetails/>
                    <BillSummary/>                  
                </div>
            </div>
     
            <Footer/>
           
        </>
    );
}

export default CreateInstance;
