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
import SkeletonLoader from "../../components/Common/SkeletonLoader"
import Section from "../../components/Common/Section"

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
            <div className="p-6 w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <SkeletonLoader height="h-8" width="w-64" />
                </div>
                
                <div className="space-y-10">
                    {/* Just one section with skeleton content */}
                    <Section 
                        title="" 
                        icon={<SkeletonLoader height="h-5" width="w-5" rounded="rounded-full" />}
                    >
                        <div className="space-y-4">
                            <SkeletonLoader height="h-10" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <SkeletonLoader height="h-20" rounded="rounded-lg" />
                                <SkeletonLoader height="h-20" rounded="rounded-lg" />
                                <SkeletonLoader height="h-20" rounded="rounded-lg" />
                            </div>
                        </div>
                    </Section>
                    
                    {/* Button skeleton */}
                    <div className="py-4">
                        <SkeletonLoader height="h-12" width="w-48" />
                    </div>
                </div>
            </div>
        );
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