import React from 'react'
import clsx from 'clsx'
import { createStyles } from '@src/theme'
import { ReactSVG } from 'react-svg'

const useStyles = createStyles(theme => ({
  badge: {
    backgroundColor: theme.colors['activityBarBadge.background'],
    color: theme.colors['activityBarBadge.foreground']
  }
}))

export interface ActivityBarItemProps {
  badge?: number
  active?: boolean
  iconFont: string
  onClick?: () => void
}

export default function ActivityBarItem({
  badge = 0,
  active = false,
  iconFont,
  onClick
}: ActivityBarItemProps) {
  const classes = useStyles()
  return (
    <div
      className={clsx('webcode-extension-bar__item', {
        'webcode-extension-bar__item--active': active
      })}
      onClick={onClick}
    >
      <a className="webcode-extension-bar__icon">
        <ReactSVG
          src={iconFont}
          beforeInjection={svg => {
            svg.classList.add('webcode-extension-bar__svg')
          }}
        />
        {badge > 0 ? (
          <span className={clsx('webcode-extension-bar__badge', classes.badge)}>
            {badge}
          </span>
        ) : null}
      </a>
    </div>
  )
}
