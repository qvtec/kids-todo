import React, { useState, useEffect } from 'react'

interface Props {
  time: number
  onEnd: () => void
}

export default function CountdownComponent({ onEnd, time }: Props) {
  const [countdown, setCountdown] = useState(time)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(intervalId)
        onEnd()
      } else {
        setCountdown(countdown - 1)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [countdown])

  return (
    <div>
      <h3 className="text-md text-gray-800">残り時間: {countdown}秒</h3>
    </div>
  )
}
