/**
 * audioLoad
 */
export function audioLoad() {
  document.querySelectorAll('audio').forEach((el) => {
    el.load()
  })
}

/**
 * audioPlay
 */
export function audioPlay(id: string) {
  document.querySelectorAll('audio').forEach((el) => {
    el.pause()
    el.currentTime = 0
  })
  const audio = document.getElementById(id) as HTMLAudioElement
  audio.play()
}
