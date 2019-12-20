import './index.less'
import React from 'react'
import { FileTreeFileProps } from '../interface'
import clsx from 'clsx'
import FileIcon from '@src/components/fileIcon'
import Popover from '@src/components/ui/popover'
import Menu, { MenuItem } from '../menu'
import { trim } from 'lodash'
import NewFile from './newFile'
import { useDispatch } from 'react-redux'
import { projectRenameFile } from '@src/store/project/actions'
export { default as NewFile } from './newFile'

const PADDING_LEFT = 10

export default function File({
  id,
  relative,
  name,
  type = 'file',
  level = 1,
  active = false,
  onClick,
  onCreateFile,
  onCreateFolder
}: FileTreeFileProps) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [menuPos, setMenuPos] = React.useState({})
  const [editable, setEditable] = React.useState(false)
  const dispatch = useDispatch()

  const handleClick = () => {
    onClick && onClick(id, relative, type)
  }

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    setMenuPos({
      top: event.clientY,
      left: event.clientX
    })
    setMenuOpen(true)
    return false
  }

  const handleMenuClose = () => {
    setMenuOpen(false)
  }

  const handleRenameFileDone = (name: string) => {
    dispatch(projectRenameFile(id, name))
    setEditable(false)
  }

  const handleRenameFileCancel = () => setEditable(false)

  const handleCreateFile = () => {
    onCreateFile && onCreateFile()
    setMenuOpen(false)
  }

  const handleCreateFolder = () => {
    onCreateFolder && onCreateFolder()
    setMenuOpen(false)
  }

  const handleRenameFile = () => {
    setEditable(true)
    setMenuOpen(false)
  }

  const handleRemoveFile = () => setMenuOpen(false)

  if (editable) {
    return (
      <NewFile
        type="file"
        initialValue={name}
        level={level}
        onDone={handleRenameFileDone}
        onCancel={handleRenameFileCancel}
      />
    )
  }

  return (
    <div
      className={clsx('webcode-filetree-file', {
        'webcode-filetree-file--active': active
      })}
      style={{ paddingLeft: level * PADDING_LEFT }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <FileIcon type={type} fileName={name} />
      <span className="webcode-filetree-file__name">{name}</span>
      <Popover
        open={menuOpen}
        onClose={handleMenuClose}
        anchorByEl={false}
        pos={menuPos}
      >
        <Menu>
          {type !== 'file' ? (
            <MenuItem onClick={handleCreateFile}>新建文件</MenuItem>
          ) : null}
          {type !== 'file' ? (
            <MenuItem onClick={handleCreateFolder}>新建文件夹</MenuItem>
          ) : null}
          <MenuItem onClick={handleRenameFile}>重命名</MenuItem>
          <MenuItem onClick={handleRemoveFile}>删除</MenuItem>
        </Menu>
      </Popover>
    </div>
  )
}
