import React from 'react'
import { Image as AntdImage } from 'antd-mobile'

interface EmptyStateProps {
  message: string
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center h-full mt-12 ${className}`}>
      <AntdImage src="/empty-.svg" width={200} height={200} />
      <div className="text-gray-500 text-sm mt-4">
        {message}
      </div>
    </div>
  )
}

export default EmptyState
