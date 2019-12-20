import { cloneDeep } from 'lodash'
import hash from 'hash.js'

export const createNewFile = (
  fileStructure: any,
  newFile: any,
  type: 'file' | 'folder' = 'file'
) => {
  const file = cloneDeep(fileStructure)
  const { relative, fileName, content } = newFile
  const folder = findFolder(file, relative)

  if (folder) {
    folder.children.push({
      id: hash
        .sha256()
        .update(`${relative}/${fileName}`)
        .digest('hex'),
      relative: `${relative}/${fileName}`,
      name: fileName,
      children: [],
      type
    })

    folder.children = folderSort(folder.children)
  }

  return file
}

const findFolder = (folder: any, relative: string): any => {
  if (folder.relative === relative) {
    return folder
  }
  for (let i = 0; i < folder.children.length; i++) {
    const element = folder.children[i]
    if (element.type === 'folder' && element.relative === relative) {
      return element
    } else if (element.type === 'folder') {
      const r = findFolder(element, relative)
      if (r) {
        return r
      }
    }
  }
  return null
}

const folderSort = (folder: any[]) => {
  let fCount = 0
  const newFolder = []
  for (let i = 0; i < folder.length; i++) {
    const el = folder[i]
    if (el.type === 'folder') {
      newFolder.unshift(el)
      fCount++
    } else {
      newFolder.push(el)
    }
  }

  const left = newFolder
    .slice(0, fCount)
    .sort((a, b) => a.name.localeCompare(b.name))
  const right = newFolder
    .slice(fCount)
    .sort((a, b) => a.name.localeCompare(b.name))

  return [...left, ...right]
}
