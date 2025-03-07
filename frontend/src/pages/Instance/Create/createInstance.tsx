// CreateInstance.tsx
import React, { useState, useEffect } from "react";
import Footer from "../../../components/Instance/Create/Footer";
import ChooseImageVersion from "../../../components/Instance/Create/ChooseImageVersion";
import ChooseSizeCpu from "../../../components/Instance/Create/ChooseSizeCpu";
import ChooseAuthenMethod from "../../../components/Instance/Create/ChooseAuthenMethod";
import FinalizeDetails from "../../../components/Instance/Create/FinalizeDetails";
import BillSummary from "../../../components/Instance/Create/BillSummary";
import { InstanceDetails, OsType, InstanceType, InstanceCreateRequest } from "../../../tmp/type";
import { placeholderInstanceDetails } from "../../../constant/PlaceHolderData";
// Placeholder data for development

function CreateInstance() {
    const [loading, setLoading] = useState<boolean>(true);
    const [instanceDetails, setInstanceDetails] = useState<InstanceDetails | null>(null);
    const [formData, setFormData] = useState<Partial<InstanceCreateRequest>>({});
    
    // Simulate fetching instance details from backend
    useEffect(() => {
        // Simulate network delay
        const timer = setTimeout(() => {
            setInstanceDetails(placeholderInstanceDetails);
            setLoading(false);
        }, 800); // Simulated 800ms delay
        
        return () => clearTimeout(timer);
    }, []);
    
    // Update form data handlers
    const handleOsTypeSelect = (osType: OsType) => {
        setFormData(prev => ({ ...prev, os_type: osType }));
    };
    
    const handleInstanceTypeSelect = (instanceType: InstanceType) => {
        setFormData(prev => ({ ...prev, instance_type: instanceType }));
    };
    
    const handleRootPasswordChange = (password: string) => {
        setFormData(prev => ({ ...prev, root_password: password }));
    };
    
    const handleHostnameChange = (hostname: string) => {
        setFormData(prev => ({ ...prev, instance_name: hostname }));
    };
    
    const handleSubmit = async () => {
        try {
            // Validate form data
            if (!formData.os_type || !formData.instance_type || !formData.instance_name || !formData.root_password) {
                alert("Please fill all required fields");
                return;
            }
            
            // Simulate submitting to backend
            console.log("Instance creation request:", JSON.stringify(formData, null, 2));
            alert("Form submitted! Check console for details.");
            // In a real app, you would make an API call here
        } catch (error) {
            console.error("Failed to create instance:", error);
            alert("Error submitting form. See console for details.");
        }
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-6 w-36 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }
    
    return (
        <>
            <div className="text-black absolute top-4 left-80 z-0">
                <div className="flex flex-col justify-start items-start">
                    <p className="text-5xl">Create Instance</p>
                    
                    {instanceDetails && (
                        <>
                            <ChooseImageVersion 
                                osImages={instanceDetails.os_image} 
                                selectedOsType={formData.os_type}
                                onSelect={handleOsTypeSelect}
                            />
                            
                            <ChooseSizeCpu 
                                instancePackages={instanceDetails.instance_package}
                                selectedInstanceType={formData.instance_type}
                                onSelect={handleInstanceTypeSelect}
                            />
                            
                            <ChooseAuthenMethod 
                                password={formData.root_password || ''}
                                onPasswordChange={handleRootPasswordChange}
                            />
                            
                            <FinalizeDetails 
                                hostname={formData.instance_name || ''}
                                onHostnameChange={handleHostnameChange}
                            />
                            
                            <BillSummary 
                                selectedPackage={formData.instance_type}
                                selectedOs={formData.os_type}
                                instanceName={formData.instance_name}
                            />
                            
                            <div className="mt-6 mb-40">
                                <button 
                                    onClick={handleSubmit}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create Instance
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default CreateInstance;