import type { HTMLAttributes, ReactNode } from 'react'

export type TagVariant = 'outline' | 'brand'

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  variant?: TagVariant
  className?: string
}

export const Tag = ({ children, className, variant: _variant, ...props }: TagProps) => (
  <span className={className} {...props}>
    {children}
  </span>
)
