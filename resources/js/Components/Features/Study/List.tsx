import { Subject, StudyTest } from '@/types'

import Loading from '@/Components/Loading'
import ButtonPrimary from '@/Components/ButtonPrimary'

interface SubjectTest extends Subject {
  study_test: StudyTest[]
}

interface Props {
  data: SubjectTest[]
  loading: boolean
  onStart: (test: StudyTest) => void
}

export default function StudyListComponent({ data, loading, onStart }: Props) {
  if (loading) return <Loading />

  return (
    <>
      {data.map((subject, i) => (
        <div className="mx-auto max-w-7xl px-4 py-4" key={i}>
          <table className="w-full text-left text-sm text-gray-500 shadow-md sm:rounded-lg rtl:text-right">
            <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-900">
              <tr>
                <th scope="col" className="px-3 py-3 sm:px-6">
                  {subject.name}
                </th>
                <th scope="col" className="px-3 py-3 sm:px-6"></th>
              </tr>
            </thead>
            <tbody>
              {subject.study_test.map((test, i2) => (
                <tr key={i2}>
                  <td className="px-3 py-4 sm:px-6">{test.name}</td>
                  <td className="px-3 py-4 sm:px-6">
                    <ButtonPrimary onClick={() => onStart(test)}>スタート</ButtonPrimary>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <div className="fixed bottom-24 right-0 h-24 w-24 bg-cover bg-center">
        <img src="/img/smanai.png" alt="Image" className="" />
      </div>
    </>
  )
}
