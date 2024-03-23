import { StudyTest, Option, Question } from '@/types'

import Loading from '@/Components/Loading'
import { get, post, put } from '@/utils/api'
import { FormEvent, useEffect, useState } from 'react'
import ButtonSecondary from '@/Components/ButtonSecondary'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import InputError from '@/Components/InputError'
import { useForm } from '@inertiajs/react'
import ButtonPrimary from '@/Components/ButtonPrimary'
import SelectInput from '@/Components/SelectInput'
import IconButton from '@/Components/IconButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'

interface SubjectTestQuestion extends StudyTest {
  question: Question[]
}

interface Props {
  selectedTest: StudyTest | null
  subjectOptions: Option[]
  onClose: () => void
  onSubmit: (test: StudyTest) => void
}

interface TestForm {
  id?: number
  subject_id?: number
  name: string
  countdown?: number
  total?: number
  question?: QuestionForm[]
}

interface QuestionForm {
  id?: number
  content: string
  answer: string
}

type KeyofQuestionForm = 'content' | 'answer'

export default function MasterStudyForm({ selectedTest, subjectOptions, onClose, onSubmit }: Props) {
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<Option | undefined>()
  const [questions, setQuestions] = useState<QuestionForm[]>([
    {
      content: '',
      answer: '',
    },
  ])

  const { data, setData, setDefaults, processing, errors } = useForm<TestForm>({
    name: '',
  })

  useEffect(() => {
    if (selectedTest) {
      const option = subjectOptions.find((item) => item.id == selectedTest.subject_id)
      setSelectedSubject(option)
      setData('subject_id', selectedTest.subject_id)
    }

    if (!selectedTest) {
      setLoading(false)
      return
    }

    async function fetchData(id: number) {
      const res = await get<SubjectTestQuestion>(`/api/admin/study/${id}`)
      if (res) {
        setData(res)
        setQuestions(res.question)
        setLoading(false)
      }
    }
    fetchData(selectedTest.id)
  }, [])

  function setQuestionsData(newQuestions: QuestionForm[]) {
    setQuestions(newQuestions)
    setData('question', newQuestions)
  }

  function handleChangeSubject(option?: Option) {
    setSelectedSubject(option)
    setData('subject_id', option?.id)
  }

  function handleQuestionChange(index: number, field: KeyofQuestionForm, value: string) {
    questions[index][field] = value
    setQuestionsData(questions)
  }

  function handleRemoveQuestion(index: number) {
    questions.splice(index, 1)
    setQuestionsData(questions)
  }

  function handleAddQuestion() {
    questions.push({
      content: '',
      answer: '',
    })
    setQuestionsData(questions)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (selectedTest) {
      const res = await put<StudyTest>(`/api/admin/study/${selectedTest.id}`, data)
      if (res) {
        onSubmit(res)
      }
    } else {
      const res = await post<StudyTest>('/api/admin/study', data)
      if (res) {
        onSubmit(res)
      }
    }
    onClose()
  }

  if (loading) return <Loading />

  return (
    <div className="mx-auto max-w-7xl px-4 py-4">
      <div className="mb-4 flex justify-between">
        <h2 className="text-lg">{selectedTest ? '更新' : '新規登録'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <InputLabel htmlFor="subject_id" value="教科" />
          <SelectInput options={subjectOptions} selectedOption={selectedSubject} onChange={handleChangeSubject} />
          <InputError message={errors.subject_id} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="name" value="テスト名" />
          <TextInput value={data.name} onChange={(e) => setData('name', e.target.value)} required />
          <InputError message={errors.name} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="countdown" value="カウントダウン" />
          <TextInput
            type="number"
            value={data.countdown ?? 0}
            onChange={(e) => setData('countdown', Number(e.target.value ?? 0))}
            required
          />
          <InputError message={errors.countdown} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="total" value="問題件数" />
          <TextInput
            type="number"
            value={data.total ?? 0}
            onChange={(e) => setData('total', Number(e.target.value ?? 0))}
            required
          />
          <InputError message={errors.total} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="" value="問題" />
        </div>
        {questions.map((item, i) => (
          <div className="mt-4 flex flex-wrap gap-2" key={i}>
            <div className="inline-flex items-center justify-center">{i + 1}.</div>
            <TextInput
              value={item.content}
              onChange={(e) => handleQuestionChange(i, 'content', e.target.value)}
              className="w-40"
              required
            />
            <TextInput
              value={item.answer}
              onChange={(e) => handleQuestionChange(i, 'answer', e.target.value)}
              className="w-20"
              required
            />
            <InputError message={errors.question} className="mt-2" />
            <div className="inline-flex items-center justify-center">
              <IconButton className="bg-gray-500 hover:bg-gray-600" onClick={() => handleRemoveQuestion(i)}>
                <FontAwesomeIcon icon={faMinus} />
              </IconButton>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <IconButton className="ml-4" onClick={handleAddQuestion}>
            <FontAwesomeIcon icon={faPlus} />
          </IconButton>
        </div>

        <div className="mt-8 flex justify-between">
          <ButtonSecondary onClick={onClose}>戻る</ButtonSecondary>
          <ButtonPrimary disabled={processing}>{selectedTest ? '更新' : '新規登録'}</ButtonPrimary>
        </div>
      </form>
    </div>
  )
}
