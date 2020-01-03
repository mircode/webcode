import React from 'react'
import Editor from '@src/components/monaco'
import { AppStore } from '@src/store'
import { useSelector, useDispatch } from 'react-redux'
import { getFileById } from '@src/store/files/util'
import { createEditorSelectionAction } from '@src/store/editor/actions'
import { fileModifyFile, fileSaveFile } from '@src/store/files/actions'
import { Line } from 'rc-progress'
import './index.less'
import useFileLoading from '@src/hooks/useFileLoading'

export interface Props {
  fileKey: string
}

export default function MyEditor({ fileKey }: Props) {
  const refEditor = React.useRef<Editor | null>(null)
  const files = useSelector((store: AppStore) => store.files)
  const editor = useSelector((store: AppStore) => store.editor)
  const dispatch = useDispatch()
  const { loading, error, errorMessage, fileContents } = files
  const file = getFileById(fileContents, fileKey)
  const [progress, setProgress] = React.useState(0)
  const refProgress = React.useRef(0)
  const fileLoading = useFileLoading(fileKey)

  React.useEffect(() => {
    if (refEditor.current && file) {
      refEditor.current.focus()
      bindEvent()
    }
    let timer: number = -1
    const run = () => {
      timer = window.requestAnimationFrame(() => {
        if (refProgress.current < 100) {
          refProgress.current += 2
          setProgress(refProgress.current)
        } else {
          setProgress(100)
          window.cancelAnimationFrame(timer)
        }
        run()
      })
    }
    run()
    return () => {
      window.cancelAnimationFrame(timer)
    }
  }, [])

  React.useEffect(() => {
    if (refEditor.current) {
      refEditor.current.setMode(file?.relative || '', file?.content || '')
    }
  }, [file?.loading])

  // resize editor
  React.useEffect(() => {
    refEditor.current && refEditor.current.resize()
  }, [editor.resizeCount, files.currentFileId])

  const bindEvent = () => {
    if (refEditor.current) {
      refEditor.current.onCursorChange(cursor =>
        dispatch(createEditorSelectionAction(cursor))
      )

      // refEditor.current.onValueChange((dealt: Ace.Delta) => {
      //   // dealt 可以实现更加细腻度的控制，可用于实时在线编程直播
      //   console.log(dealt)
      //   console.log(refEditor.current?.getValue())
      //   // TODO 触发细腻度更高的编辑事件
      //   dispatch(fileModifyFile(fileKey, refEditor.current?.getValue() || ''))
      // })

      refEditor.current.onInput(e => {
        const file = getFileById(files.fileContents, fileKey)
        if (
          file &&
          file.content !== refEditor.current?.getValue() &&
          !e.isFlush // 手动输入时 isFlush 为false
        ) {
          dispatch(fileModifyFile(fileKey, refEditor.current?.getValue() || ''))
        }
      })

      refEditor.current.onSave(() => {
        console.log('file save')
        dispatch(fileSaveFile(fileKey))
      })
    }
  }

  return (
    <div className="webcode-editor-container">
      <Editor
        ref={refEditor}
        fileName={file?.relative || ''}
        fileContent={file?.content || ''}
      />
      {fileLoading ? (
        <div className="webcode-editor-container__loading-box">
          <div className="webcode-editor-container__loading">
            <Line
              percent={progress}
              strokeWidth={1}
              trailWidth={1}
              trailColor="#D3D3D3"
              strokeColor="#fa98ac"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
