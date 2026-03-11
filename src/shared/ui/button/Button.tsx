import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type BaseProps = {
  children: ReactNode
  className?: string
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button'
    href?: never
  }

type ButtonAsAnchor = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a'
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

export const Button = ({ children, className, as, ...props }: ButtonProps) => {
  if (as === 'a') {
    const { href, ...rest } = props as AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button className={className} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
