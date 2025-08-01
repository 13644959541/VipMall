import React, { lazy, Suspense, useState, useEffect } from 'react'

const HomeMobile = lazy(() => import('@/pages/HomeMobile'))
const HomePad = lazy(() => import('@/pages/HomePad'))

const HomeWrapper = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Suspense fallback={null}>
      {isMobile ? <HomeMobile /> : <HomePad />}
    </Suspense>
  )
}

export default HomeWrapper
