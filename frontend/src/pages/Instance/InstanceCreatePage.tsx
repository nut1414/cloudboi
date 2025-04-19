// InstanceCreatePage.tsx
import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import ChooseOsImageSection from "../../components/Instance/Create/ChooseOsImageSection"
import ChooseSubscriptionPlanSection from "../../components/Instance/Create/ChooseSubscriptionPlanSection"
import SetAuthSection from "../../components/Instance/Create/SetAuthSection"
import SetHostnameSection from "../../components/Instance/Create/SetHostnameSection"
import BillSummarySection from "../../components/Instance/Create/BillSummarySection"
import { useInstanceCreate } from "../../hooks/Instance/useInstanceCreate"
import { ArrowPathIcon, PlusCircleIcon, RocketLaunchIcon } from "@heroicons/react/24/outline"
import Button from "../../components/Common/Button/Button"
import SkeletonLoader from "../../components/Common/SkeletonLoader"
import Section from "../../components/Common/Section"
import PageContainer from "../../components/Layout/PageContainer"

const InstanceCreatePage: React.FC = () => {
    const { userName } = useParams<{ userName: string }>()
    const navigate = useNavigate()
    const { 
        instanceDetails,
        formValues,
        isLoading,
        isSubmitting,
        isFormValid,
        handleInstancePlanSelect,
        handleRootPasswordChange,
        handleInstanceNameChange,
        handleSubmitCreateInstance,
        selectedImageName,
        selectedVersion,
        uniqueImageNames,
        availableVersions,
        handleImageNameSelect,
        handleVersionSelect
    } = useInstanceCreate()

    // Loading state UI
    if (isLoading) {
        return (
            <PageContainer 
                title={<SkeletonLoader height="h-8" width="w-64" />}
            >
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
            </PageContainer>
        )
    }

    // Submit button for the form
    const submitButton = (
        <div className="py-4">
            <Button 
                label={isSubmitting ? "Creating Instance..." : "Launch Instance"}
                onClick={handleSubmitCreateInstance}
                variant="purple"
                className={`py-3 ${!isFormValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                icon={isSubmitting ? 
                    <ArrowPathIcon className="w-5 h-5 animate-spin" /> : 
                    <RocketLaunchIcon className="w-5 h-5" />
                }
                disabled={!isFormValid || isSubmitting}
                data-testid="instance-create-page-submit"
            />
        </div>
    )

    return (
        <PageContainer 
            title="Create Instance"
            subtitle="Configure your new cloud instance"
            subtitleIcon={<PlusCircleIcon className="w-4 h-4" />}
        >
            {instanceDetails && (
                <>
                    <ChooseOsImageSection 
                        osImages={instanceDetails.os_image} 
                        selectedOsType={formValues.os_type}
                        selectedImageName={selectedImageName}
                        selectedVersion={selectedVersion}
                        uniqueImageNames={uniqueImageNames}
                        availableVersions={availableVersions}
                        onImageNameSelect={handleImageNameSelect}
                        onVersionSelect={handleVersionSelect}
                    />
                    
                    <ChooseSubscriptionPlanSection 
                        instancePackages={instanceDetails.instance_package}
                        selectedInstanceType={formValues.instance_plan}
                        onSelect={handleInstancePlanSelect}
                    />
                    
                    <SetAuthSection 
                        password={formValues.root_password || ''}
                        onPasswordChange={handleRootPasswordChange}
                    />
                    
                    <SetHostnameSection 
                        hostname={formValues.instance_name || ''}
                        onHostnameChange={handleInstanceNameChange}
                    />
                    
                    <BillSummarySection 
                        selectedPackage={formValues.instance_plan}
                        selectedOs={formValues.os_type}
                        instanceName={formValues.instance_name}
                    />
                    
                    {submitButton}
                </>
            )}
        </PageContainer>
    )
}

export default React.memo(InstanceCreatePage)
