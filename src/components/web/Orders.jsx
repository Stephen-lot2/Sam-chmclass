import { useState } from 'react'
import WebSidebar from './WebSidebar'
import WebHeader from './WebHeader'
import { Check, Crown, Zap, Star, Download } from 'lucide-react'

const subscriptionPlans = [
  {
    id: 1,
    name: 'Basic',
    price: 9.99,
    period: 'month',
    features: ['Access to 5 courses', 'Basic support', 'Mobile app access', 'Course certificates'],
    color: 'gray',
    icon: Star
  },
  {
    id: 2,
    name: 'Pro',
    price: 19.99,
    period: 'month',
    features: ['Access to all courses', 'Priority support', 'Live classes', 'Downloadable materials', 'Course certificates', 'Progress tracking'],
    color: 'primary',
    icon: Zap,
    popular: true
  },
  {
    id: 3,
    name: 'Premium',
    price: 29.99,
    period: 'month',
    features: ['Everything in Pro', '1-on-1 tutoring sessions', 'Exam preparation', 'Career guidance', 'Lifetime access', 'Custom learning path'],
    color: 'secondary',
    icon: Crown
  },
]

const orderHistory = [
  { id: 1, plan: 'Pro Plan', date: 'Jan 15, 2026', amount: 19.99, status: 'completed' },
  { id: 2, plan: 'Basic Plan', date: 'Dec 15, 2025', amount: 9.99, status: 'completed' },
  { id: 3, plan: 'Pro Plan', date: 'Nov 15, 2025', amount: 19.99, status: 'completed' },
]

const Orders = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')

  return (
    <div className="flex">
      <WebSidebar />
      
      <div className="flex-1 ml-64">
        <WebHeader title="Orders & Subscriptions" />
        
        <div className="p-8">
          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-soft'
                    : 'text-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-soft'
                    : 'text-gray-600'
                }`}
              >
                Yearly <span className="text-success-600 text-xs ml-1">(Save 20%)</span>
              </button>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            {subscriptionPlans.map((plan) => {
              const Icon = plan.icon
              const iconBgClass = plan.color === 'primary' ? 'bg-primary-100' :
                                 plan.color === 'secondary' ? 'bg-secondary-100' :
                                 'bg-gray-100'
              const iconColorClass = plan.color === 'primary' ? 'text-primary-600' :
                                    plan.color === 'secondary' ? 'text-secondary-600' :
                                    'text-gray-600'
              
              return (
                <div
                  key={plan.id}
                  className={`card relative ${
                    plan.popular ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </div>
                  )}

                  <div className={`w-12 h-12 ${iconBgClass} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${iconColorClass}`} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-xl font-medium transition-colors ${
                      plan.popular
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Choose Plan
                  </button>
                </div>
              )
            })}
          </div>

          {/* Order History */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Order History</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-900">#{order.id.toString().padStart(6, '0')}</td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.plan}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{order.date}</td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">${order.amount}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-success-100 text-success-700">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-primary-600 hover:text-primary-700">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
