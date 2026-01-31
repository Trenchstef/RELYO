import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition',
        variant === 'primary' &&
          'bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-60',
        variant === 'secondary' &&
          'border border-slate-200 text-slate-700 hover:bg-slate-100',
        variant === 'ghost' && 'text-slate-700 hover:bg-slate-100',
        className
      )}
      {...props}
    />
  )
}
