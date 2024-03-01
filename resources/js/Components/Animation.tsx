import { Player } from '@lottiefiles/react-lottie-player'
import { useEffect, useRef } from 'react'
import heartAnimation from '@/assets/anim_button.json'

export function AnimationButton({ on }: { on: boolean }) {
  const playerRef = useRef<Player>(null)

  useEffect(() => {
    if (!playerRef.current) {
      return
    }

    if (on) {
      playerRef.current.play()
    } else {
      playerRef.current.stop()
    }
  }, [on])

  return (
    <Player
      ref={playerRef}
      speed={1.8}
      keepLastFrame
      src={heartAnimation}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
