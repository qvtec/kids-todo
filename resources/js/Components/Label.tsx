import { LabelHTMLAttributes } from 'react'

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string
  children: React.ReactNode
}

export default function Label({ className = '', children, ...props }: Props) {
  return (
    <label
      className={`${className} block font-medium text-sm text-gray-700`}
      {...props}
    >
      {children}
    </label>
  )
}
