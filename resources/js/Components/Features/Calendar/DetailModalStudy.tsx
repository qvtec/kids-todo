import { Answer, StudyTest, Subject } from '@/types'
import { get } from '@/utils/api'

import { formatDate } from '@/utils/date'
import { faCrown, faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

interface SubjectTest extends Subject {
  study_test: StudyTest[]
}

interface Props {
  selectEvents: Answer[]
  onClose: () => void
}

export default function CalendarDetailModalStudy({ selectEvents, onClose }: Props) {
  const [data, setData] = useState<Answer>()
  const [subjects, setSubjects] = useState<SubjectTest[]>()

  useEffect(() => {
    async function fetchData() {
      const res = await get<Answer>(`/api/study/answer/${selectEvents[0].id}`)
      setData(res)
    }
    fetchData()

    async function fetchSubjectData() {
      const res = await get<SubjectTest[]>(`/api/study/subject`)
      setSubjects(res)
    }
    fetchSubjectData()
  }, [])

  const testName = (study_test_id: number) => {
    let name = ''
    subjects?.forEach((subject) => {
      const study = subject.study_test.find((study) => study.id == study_test_id)
      if (study) {
        name = subject.name + ' ' + study?.name
        return
      }
    })
    return name
  }

  if (!data || !subjects) return

  return (
    <>
      <div className="flex text-lg font-medium leading-6 text-gray-900">{formatDate(data.created_at, 'y年M月d日')}</div>
      <div className="mt-2 min-w-52">
        {selectEvents.map((item, i) => (
          <div className="flex items-center rounded-lg" key={i}>
            <div className="flex h-10 w-10 shrink-0 items-center">
              <FontAwesomeIcon icon={item.is_complete ? faSquareCheck : faSquare} className="text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-900">{testName(item.study_test_id)}</p>
            {item.is_complete == true && (
              <div className="ml-3 h-6 w-6">
                <FontAwesomeIcon icon={faCrown} className="h-6 w-6 text-yellow-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={onClose}
        >
          とじる
        </button>
      </div>
    </>
  )
}
