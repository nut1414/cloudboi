import React from "react"
import Section from "../../components/Common/Section"
import {
  CloudIcon,
  ServerIcon,
  CpuChipIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline"
import HeroSection from "../../components/Landing/HeroSection"
import FeatureCard from "../../components/Landing/FeatureCard"
import CTASection from "../../components/Landing/CTASection"

const App: React.FC = () => {
  const features = [
    {
      icon: <ServerIcon className="h-12 w-12" />,
      title: "Flexible Deployments",
      description: "Launch and configure virtual machines, containers, or bare metal servers through our intuitive interface."
    },
    {
      icon: <CpuChipIcon className="h-12 w-12" />,
      title: "High Performance",
      description: "Get the computing power you need with our optimized infrastructure designed for performance."
    },
    {
      icon: <ShieldCheckIcon className="h-12 w-12" />,
      title: "Secure by Design",
      description: "Built with security in mind, our platform implements industry best practices to protect your workloads."
    }
  ]

  const platformFeatures = [
    {
      icon: <ServerIcon className="h-6 w-6" />,
      label: "Virtual machine management"
    },
    {
      icon: <CpuChipIcon className="h-6 w-6" />,
      label: "Bare metal provisioning"
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      label: "Security-focused infrastructure"
    }
  ]

  return (
    <>
      <div className="container mx-auto px-4 py-10">
        {/* Hero Section */}
        <HeroSection
          title="aksdjlaksjdlajsldjalksy"
          subtitle="Deploy Bare Metal and Virtual Machines with Ease."
          description="Our cloud platform simplifies infrastructure management
          for virtual machines, containers, and networking resources.
          Built with Metal as a Service (MAAS) technology, our solution
          provides the tools you need to deploy and scale effectively."
          primaryButton={{
            label: "Join the waitlist",
            href: "/register",
            variant: "purple"
          }}
          secondaryButton={{
            label: "Learn more",
            href: "/about",
            variant: "outline"
          }}
          platformFeatures={platformFeatures}
        />

        {/* Features Section */}
        <Section
          title="Platform Features"
          icon={<CloudIcon className="h-6 w-6" />}
          data-testid="features"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <CTASection
          title="Early Access Coming Soon"
          description="Be among the first to experience CloudBoi. Sign up for early access and updates on our launch."
          buttonProps={{
            label: "Join the waitlist",
            href: "/register",
            variant: "purple",
            className: "inline-block"
          }}
        />
      </div>
    </>
  )
}

export default App
