import SidebarWrapper from "../components/sidebar/SidebarWrapper";
import Footer from "../components/createInstancePageComponents/Footer";
import ChooseImageVersion from "../components/createInstancePageComponents/ChooseImageVersion";
import ChooseSizeCpu from "../components/createInstancePageComponents/ChooseSizeCpu";
import ChooseAuthenMethod from "../components/createInstancePageComponents/ChooseAuthenMethod";
import FinalizeDetails from "../components/createInstancePageComponents/FinalizeDetails";
import BillSummary from "../components/createInstancePageComponents/BillSummary";

function CreateInstance() {
   
    return (
        <>
            <SidebarWrapper>
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
            </SidebarWrapper>
        </>
    );
}

export default CreateInstance;
