import React from 'react'
import FileIcon from '../fileIcon'
import { TabButtonProps } from './interface'
import clsx from 'clsx'
import TabDot from './tabDot'

export default function TabButton({
  fileName,
  modified,
  filePath,
  active = false,
  onClick
}: TabButtonProps) {
  const handleClick = () => {
    onClick && onClick()
  }

  return (
    <div
      className={clsx('webcode-tab-button', {
        'webcode-tab-button--active': active
      })}
      onClick={handleClick}
    >
      <FileIcon type="file" fileName={fileName} />
      <span className="webcode-tab-button__name">{fileName}</span>
      <TabDot modified={modified} />
    </div>
  )
}
