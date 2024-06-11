import { Subject, StudyTest, Question, Answer } from '@/types'

import Loading from '@/Components/Loading'
import { useEffect, useState } from 'react'
import { get, post } from '@/utils/api'
import ButtonSecondary from '@/Components/ButtonSecondary'
import { Link } from '@inertiajs/react'
import NumberButtonsComponent from './NumberButtons'
import CountdownComponent from './CountDonw'
import useAudioPlayer from '@/hooks/useAudioPlayer'
import useAudioPlayerRandom from '@/hooks/useAudioPlayerRandom'

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
  const [studyImg, seStudyImg] = useState('')

  const { playAudio: playAudioOK } = useAudioPlayerRandom([
    '/sounds/sumanai/できてるじゃないか.mp3', // おおっ！できてるじゃないか
    '/sounds/sumanai/やるね.mp3',
    '/sounds/sumanai/よーし.mp3',
    '/sounds/sumanai/やるじゃないか.mp3',
  ])
  const { playAudio: playAudioNG } = useAudioPlayer('/sounds/btn_ng.mp3')
  const { playAudio: playAudioTimeup1 } = useAudioPlayer('/sounds/sumanai/すごい.mp3') // おおっ！すごい！(イエーイ)
  const { playAudio: playAudioTimeup2 } = useAudioPlayer('/sounds/sumanai/できてるじゃないか.mp3') // おおっ！できてるじゃないか
  const { playAudio: playAudioTimeup3 } = useAudioPlayer('/sounds/sumanai/やるじゃないか.mp3')
  const { playAudio: playAudioFinish } = useAudioPlayerRandom([
    '/sounds/sumanai/ふークリア.mp3', // ふーックリアした
    '/sounds/sumanai/クリア当然_マネー.mp3',
  ])

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
    const result_contens = data.splice(0, no + 1)
    setData(result_contens)

    const ok_cnt = result_contens.filter((item) => !item.is_failed).length
    const is_timeup = data.length > result_contens.length
    const is_complete = !is_timeup && ok_cnt == TOTAL_COUNT

    if (is_complete) {
      playAudioFinish()
      seFinishImg('/img/stamp_nice.png')
    } else if (!is_timeup) {
      playAudioFinish()
      seFinishImg('/img/stamp_nice.png')
    } else if (ok_cnt > TOTAL_COUNT - 3) {
      playAudioTimeup1()
      seFinishImg('/img/stamp_good.png')
    } else if (ok_cnt > TOTAL_COUNT - 6) {
      playAudioTimeup2()
      seFinishImg('/img/stamp_fight.png')
    } else {
      playAudioTimeup3()
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
    // console.log('handleEnd', res)
  }

  async function handleTimeup() {
    data[no].is_failed = true
    // console.log('timeup!', no, data[no])
    await handleEnd()
  }

  async function handleChangeInput(value: string) {
    setInputValue(value)
  }

  async function handleSubmit() {
    const question = data[no]
    if (inputValue == question.answer) {
      if (data.length == no + 1) {
        console.log('FINISH!', data.length)
        await handleEnd()
        return
      }

      correct()
      setNo(no + 1)
    } else {
      question.is_failed = true
      incorrect()
    }
  }

  function correct() {
    setIsErr(false)
    playAudioOK()
    seStudyImg('/img/stamp_ok.png')
    setTimeout(() => {
      seStudyImg('')
    }, 1000)
  }

  function incorrect() {
    setIsErr(true)
    playAudioNG()
    seStudyImg('/img/stamp_ng.png')
  }

  if (loading) return <Loading />

  return (
    <div className="mt-4">
      {!isFinish ? (
        <>
          <CountdownComponent time={COUNTDOWN_TIME} onEnd={handleTimeup} />
          <div className="flex items-center justify-center text-2xl">
            <div className="w-28">
              <span className="mr-2 text-sm text-gray-400">{no}.</span>
              {data[no].content} ={' '}
            </div>
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

          {studyImg && (
            <div className="fixed bottom-10 left-0 h-24 w-24 bg-cover bg-center">
              <img src={studyImg} alt="Image" className="" />
            </div>
          )}
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
    </div>
  )
}
