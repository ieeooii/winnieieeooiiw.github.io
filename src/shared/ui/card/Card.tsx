import type { HTMLAttributes, ReactNode } from 'react'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className, ...props }: CardProps) => (
  <div className={className} {...props}>
    {children}
  </div>
)

export type CardBodyProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  className?: string
}

export const CardBody = ({ children, className, ...props }: CardBodyProps) => (
  <div className={className} {...props}>
    {children}
  </div>
)
