import { useEffect, useState } from 'react'

const PagePreloader = ({ loading = true, children }) => {
  const [show, setShow] = useState(loading)

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setShow(false), 300)
    } else {
      setShow(true)
    }
  }, [loading])

  if (!show && !loading) return children

  return (
    <>
      {show && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 transition-opacity duration-300 ${!loading ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-center">
            {/* Animated Logo */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center animate-bounce-in shadow-2xl">
                <span className="text-5xl animate-pulse">🧪</span>
              </div>
              {/* Orbiting Particles */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-primary-400 rounded-full -translate-x-1/2"></div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-secondary-400 rounded-full -translate-x-1/2"></div>
              </div>
            </div>

            {/* Loading Text */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-pulse">
              Samuel ChemLab
            </h2>
            <p className="text-gray-600 animate-pulse">Loading your chemistry journey...</p>

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse" 
                   style={{ width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
            </div>
          </div>
        </div>
      )}
      {!loading && (
        <div className="animate-slide-in-up">
          {children}
        </div>
      )}
    </>
  )
}

export default PagePreloader
