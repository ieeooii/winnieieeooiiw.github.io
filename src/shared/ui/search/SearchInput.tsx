import type { InputHTMLAttributes } from 'react'
import * as s from './search.css'

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const SearchInput = ({ className, ...props }: SearchInputProps) => (
  <input
    type="text"
    className={className ?? s.input}
    {...props}
  />
)
