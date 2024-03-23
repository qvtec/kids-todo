import { useState } from 'react'
import NumberButton from '@/Components/NumberButton'
import { audioPlay } from '@/utils/sound'

interface Props {
  onChange: (value: string) => void
  onSubmit: () => void
}

export default function NumberButtonsComponent({ onChange, onSubmit }: Props) {
  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3]
  const [inputValue, setInputValue] = useState<string>('')

  function setInputData(value: string) {
    setInputValue(value)
    onChange(value)
  }

  function handleNumber(value: number) {
    audioPlay('number_btn_click_sound')
    setInputData(inputValue + value)
  }

  function handleClear() {
    audioPlay('number_btn_click_sound')
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
      <audio id="number_btn_click_sound" src="/sounds/btn_ca.mp3"></audio>
    </div>
  )
}
