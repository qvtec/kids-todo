import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import { PageProps, StudyTest, Subject } from '@/types'
import { Link } from '@inertiajs/react'
import Layout from '@/Layouts/Layout'
import ButtonPrimary from '@/Components/ButtonPrimary'
import { FormEvent, useEffect, useState } from 'react'
import Input from '@/Components/Input'
import NumberButton from '@/Components/NumberButton'
import { get, post } from '@/utils/api'
import Loading from '@/Components/Loading'
import StudyListComponent from '@/Components/Features/Study/List'
import StudyTestComponent from '@/Components/Features/Study/Test'

interface SubjectTest extends Subject {
  study_test: StudyTest[]
}

export default function StudyTestPage({ auth }: PageProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<SubjectTest[]>([])
  const [selectedTest, setSelectedTest] = useState<StudyTest>()

  useEffect(() => {
    async function fetchData() {
      const res = await get<SubjectTest[]>(`/api/study/subject`)
      if (res) {
        setData(res)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function handleStart(test: StudyTest) {
    console.log('start', test)
    setSelectedTest(test)
  }

  if (loading) return <Loading />

  return (
    <Layout user={auth.user} title="Home">
      {!selectedTest ? (
        <StudyListComponent data={data} loading={loading} onStart={(test) => handleStart(test)} />
      ) : (
        <StudyTestComponent selectedTest={selectedTest} />
      )}
    </Layout>
  )
}
