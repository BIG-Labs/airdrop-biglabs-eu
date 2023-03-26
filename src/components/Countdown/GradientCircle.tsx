import styles from '../Countdown/GradientCircle.module.css'

export default function GradientCircle({
  children,
  ...props
}: { stroke?: number, width: number, height: number } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <div style={{width: `${props.width}rem`, height: `${props.height}rem`}} className={styles.main}>
      <svg
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <linearGradient id='gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='#412e77' />
            <stop offset='25%' stopColor='#3c79f5' />
            <stop offset='100%' stopColor='#412e77' />
          </linearGradient>
        </defs>
        <g className={styles.g}>
          <circle className={styles.circle} cx='50' cy='50' r='45' />
          <path
            id='base-timer-path-remaining'
            strokeDasharray={`${ props.stroke ? props.stroke : '283' } 283`}
            className={styles.path}
            d='
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
            '
          ></path>
        </g>
      </svg>
      <div className={styles.content}>
        { children }
      </div>
    </div>
  )
}