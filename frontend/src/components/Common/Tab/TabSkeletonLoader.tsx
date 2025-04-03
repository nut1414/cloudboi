import SkeletonLoader from "../SkeletonLoader"

interface TabSkeletonLoaderProps {
    count?: number
}

const TabSkeletonLoader: React.FC<TabSkeletonLoaderProps> = ({
    count = 5,
}) => {
    return (
        <>
            {/* Navigation Tabs Skeleton */}
            <div className="border-b border-blue-900/30 mb-6">
                <nav className="flex -mb-px">
                    {Array(count).fill(0).map((_, index) => (
                        <div
                            key={index}
                            className="mr-8 py-3 flex items-center"
                        >
                            <SkeletonLoader height="h-5" width="w-5" rounded="rounded-md" className="mr-2" />
                            <SkeletonLoader height="h-5" width="w-16" />
                        </div>
                    ))}
                </nav>
            </div>

            {/* Content Area Skeleton */}
            <div className="space-y-6">
                {/* Form Fields Skeleton */}
                <div className="space-y-4">
                    <SkeletonLoader height="h-10" rounded="rounded-md" />
                    <SkeletonLoader height="h-10" rounded="rounded-md" />
                    <SkeletonLoader height="h-10" rounded="rounded-md" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="pt-4 flex space-x-3">
                    <SkeletonLoader height="h-10" width="w-32" rounded="rounded-md" />
                    <SkeletonLoader height="h-10" width="w-32" rounded="rounded-md" />
                </div>
            </div>
        </>
    )
}

export default TabSkeletonLoader