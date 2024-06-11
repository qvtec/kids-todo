import { StudyTest, Answer } from '@/types'

import { useEffect, useRef } from 'react'
import { post } from '@/utils/api'
import useAudioPlayer from '@/hooks/useAudioPlayer'

interface Props {
  selectedTest: StudyTest
}

export default function StudyMovieComponent({ selectedTest }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const { playAudio: playAudioFinish } = useAudioPlayer('/sounds/よーし.mp3')

  function handleVideoEnd() {
    playAudioFinish()
    handleEnd()
  }

  useEffect(() => {
    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnd)
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd)
      }
    }
  }, [])

  async function handleEnd() {
    const body = {
      study_test_id: selectedTest.id,
      score: 0,
      time: 0,
      result_contens: [],
      is_complete: true,
    }
    const res = await post<Answer[]>(`/api/study/answer`, body)
  }

  return (
    <div className="mt-4">
      <video ref={videoRef} controls width="600">
        <source src="/movie/99.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
