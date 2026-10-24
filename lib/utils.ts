import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Font sizes are authored at design scale; --text-scale (globals.css) shrinks them all at once.
export function fs(px: number) {
  return `calc(var(--text-scale) * ${px}px)`
}
