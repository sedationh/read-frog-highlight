import { kebabCase } from 'case-anything'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

import Highlight from '@/entrypoints/side.content/components/highlight'
import { configFields } from '@/utils/atoms/config'
import { APP_NAME } from '@/utils/constants/app'
import { cn } from '@/utils/tailwind'

import { MIN_SIDE_CONTENT_WIDTH } from '../../../../utils/constants/side'
import { isSideOpenAtom } from '../../atoms'

export default function SideContent() {
  const isSideOpen = useAtomValue(isSideOpenAtom)
  const [sideContent, setSideContent] = useAtom(configFields.sideContent)
  const [isResizing, setIsResizing] = useState(false)

  // Setup resize handlers
  useEffect(() => {
    if (!isResizing)
      return

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing)
        return

      const windowWidth = window.innerWidth
      const newWidth = windowWidth - e.clientX
      const clampedWidth = Math.max(MIN_SIDE_CONTENT_WIDTH, newWidth)

      setSideContent({ width: clampedWidth })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isResizing, setSideContent])

  // HTML width adjustment
  useEffect(() => {
    const styleId = `shrink-origin-for-${kebabCase(APP_NAME)}-side-content`
    let styleTag = document.getElementById(styleId)

    if (isSideOpen) {
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.id = styleId
        document.head.appendChild(styleTag)
      }
      styleTag.textContent = `
        html {
          width: calc(100% - ${sideContent.width}px) !important;
          position: relative !important;
          min-height: 100vh !important;
        }
      `
    }
    else {
      if (styleTag) {
        document.head.removeChild(styleTag)
      }
    }

    return () => {
      if (styleTag && document.head.contains(styleTag)) {
        document.head.removeChild(styleTag)
      }
    }
  }, [isSideOpen, sideContent.width])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  return (
    <>
      <div
        translate="no"
        className={cn(
          'bg-background fixed top-0 right-0 z-[2147483647] h-full pr-[var(--removed-body-scroll-bar-size,0px)]',
          isSideOpen
            ? 'border-border translate-x-0 border-l'
            : 'translate-x-full',
        )}
        style={{
          width: `calc(${sideContent.width}px + var(--removed-body-scroll-bar-size, 0px))`,
        }}
      >
        {/* Resize handle */}
        <div
          className="absolute top-0 left-0 z-10 h-full w-2 cursor-ew-resize justify-center bg-transparent"
          onMouseDown={handleResizeStart}
        >
        </div>

        <div className="flex h-full flex-col gap-y-2 py-3 overflow-y-auto">
          <Highlight />
        </div>
        <Toaster position="top-center" richColors className="z-[2147483647]" duration={10000} />
      </div>

      {/* Transparent overlay to prevent other events during resizing */}
      {isResizing && (
        <div className="fixed inset-0 z-[2147483647] cursor-ew-resize bg-transparent" />
      )}
    </>
  )
}
