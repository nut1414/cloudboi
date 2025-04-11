// components/Common/Section.tsx
import React, { ReactNode } from "react"

interface SectionProps {
  title: string
  icon: ReactNode
  description?: string
  children: ReactNode
  rightContent?: ReactNode
  className?: string
}

const Section: React.FC<SectionProps> = ({
  title,
  icon,
  description,
  children,
  rightContent,
  className = ""
}) => {
  return (
    <div className={`bg-[#192A51] rounded-xl p-6 border border-blue-900/30 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <span className="text-purple-400">{icon}</span>
            {title}
          </h2>
          {description && <p className="text-gray-300 mt-2">{description}</p>}
        </div>
        {rightContent}
      </div>
      {children}
    </div>
  )
}

export default Section
