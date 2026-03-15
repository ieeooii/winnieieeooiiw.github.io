export const isActiveRoute = (href: string, pathname: string): boolean =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')
