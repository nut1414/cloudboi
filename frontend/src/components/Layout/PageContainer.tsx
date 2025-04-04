import React, { ReactNode } from "react"

interface PageContainerProps {
  title: ReactNode
  subtitle?: string
  subtitleIcon?: ReactNode
  children: ReactNode
  rightContent?: ReactNode
  maxWidth?: string
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  subtitleIcon,
  children,
  rightContent,
  maxWidth = "max-w-[1200px]",
}) => {
  return (
    <div className={`p-8 w-full ${maxWidth} mx-auto`}>
      {/* Header with title and optional right content */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {typeof title === 'string' ? (
            <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
          ) : (
            title
          )}
          {subtitle && (
            <div className="flex items-center text-gray-400 text-sm">
              {subtitleIcon && <span className="mr-2">{subtitleIcon}</span>}
              <span>{subtitle}</span>
            </div>
          )}
        </div>
        
        {rightContent && (
          <div>
            {rightContent}
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="space-y-10">
        {children}
      </div>
    </div>
  )
}

export default PageContainer