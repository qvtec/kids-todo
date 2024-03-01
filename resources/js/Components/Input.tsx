import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean
  className: string
}

export default function Input({ disabled = false, className, ...props }: Props) {
  return (
    <input
      disabled={disabled}
      className={`${className} block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900`}
      {...props}
    />
  )
}
