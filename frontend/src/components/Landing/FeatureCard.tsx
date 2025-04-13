// FeatureCard component update
import React from "react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div 
      className="bg-[#192A51] rounded-xl p-6 border border-blue-900/30 hover:bg-[#23375F] transition-colors"
      data-testid={`feature-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <span className="text-purple-500 block mb-4">{icon}</span>
      <h3 className="text-xl font-bold text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-300">
        {description}
      </p>
    </div>
  )
}

export default FeatureCard
