import { Subject, StudyTest, Question, Answer } from '@/types'

import Loading from '@/Components/Loading'
import { useEffect, useState } from 'react'
import { get, post } from '@/utils/api'
import ButtonSecondary from '@/Components/ButtonSecondary'
import { Link } from '@inertiajs/react'
import NumberButtonsComponent from './NumberButtons'
import CountdownComponent from './CountDonw'
import { audioPlay } from '@/utils/sound'

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
  const COUNTDOWN_TIME = selectedTest.countdown
  const TOTAL_COUNT = selectedTest.total

  const [loading, setLoading] = useState(true)
  const [isFinish, setIsFinish] = useState(false)
  const [data, setData] = useState<AnswerContents[]>([])
  const [no, setNo] = useState(0)
  const [isErr, setIsErr] = useState(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [finishImg, seFinishImg] = useState('')
  const [studyImg, seStudyImg] = useState('/img/smanai.jpg')

  useEffect(() => {
    async function fetchData() {
      const questionURL = `/api/study/question/${selectedTest.id}?limit=${TOTAL_COUNT}`
      const res = await get<Question[]>(questionURL)
      if (res) {
        setData(res)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  async function handleEnd() {
    setIsFinish(true)
    const ok_cnt = data.filter((item) => !item.is_failed).length
    const is_complete = ok_cnt == TOTAL_COUNT
    const result_contens = data.splice(0, no + 1)
    setData(result_contens)

    if (is_complete) {
      seFinishImg('/img/stamp_nice.png')
    } else if (ok_cnt > TOTAL_COUNT - 1) {
      seFinishImg('/img/stamp_good.png')
    } else if (ok_cnt > TOTAL_COUNT - 3) {
      seFinishImg('/img/stamp_fight.png')
    } else {
      seFinishImg('/img/stamp_black.png')
    }

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
    audioPlay('sound_timeup')
    await handleEnd()
  }

  async function handleChangeInput(value: string) {
    setInputValue(value)
  }

  async function handleSubmit() {
    const question = data[no]
    if (inputValue == question.answer) {
      correct()

      if (data.length == no + 1) {
        console.log('FINISH!', data.length)
        audioPlay('sound_finish')
        await handleEnd()
        return
      }

      setNo(no + 1)
    } else {
      question.is_failed = true
      incorrect()
    }
  }

  function correct() {
    setIsErr(false)
    audioPlay('btn_ok')
    seStudyImg('/img/stamp_ok.png')
    setTimeout(() => {
      seStudyImg('/img/smanai.jpg')
    }, 1000)
  }

  function incorrect() {
    setIsErr(true)
    audioPlay('btn_ng')
    seStudyImg('/img/stamp_ng.png')
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
          <div className="fixed bottom-24 right-0 h-24 w-24 bg-cover bg-center">
            <img src={studyImg} alt="Image" className="" />
          </div>
          <audio id="btn_ok" src="/sounds/btn_ok.mp3"></audio>
          <audio id="btn_ng" src="/sounds/btn_ng.mp3"></audio>
        </>
      ) : (
        <div>
          {data.length > 0 && (
            <>
              <h2 className="mb-2 text-lg font-bold text-gray-800">
                {data.filter((item) => !item.is_failed).length + '/' + TOTAL_COUNT + '問 クリア'}
              </h2>
              <div className="flex justify-center">
                <Link href="/study">
                  <ButtonSecondary type="button">戻る</ButtonSecondary>
                </Link>
              </div>
              <ul className="my-4 space-y-3">
                {data
                  .filter((item) => item.is_failed)
                  .map((item, i) => (
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
                      <span className="text-gray-800">{item.content}</span>
                      <span className="text-gray-800"> = {item.answer}</span>
                    </li>
                  ))}
              </ul>
            </>
          )}

          {finishImg && (
            <div className="fixed -bottom-0 right-0 h-64 w-64 animate-bounce bg-cover bg-center">
              <img src={finishImg} alt="Animated Image" className="" />
            </div>
          )}
        </div>
      )}
      <audio id="sound_finish" src="/sounds/finish.mp3"></audio>
      <audio id="sound_timeup" src="/sounds/timeup.mp3"></audio>
    </div>
  )
}
