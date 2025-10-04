import * as React from 'react'
import { cn } from '../../lib/utils.js'

const Progress = React.forwardRef(({ className, value = 0, colorClass = 'bg-primary' }, ref) => (
  <div
    ref={ref}
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(value)}
    className={cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', className)}
  >
    <div className={cn('h-full w-full flex-1 bg-primary transition-all', colorClass)} style={{ transform: `translateX(${value - 100}%)` }} />
  </div>
))
Progress.displayName = 'Progress'

export { Progress }
