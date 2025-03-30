// components/Common/Section.tsx
import React, { ReactNode } from "react"

interface SectionProps {
  title: string
  icon: ReactNode
  description?: string
  children: ReactNode
}

const Section: React.FC<SectionProps> = ({
  title,
  icon,
  description,
  children
}) => {
  return (
    <div className="bg-[#192A51] rounded-xl p-6 border border-blue-900/30">
      <h2 className="text-xl font-medium text-white flex items-center gap-2 mb-4">
        <span className="text-purple-400">{icon}</span>
        {title}
      </h2>
      {description && <p className="text-gray-300 mb-6">{description}</p>}
      {children}
    </div>
  )
}

export default Section
