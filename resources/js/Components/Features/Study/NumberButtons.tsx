import { useState } from 'react'
import NumberButton from '@/Components/NumberButton'
import useAudioPlayer from '@/hooks/useAudioPlayer'

interface Props {
  onChange: (value: string) => void
  onSubmit: () => void
}

export default function NumberButtonsComponent({ onChange, onSubmit }: Props) {
  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3]
  const [inputValue, setInputValue] = useState<string>('')

  const { playAudio: playAudioBtn } = useAudioPlayer('/sounds/btn_ca.mp3')
  const { playAudio: playAudioNg } = useAudioPlayer('/sounds/btn_ng.mp3')

  function setInputData(value: string) {
    setInputValue(value)
    onChange(value)
  }

  function handleNumber(value: number) {
    playAudioBtn()
    setInputData(inputValue + value)
  }

  function handleClear() {
    playAudioNg()
    setInputData('')
  }

  async function handleSubmit() {
    onSubmit()
    setInputData('')
  }

  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {numbers.map((number) => (
        <NumberButton onClick={() => handleNumber(number)} key={number}>
          {number}
        </NumberButton>
      ))}
      <NumberButton className="border-red-800 bg-white text-red-800" onClick={handleClear}>
        ✕
      </NumberButton>
      <NumberButton onClick={() => handleNumber(0)}>0</NumberButton>
      <NumberButton className="border-none bg-blue-800 text-white" onClick={handleSubmit}>
        OK
      </NumberButton>
    </div>
  )
}
