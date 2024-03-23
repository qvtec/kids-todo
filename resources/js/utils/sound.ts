/**
 * audioPlay
 */
export function audioPlay(id: string) {
  const audio = document.getElementById(id) as HTMLAudioElement
  audio.currentTime = 0
  audio.play()
}
