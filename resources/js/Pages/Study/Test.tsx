import { PageProps, StudyTest, Subject } from '@/types'
import Layout from '@/Layouts/Layout'
import { useEffect, useState } from 'react'
import { get } from '@/utils/api'
import Loading from '@/Components/Loading'
import StudyListComponent from '@/Components/Features/Study/List'
import StudyTestComponent from '@/Components/Features/Study/Test'
import { audioLoad, audioPlay } from '@/utils/sound'

interface SubjectTest extends Subject {
  study_test: StudyTest[]
}

export default function StudyTestPage({ auth }: PageProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<SubjectTest[]>([])
  const [selectedTest, setSelectedTest] = useState<StudyTest>()
  const [startCountDown, setStartCountDown] = useState(0)

  useEffect(() => {
    async function fetchData() {
      const res = await get<SubjectTest[]>(`/api/study/subject`)
      if (res) {
        setData(res)
        setLoading(false)
      }
    }
    fetchData()

    audioLoad()
  }, [])

  function handleStart(test: StudyTest) {
    let countdown = 3
    audioPlay('btn_sound_start')
    setStartCountDown(countdown)
    setSelectedTest(test)
    const intervalId = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(intervalId)
      } else {
        countdown -= 1
        setStartCountDown(countdown)
        audioPlay('sound_countdown')
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }

  if (loading) return <Loading />

  return (
    <Layout user={auth.user} title="Home">
      <div className={`px-2 py-4`}>
        {startCountDown ? (
          <div className="mt-4">
            <div className="rounded bg-slate-600 text-center text-4xl font-bold text-white">{startCountDown}</div>
            <div className="mt-20 h-32 w-32 animate-ping bg-cover bg-center">
              <img src="/img/stamp_smanai.png" alt="Image" className="" />
            </div>
          </div>
        ) : !selectedTest ? (
          <StudyListComponent data={data} loading={loading} onStart={(test) => handleStart(test)} />
        ) : (
          <StudyTestComponent selectedTest={selectedTest} />
        )}
      </div>
      <audio id="btn_sound_start" src="/sounds/start.mp3"></audio>
      <audio id="sound_countdown" src="/sounds/countdown.mp3"></audio>
    </Layout>
  )
}
