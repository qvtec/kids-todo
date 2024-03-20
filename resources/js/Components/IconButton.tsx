import { ButtonHTMLAttributes } from 'react'

export default function IconButton({ className = '', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={
        `inline-flex items-center rounded-full bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
          disabled && 'opacity-25'
        } ` + className
      }
      disabled={disabled}
    >
      {children}
    </button>
  )
}
