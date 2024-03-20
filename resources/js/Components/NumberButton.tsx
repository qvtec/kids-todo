import { ButtonHTMLAttributes } from 'react'

export default function NumberButton({ className = '', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium text-3xl px-4 py-2 text-center me-2 mb-2 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    )
}
