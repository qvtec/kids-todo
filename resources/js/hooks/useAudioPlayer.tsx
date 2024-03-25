import { useState, useEffect } from 'react'

const useAudioPlayer = (audioUrl: string) => {
  const [audio, setAudio] = useState(new Audio(audioUrl))

  useEffect(() => {
    audio.load()
  }, [audio])

  const playAudio = () => {
    audio.currentTime = 0
    audio.play()
  }

  return { playAudio }
}

export default useAudioPlayer
