import React from 'react'
import Tab, {
  TabButton,
  TabItem,
  TabSwicher,
  TabContainer
} from '@src/components/tab'
import { useSelector, useDispatch } from 'react-redux'
import { AppStore } from '@src/store'
import MyEditor from '../editor'
import { getFileIndex, getFileById } from '@src/store/files/util'
import { changeCurrentFile, fileCloseFile } from '@src/store/files/actions'
import { FileContent } from '@src/store/files'
import Scroller from '@src/components/ui/scroller'
import { createStyles } from '@src/theme'
import * as monaco from 'monaco-editor'
import { convertTheme } from '@src/theme/editor'
import useTheme from '@src/theme/useTheme'

const useStyles = createStyles(theme => ({
  tabSwitcher: {
    backgroundColor: theme.colors['tab.inactiveBackground']
  },
  tabContainer: {
    backgroundColor: theme.colors['editor.background']
  },
  tabButton: {
    '&::after': {
      backgroundColor: theme.colors['tab.activeBorder']
    }
  }
}))

export default function MyTab() {
  const [tab, setTab] = React.useState(0)
  const [nextCloseFile, setNextCloseFile] = React.useState<FileContent | null>(
    null
  )
  const refScroller = React.useRef<Scroller | null>(null)
  const files = useSelector((store: AppStore) => store.files)
  const editor = useSelector((store: AppStore) => store.editor)
  const dispatch = useDispatch()
  const classes = useStyles()
  const theme = useTheme()

  React.useEffect(() => {
    //@ts-ignore
    monaco.editor.defineTheme('webcodeTheme', convertTheme(theme.theme))
    monaco.editor.setTheme('webcodeTheme')
  }, [theme.theme])

  React.useEffect(() => {
    refScroller.current && refScroller.current.resize()
  }, [editor.resizeCount])

  // change id by file store id
  const nextTab = getFileIndex(files.fileContents, files.currentFileId)
  if (tab !== nextTab) {
    setTab(nextTab)
  }

  const handleTabChange = (index: number) => {
    dispatch(changeCurrentFile(files.fileContents[index].id))
  }

  const handleTabClose = (item: FileContent) => () => {
    const file = getFileById(files.fileContents, item.id)
    if (!file) return
    if (file.modified) {
      setNextCloseFile(file)
      setTimeout(() => setNextCloseFile(null))
    } else {
      dispatch(fileCloseFile(item.id))
    }
  }

  return (
    <Tab onTabChange={handleTabChange}>
      <TabSwicher className={classes.tabSwitcher}>
        <Scroller ref={refScroller} activeIndex={tab}>
          {files.fileContents.map((item, index: number) => (
            <TabButton
              key={item.id}
              fileName={item.fileName}
              modified={item.modified}
              filePath={item.relative}
              active={tab === index}
              onClose={handleTabClose(item)}
              className={classes.tabButton}
            />
          ))}
        </Scroller>
      </TabSwicher>
      <TabContainer className={classes.tabContainer}>
        {files.fileContents.map((item, index: number) => (
          <TabItem key={item.id} tab={index} activeTab={tab}>
            <MyEditor
              fileKey={item.id}
              status={
                nextCloseFile && nextCloseFile.id === item.id ? 'close' : 'open'
              }
            />
          </TabItem>
        ))}
      </TabContainer>
    </Tab>
  )
}
