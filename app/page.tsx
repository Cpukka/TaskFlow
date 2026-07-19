// app/page.tsx
'use client'

import Link from 'next/link'
import { 
  FiArrowRight, 
  FiCheck, 
  FiZap, 
  FiShield, 
  FiUsers, 
  FiBarChart2,
  FiLayers,
  FiAward,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiGlobe,
  FiMoon,
  FiSun,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiFolder,
  FiCheckSquare,
  FiX
} from 'react-icons/fi'
import { useTheme } from '@/components/theme-provider'
import { useState } from 'react'

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const pricingPlans = [
    {
      name: 'Starter',
      price: {
        monthly: 0,
        yearly: 0
      },
      description: 'Perfect for individuals and small projects',
      features: [
        'Up to 3 projects',
        'Up to 10 tasks per project',
        'Basic task management',
        'Project timeline view',
        'Email support',
        '1 team member'
      ],
      notIncluded: [
        'Advanced analytics',
        'Custom fields',
        'API access',
        'Priority support'
      ],
      cta: 'Start Free',
      ctaLink: '/register',
      popular: false,
      color: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Pro',
      price: {
        monthly: 29,
        yearly: 290
      },
      description: 'Best for growing teams and businesses',
      features: [
        'Unlimited projects',
        'Unlimited tasks',
        'Advanced task management',
        'Gantt charts & calendar',
        'Team collaboration tools',
        'Priority email & chat support',
        'Up to 10 team members',
        'Advanced analytics',
        'Custom fields & workflows',
        'API access'
      ],
      notIncluded: [],
      cta: 'Start Free Trial',
      ctaLink: '/register?plan=pro',
      popular: true,
      color: 'from-blue-600 to-purple-600'
    },
    {
      name: 'Enterprise',
      price: {
        monthly: 99,
        yearly: 990
      },
      description: 'For large organizations with advanced needs',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'SSO & SAML authentication',
        'Advanced security controls',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom training & onboarding',
        'SLA guarantees',
        'On-premise deployment option'
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      popular: false,
      color: 'from-purple-600 to-pink-600'
    }
  ]

  const featuresComparison = [
    { feature: 'Projects', starter: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'Tasks per project', starter: '10', pro: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'Team members', starter: '1', pro: '10', enterprise: 'Unlimited' },
    { feature: 'Analytics', starter: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
    { feature: 'API access', starter: 'No', pro: 'Yes', enterprise: 'Yes' },
    { feature: 'Priority support', starter: 'No', pro: 'Yes', enterprise: '24/7' },
    { feature: 'Custom fields', starter: 'No', pro: 'Yes', enterprise: 'Yes' },
    { feature: 'SSO/SAML', starter: 'No', pro: 'No', enterprise: 'Yes' },
  ]

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Navigation - same as before */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FiLayers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Testimonials
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
              </button>
              
              <Link
                href="/login"
                className="hidden sm:inline-block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - same as before */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FiZap className="w-4 h-4" />
                New: AI-powered task management
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Streamline Your{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Workflow
                </span>{' '}
                with TaskFlow
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                The all-in-one project management platform that helps teams collaborate, 
                track progress, and deliver results faster than ever before.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                >
                  Start Free Trial
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#features"
                  className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  Learn More
                </Link>
              </div>
              
              <div className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Trusted by 10,000+ teams worldwide
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <FiFolder className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Project Alpha</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">12 tasks remaining</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                      In Progress
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Design System', progress: 80, color: 'bg-blue-600' },
                      { label: 'API Development', progress: 45, color: 'bg-purple-600' },
                      { label: 'Testing', progress: 30, color: 'bg-green-600' },
                      { label: 'Documentation', progress: 60, color: 'bg-orange-600' }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                          <span className="text-gray-500 dark:text-gray-400">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`${item.color} rounded-full h-2 transition-all duration-1000`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FiClock className="w-4 h-4" />
                      Due in 5 days
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800" />
                      ))}
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold">
                        +2
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-gray-700 animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <FiCheckSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">3 tasks done</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <FiTrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">+25% efficiency</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">This week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to help your team work better together and achieve more.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FiZap,
                title: 'Lightning Fast',
                description: 'Experience real-time updates and instant collaboration with zero lag.',
                color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              },
              {
                icon: FiShield,
                title: 'Enterprise Security',
                description: 'Bank-grade encryption and security protocols to keep your data safe.',
                color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              },
              {
                icon: FiUsers,
                title: 'Team Collaboration',
                description: 'Seamless communication and collaboration tools for distributed teams.',
                color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              },
              {
                icon: FiBarChart2,
                title: 'Advanced Analytics',
                description: 'Gain insights with powerful analytics and custom reporting dashboards.',
                color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
              },
              {
                icon: FiLayers,
                title: 'Project Templates',
                description: 'Kickstart your projects with professionally designed templates.',
                color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
              },
              {
                icon: FiAward,
                title: 'Mobile First',
                description: 'Access your work anywhere with our fully responsive mobile design.',
                color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PRICING SECTION - NEW */}
      <section id="pricing" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-transparent dark:from-blue-950/10 dark:via-purple-950/5 dark:to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FiAward className="w-4 h-4" />
              Pricing Plans
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose the Perfect{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Plan
              </span>{' '}
              for Your Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include a 14-day free trial.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300"
            >
              <div 
                className={`absolute top-1 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ${
                  billingCycle === 'yearly' ? 'right-1' : 'left-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Yearly
              <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                Save 20%
              </span>
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => {
              const isPopular = plan.popular
              const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly
              const priceLabel = billingCycle === 'monthly' ? '/month' : '/year'
              const isFree = price === 0

              return (
                <div 
                  key={idx}
                  className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border ${
                    isPopular 
                      ? 'border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/10 dark:shadow-blue-400/10' 
                      : 'border-gray-200 dark:border-gray-700'
                  } p-8`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        {isFree ? 'Free' : `$${price}`}
                      </span>
                      {!isFree && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                          {priceLabel}
                        </span>
                      )}
                    </div>
                    {!isFree && billingCycle === 'yearly' && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Save ${plan.price.monthly * 12 - plan.price.yearly}/year
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm">
                        <FiCheck className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm opacity-50">
                        <FiX className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-500 dark:text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.ctaLink}
                    className={`block w-full text-center px-6 py-3 rounded-xl font-medium transition-all ${
                      isPopular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  
                  {isFree && (
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                      No credit card required
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Features Comparison Table */}
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                Compare Features
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Starter</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400">Pro</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {featuresComparison.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {item.feature}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        {item.starter}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {item.pro}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white font-medium">
                        {item.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Have questions about our plans?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Contact our sales team
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join thousands of satisfied teams using TaskFlow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'CTO at TechCorp',
                image: 'SJ',
                content: 'TaskFlow has transformed how our team works. We\'ve seen a 40% increase in productivity since switching.'
              },
              {
                name: 'Michael Chen',
                role: 'Product Manager at StartupHub',
                image: 'MC',
                content: 'The intuitive interface and powerful features make TaskFlow the best project management tool I\'ve ever used.'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Team Lead at DesignStudio',
                image: 'ER',
                content: 'TaskFlow\'s collaboration features have made remote work seamless. Our team feels more connected than ever.'
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of teams already using TaskFlow to supercharge their productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-medium hover:shadow-xl hover:scale-105 transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-all backdrop-blur-sm"
            >
              Book a Demo
            </Link>
          </div>
          <p className="text-white/70 text-sm mt-6">
            No credit card required. Free 14-day trial.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiLayers className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                The modern project management platform for teams of all sizes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 TaskFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <Link href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <FiGithub className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <FiGlobe className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}