import { Subject, StudyTest } from '@/types'

import ButtonDanger from '@/Components/ButtonDanger'
import Loading from '@/Components/Loading'
import { remove } from '@/utils/api'
import ButtonSecondary from '@/Components/ButtonSecondary'
import ButtonPrimary from '@/Components/ButtonPrimary'

interface SubjectTest extends Subject {
  study_test: StudyTest[]
}

interface Props {
  data: SubjectTest[]
  loading: boolean
  onEdit: (test: StudyTest | null) => void
  onDelete: (test: StudyTest) => void
}

export default function MasterStudyList({ data, loading, onEdit, onDelete }: Props) {
  async function onClickEdit(test?: StudyTest) {
    onEdit(test ?? null)
  }

  async function onClickDelete(test: StudyTest) {
    if (confirm('本当に削除しますか？')) {
      await remove(`/api/admin/study/${test.id}`)
      onDelete(test)
    }
  }

  if (loading) return <Loading />

  return (
    <>
      {data.map((subject, i) => (
        <div className="mx-auto max-w-7xl px-4 py-4" key={i}>
          {i == 0 && (
            <div className="mb-4 flex justify-between">
              <h2 className="text-lg">一覧</h2>
              <ButtonPrimary onClick={() => onClickEdit()}>新規登録</ButtonPrimary>
            </div>
          )}
          <table className="w-full text-left text-sm text-gray-500 shadow-md sm:rounded-lg rtl:text-right">
            <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-900">
              <tr>
                <th scope="col" className="px-3 py-3 sm:px-6">
                  subject
                </th>
                <th scope="col" className="px-3 py-3 sm:px-6">
                  test
                </th>
                <th scope="col" className="px-3 py-3 sm:px-6"></th>
                <th scope="col" className="px-3 py-3 sm:px-6"></th>
              </tr>
            </thead>
            <tbody>
              {subject.study_test.map((test, i2) => (
                <tr key={i2}>
                  <td className="px-3 py-4 sm:px-6">{subject.name}</td>
                  <td className="px-3 py-4 sm:px-6">{test.name}</td>
                  <td className="px-3 py-4 sm:px-6">
                    <ButtonSecondary onClick={() => onClickEdit(test)} className="">
                      編集
                    </ButtonSecondary>
                  </td>
                  <td className="p-3 sm:px-6 sm:py-4">
                    <ButtonDanger onClick={() => onClickDelete(test)} className="">
                      削除
                    </ButtonDanger>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  )
}
