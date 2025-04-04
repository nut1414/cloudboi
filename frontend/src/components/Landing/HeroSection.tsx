// HeroSection component update
import React from "react"
import { CloudIcon } from "@heroicons/react/24/outline"
import Button, { ButtonProps } from "../Common/Button/Button"

interface FeatureItem {
  icon: React.ReactNode
  label: string
}

interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  primaryButton: ButtonProps
  secondaryButton: ButtonProps
  platformFeatures: FeatureItem[]
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  platformFeatures
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
      <div className="md:w-1/2">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-6">
          {subtitle}
        </p>
        <p className="text-lg text-gray-300 mb-8">
          {description}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button 
            label={primaryButton.label}
            href={primaryButton.href}
            variant={primaryButton.variant}
          />
          <Button 
            label={secondaryButton.label}
            href={secondaryButton.href}
            variant={secondaryButton.variant}
          />
        </div>
      </div>
      <div className="md:w-1/2">
        <PlatformCard features={platformFeatures} />
      </div>
    </div>
  )
}

const PlatformCard: React.FC<{ features: FeatureItem[] }> = ({ features }) => {
  return (
    <div className="bg-[#192A51] rounded-xl overflow-hidden shadow-xl border border-blue-900/30">
      <div className="p-6">
        <CloudIcon className="h-16 w-16 text-purple-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">CloudBoi Platform</h2>
        <p className="text-gray-300">
          Take control of your infrastructure with our intuitive dashboard.
        </p>
      </div>
      <div className="bg-[#23375F] p-6 border-t border-blue-900/30">
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-purple-500 flex-shrink-0 mt-1">{feature.icon}</span>
              <span className="text-white">{feature.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default HeroSection
