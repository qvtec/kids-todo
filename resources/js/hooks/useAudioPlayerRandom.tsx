import { useState, useEffect } from 'react'

const useAudioPlayerRandom = (audioUrls: string[]) => {
  const [audio, setAudio] = useState(new Audio())
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [audio])

  const playAudio = () => {
    const randomIndex = Math.floor(Math.random() * audioUrls.length)
    setCurrentIndex(randomIndex)
    const randomAudioUrl = audioUrls[randomIndex]
    audio.src = randomAudioUrl
    audio.load()
    audio.play()
  }

  return { playAudio, currentIndex }
}

export default useAudioPlayerRandom
