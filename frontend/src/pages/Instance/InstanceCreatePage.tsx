import React, { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ChooseOsImageSection from "../../components/Instance/Create/ChooseOsImageSection"
import ChooseSubscriptionPlanSection from "../../components/Instance/Create/ChooseSubscriptionPlanSection"
import SetAuthSection from "../../components/Instance/Create/SetAuthSection"
import SetHostnameSection from "../../components/Instance/Create/SetHostnameSection"
import BillSummarySection from "../../components/Instance/Create/BillSummarySection"
import { useInstanceCreate } from "../../hooks/Instance/useInstanceCreate"
import { ArrowPathIcon, RocketLaunchIcon } from "@heroicons/react/24/outline"
import Button from "../../components/Common/Button" // Import the Button component

function InstanceCreatePage() {
    const { userName } = useParams<{ userName: string }>()
    const navigate = useNavigate()
    const { 
        instanceDetails,
        formData,
        isLoading,
        error,
        isSubmitting,
        isFormValid,
        handleInstancePlanSelect,
        handleRootPasswordChange,
        handleInstanceNameChange,
        createInstance,
        // OS image selection state and handlers
        selectedImageName,
        selectedVersion,
        uniqueImageNames,
        availableVersions,
        handleImageNameSelect,
        handleVersionSelect
    } = useInstanceCreate()

    // Show error alert when error state changes
    React.useEffect(() => {
        if (error) {
            alert(`Error: ${error}`)
        }
    }, [error])

    const handleSubmit = async () => {
        const result = await createInstance()
        
        if (result && result.success) {
            alert("Instance created successfully!")
            // Redirect to instances list page after successful creation
            navigate(`/user/${userName}/instance`)
        }
    }

    // Loading state UI
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full w-full">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-6 w-36 bg-blue-800/30 rounded mb-4"></div>
                    <div className="h-4 w-64 bg-blue-800/30 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <h1 className="text-3xl font-bold text-white">Create Instance</h1>
            </div>
            
            <div className="space-y-10">
                {instanceDetails && (
                    <>
                        <ChooseOsImageSection 
                            osImages={instanceDetails.os_image} 
                            selectedOsType={formData.os_type}
                            selectedImageName={selectedImageName}
                            selectedVersion={selectedVersion}
                            uniqueImageNames={uniqueImageNames}
                            availableVersions={availableVersions}
                            onImageNameSelect={handleImageNameSelect}
                            onVersionSelect={handleVersionSelect}
                        />
                        
                        <ChooseSubscriptionPlanSection 
                            instancePackages={instanceDetails.instance_package}
                            selectedInstanceType={formData.instance_plan}
                            onSelect={handleInstancePlanSelect}
                        />
                        
                        <SetAuthSection 
                            password={formData.root_password || ''}
                            onPasswordChange={handleRootPasswordChange}
                        />
                        
                        <SetHostnameSection 
                            hostname={formData.instance_name || ''}
                            onHostnameChange={handleInstanceNameChange}
                        />
                        
                        <BillSummarySection 
                            selectedPackage={formData.instance_plan}
                            selectedOs={formData.os_type}
                            instanceName={formData.instance_name}
                        />
                        
                        <div className="py-4">
                            <Button 
                                label={isSubmitting ? "Creating Instance..." : "Launch Instance"}
                                onClick={handleSubmit}
                                variant="purple"
                                className={`py-3 ${!isFormValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                icon={isSubmitting ? 
                                    <ArrowPathIcon className="w-5 h-5 animate-spin" />: 
                                    <RocketLaunchIcon className="w-5 h-5" />
                                }
                                disabled={!isFormValid || isSubmitting}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default React.memo(InstanceCreatePage)