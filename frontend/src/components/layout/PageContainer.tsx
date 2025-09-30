import React from 'react'

interface PageContainerProps {
  children: React.ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div style={{ paddingTop: '64px' }}>
      <div style={{ padding: '2rem 1rem', marginLeft: '280px' }}>
        {children}
      </div>
    </div>
  )
}

export default PageContainer


