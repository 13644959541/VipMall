import React, { lazy, Suspense, useState, useEffect } from 'react'

const HomeMobile = lazy(() => import('@/pages/HomeMobile'))
const HomePad = lazy(() => import('@/pages/HomePad'))

const HomeWrapper = () => {
  const [deviceType, setDeviceType] = useState(
    window.innerWidth < 768 ? 'mobile' : 
    window.innerWidth <= 1024 ? 'pad' : 'desktop'
  )

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setDeviceType(
        width < 768 ? 'mobile' : 
        width <= 1024 ? 'pad' : 'desktop'
      )
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Suspense fallback={null}>
      {deviceType === 'mobile' ? <HomeMobile /> : <HomePad />}
    </Suspense>
  )
}

export default HomeWrapper
