import Layout from '@/Layouts/Layout'
import { Option, PageProps, StudyTest, Subject } from '@/types'
import MasterStudyList from '@/Components/Features/Master/Study/List'
import MasterStudyForm from '@/Components/Features/Master/Study/Form'
import { useEffect, useState } from 'react'
import { get } from '@/utils/api'

interface SubjectTest extends Subject {
  study_test: StudyTest[]
}

export default function MasterStudyPage({ auth }: PageProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<SubjectTest[]>([])
  const [subjectOptions, setSubjectOptions] = useState<Option[]>([])
  const [selectedTest, setSelectedTest] = useState<StudyTest | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const res = await get<SubjectTest[]>(`/api/admin/study`)
      if (res) {
        const options = res.map((item) => {
          return {
            id: item.id,
            label: item.name,
          }
        })
        setSubjectOptions(options)
        setData(res)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  function handleEditTest(test: StudyTest | null) {
    setSelectedTest(test)
    setShowForm(true)
  }

  async function handleDeleteTest(test: StudyTest) {
    const newData = [...data]
    const subjectIdx = newData.findIndex((item) => item.id == test.subject_id)
    const testIdx = newData[subjectIdx].study_test.findIndex((item) => item.id == test.id)
    newData[subjectIdx].study_test.splice(testIdx, 1)
    setData(newData)
  }

  function handleFormClose() {
    setShowForm(false)
  }

  function handleFormSubmit(test: StudyTest) {
    const subjectIdx = data.findIndex((item) => item.id == test.subject_id)
    if (selectedTest) {
      const testIdx = data[subjectIdx].study_test.findIndex((item) => item.id == test.id)
      data[subjectIdx].study_test[testIdx] = test
    } else {
      data[subjectIdx].study_test.push(test)
    }
    setData(data)
    setShowForm(false)
  }

  return (
    <Layout user={auth.user} title="Subject">
      <div className="w-full bg-gray-400 px-4 py-2">
        <h1 className="text-lg text-white">Study Master</h1>
      </div>
      {!showForm ? (
        <MasterStudyList data={data} loading={loading} onEdit={handleEditTest} onDelete={handleDeleteTest} />
      ) : (
        <MasterStudyForm
          selectedTest={selectedTest}
          subjectOptions={subjectOptions}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </Layout>
  )
}
