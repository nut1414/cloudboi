// CTASection component update
import React from "react"
import Button, { ButtonProps } from "../Common/Button/Button"

interface CTASectionProps {
  title: string
  description: string
  buttonProps: ButtonProps
}

const CTASection: React.FC<CTASectionProps> = ({ title, description, buttonProps }) => {
  return (
    <section 
      className="bg-[#192A51] rounded-xl p-10 text-center border border-blue-900/30 mt-16"
      data-testid="cta-section"
    >
      <h2 className="text-3xl font-bold text-white mb-4" data-testid="cta-title">
        {title}
      </h2>
      <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto" data-testid="cta-description">
        {description}
      </p>
      <Button 
        label={buttonProps.label}
        href={buttonProps.href}
        variant={buttonProps.variant}
        className={buttonProps.className}
        data-testid="cta"
      />
    </section>
  )
}

export default CTASection
