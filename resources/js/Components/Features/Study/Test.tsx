import { Subject, StudyTest, Question, Answer } from '@/types'

import Loading from '@/Components/Loading'
import ButtonPrimary from '@/Components/ButtonPrimary'
import { useEffect, useState } from 'react'
import { get, post } from '@/utils/api'
import NumberButton from '@/Components/NumberButton'
import ButtonSecondary from '@/Components/ButtonSecondary'
import { Link } from '@inertiajs/react'
import NumberButtonsComponent from './NumberButtons'
import CountdownComponent from './CountDonw'

interface Props {
  selectedTest: StudyTest
}

interface AnswerContents {
  id: number
  content: string
  answer: string
  is_failed?: boolean
}

export default function StudyTestComponent({ selectedTest }: Props) {
  const COUNTDOWN_TIME = 10

  const [loading, setLoading] = useState(true)
  const [isFinish, setIsFinish] = useState(false)
  const [data, setData] = useState<AnswerContents[]>([])
  const [no, setNo] = useState(0)
  const [isErr, setIsErr] = useState(false)
  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    async function fetchData() {
      const res = await get<Question[]>(`/api/study/question/${selectedTest.id}`)
      if (res) {
        setData(res)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  async function handleEnd() {
    setIsFinish(true)
    const is_complete = data.filter((item) => item.is_failed).length == 0
    const result_contens = data.splice(0, no + 1)
    setData(result_contens)
    const body = {
      study_test_id: selectedTest.id,
      score: 0,
      time: 0,
      result_contens,
      is_complete,
    }
    const res = await post<Answer[]>(`/api/study/answer`, body)
    console.log('handleEnd', res)
  }

  async function handleTimeup() {
    data[no].is_failed = true
    console.log('timeup!', no, data[no])
    await handleEnd()
  }

  async function handleChangeInput(value: string) {
    setInputValue(value)
  }

  async function handleSubmit() {
    const question = data[no]
    if (inputValue == question.answer) {
      setIsErr(false)

      if (data.length == no + 1) {
        console.log('FINISH!', data.length)
        await handleEnd()
        return
      }

      setNo(no + 1)
    } else {
      question.is_failed = true
      setIsErr(true)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="mt-4">
      {!isFinish ? (
        <>
          <CountdownComponent time={COUNTDOWN_TIME} onEnd={handleTimeup} />
          <div className="flex items-center justify-center text-2xl">
            <div className="w-24">{data[no].content} = </div>
            <div
              className={`w-24 rounded-lg border px-4 py-2 focus:outline-none focus:ring ${
                isErr
                  ? ' border-red-500 focus:border-red-500 focus:ring-red-500'
                  : ' border-gray-400 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              {inputValue || 0}
            </div>
          </div>
          <NumberButtonsComponent onChange={(value) => handleChangeInput(value)} onSubmit={handleSubmit} />
        </>
      ) : (
        <div>
          {data.length > 0 && (
            <>
              <h2 className="text-lg font-bold text-gray-800">
                {data.filter((item) => !item.is_failed).length + '/' + data.length + '問 クリア'}
              </h2>
              <ul className="my-4 space-y-3">
                {data.map((item, i) => (
                  <li className="flex space-x-3" key={i}>
                    <span
                      className={
                        'flex size-5 items-center justify-center rounded-full ' +
                        (!item.is_failed ? 'bg-cyan-700' : 'bg-red-600')
                      }
                    >
                      <img
                        src={!item.is_failed ? '/img/check.svg' : '/img/clear.svg'}
                        alt="icon"
                        className="size-3.5 flex-shrink-0"
                        width={24}
                        height={24}
                      />
                    </span>
                    <span className="text-gray-800">{i + 1}.</span>
                    <span className="text-gray-800">{item.content}</span>
                    <span className="text-gray-800"> = {item.answer}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <Link href="/study">
            <ButtonSecondary type="button">戻る</ButtonSecondary>
          </Link>
        </div>
      )}
    </div>
  )
}
