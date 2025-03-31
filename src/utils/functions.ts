export async function getMimeTypeFromURL(src: string): Promise<string | null> {
  try {
    const response = await fetch(src, {
      headers: {
        Range: 'bytes=0-524287', // 512KB
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.status}`)
    }

    const buffer = await response.arrayBuffer()

    // ค้นหา box 'ftyp' และ 'moov' ซึ่งมักอยู่ใน header
    const text = new TextDecoder().decode(buffer)

    // ค้นหา codec โดยหาจากกล่อง 'ftyp' หรือ 'moov' > 'trak' > 'mdia' > 'minf' > 'stbl' > 'stsd'
    const possibleCodecs = ['avc1', 'hvc1', 'hev1', 'vp09', 'vp8 ', 'av01']
    for (const codec of possibleCodecs) {
      if (text.includes(codec)) {
        switch (codec) {
          case 'avc1':
            return 'video/mp4; codecs="avc1.42E01E"'
          case 'hvc1':
          case 'hev1':
            return 'video/mp4; codecs="hvc1.1.6.L93.B0"'
          case 'vp09':
            return 'video/mp4; codecs="vp09.00.10.08"'
          case 'vp8 ':
            return 'video/webm; codecs="vp8"'
          case 'av01':
            return 'video/mp4; codecs="av01.0.05M.08"'
          default:
            return null
        }
      }
    }

    return null
  } catch (err) {
    console.error('Error detecting codec:', err)
    return null
  }
}