import { useEffect, useRef, useState } from 'react'
import { getMimeTypeFromURL } from '../utils/functions'
import OverlayScreen from './OverlayScreen'

export default function VideoMse({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState({ type: 'loading', message: 'Loading...' })

  useEffect(() => {
    const video = videoRef.current
    const init = async () => {
      if (!video) return

      video.onerror = () => {
        setStatus({ type: 'error', message: video.error?.message || 'Failed to load video' })
      }

      try {
        const mimeType = await getMimeTypeFromURL(url)
        if (!mimeType) {
          throw new Error('Failed to detect video codec')
        }

        const mediaSource = new MediaSource()
        video.src = URL.createObjectURL(mediaSource)
        mediaSource.addEventListener('sourceopen', async () => {
          mediaSource.duration = 0
          const sourceBuffer = mediaSource.addSourceBuffer(mimeType)
          sourceBuffer.mode = 'sequence'
          const response = await fetch(url)
          const buffer = await response.arrayBuffer()

          if (video.error) {
            setStatus({ type: 'error', message: video.error.message })
            throw new Error(video.error.message)
          }
          sourceBuffer.appendBuffer(buffer)
          sourceBuffer.addEventListener(
            'updateend',
            () => {
              setStatus({ type: 'success', message: '' })
            },
            { once: true }
          )
        })
      } catch (err) {
        console.error('Error initializing video:', err)
        setStatus({ type: 'error', message: (err as Error).message })
      }
    }

    init()
  }, [url])

  if (url.trim() === '') {
    return (
      <div className='w-full h-full aspect-video relative'>
        <OverlayScreen content='Enter video URL to load' />
      </div>
    )
  }

  return (
    <div className='w-full h-full aspect-video relative'>
      <>
        {status.type === 'loading' && (
          <OverlayScreen content={status.message} />
        )}
        {status.type === 'error' && (
          <OverlayScreen content={status.message} color='red' />
        )}
        <video
          className='w-full h-full'
          ref={videoRef}
          controls
        />
      </>
    </div>
  )
}
