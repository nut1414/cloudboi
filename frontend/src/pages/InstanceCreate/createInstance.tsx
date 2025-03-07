import Footer from "../../components/Instance/Create/Footer";
import ChooseImageVersion from "../../components/Instance/Create/ChooseImageVersion";
import ChooseSizeCpu from "../../components/Instance/Create/ChooseSizeCpu";
import ChooseAuthenMethod from "../../components/Instance/Create/ChooseAuthenMethod";
import FinalizeDetails from "../../components/Instance/Create/FinalizeDetails";
import BillSummary from "../../components/Instance/Create/BillSummary";

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
