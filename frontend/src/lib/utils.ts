import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercentage(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return `${(numValue * 100).toFixed(1)}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value)
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case 'high':
      return 'text-risk-high'
    case 'medium':
      return 'text-risk-medium'
    case 'low':
      return 'text-risk-low'
    default:
      return 'text-gray-500'
  }
}

export function getRiskBadgeClass(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case 'high':
      return 'risk-badge-high'
    case 'medium':
      return 'risk-badge-medium'
    case 'low':
      return 'risk-badge-low'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export function downloadFile(data: any, filename: string, type: string) {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
