import { useState } from 'react'
import VideoMse from './components/VideoMse'

function App() {
  const [urlForm, setUrlForm] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLoad() {
    setLoading(true)
    setUrl(urlForm)
    setTimeout(() => setLoading(false), 100)
  }

  return (
    <div className='max-w-5xl mx-auto'>
      <h1 className='text-2xl font-bold text-center mt-4 mb-5'>Video Player with MSE</h1>
      <div className='w-full flex justify-center items-center mb-3'>
        <label className='mr-2 shrink-0'>Video URL:</label>
        <input
          type='text'
          value={urlForm}
          onChange={(e) => setUrlForm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
          className='border border-gray-300 rounded px-2 py-1 w-full'
        />
        <button
          onClick={handleLoad}
          disabled={!urlForm}
          className='border border-gray-300 rounded px-2 py-1 ml-2 hover:bg-gray-100 active:bg-gray-200 cursor-pointer'
        >
          Load
        </button>
      </div>
      {!loading && <VideoMse url={url} />}
    </div>
  )
}

export default App
