import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import { PageProps } from '@/types'
import { Link } from '@inertiajs/react'
import Layout from '@/Layouts/Layout'
import ButtonPrimary from '@/Components/ButtonPrimary'
import { FormEvent, useEffect, useState } from 'react'
import Input from '@/Components/Input'

interface Question {
    id: number
    contents: string
    answer: string
    is_failed?: boolean
}

const countdownTime = 10

export default function StuduTestPage({ auth }: PageProps) {
    const [started, setStarted] = useState(false)
    const [no, setNo] = useState(0)
    const [isErr, setIsErr] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([])
    const [inputValue, setInputValue] = useState<string>('')
    const [missAnswers, setMissAnswers] = useState<Question[]>([])
    const [timeLeft, setTimeLeft] = useState(countdownTime)

    function getRandomDigit() {
        return Math.floor(Math.random() * 10)
    }

    function addQuestion() {
        const number1 = getRandomDigit()
        const number2 = getRandomDigit()
        const sum = number1 + number2;
        const newObj = {
            id: no,
            contents: `${number1} + ${number2}`,
            answer: `${sum}`,
        }
        setQuestions([...questions, newObj])
    }

    function handleStart() {
        setQuestions([])
        addQuestion()
        setTimeLeft(countdownTime)
        setStarted(true)
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const question = questions[no]
        if (inputValue == question.answer) {
            setNo(no + 1)
            addQuestion()
            setIsErr(false)
        } else {
            setIsErr(true)
            questions[no].is_failed = true
        }

        setInputValue('')
    }

    if (started) {
        setTimeout(() => {
          if (timeLeft > 0) {
            setTimeLeft(timeLeft - 1)
          } else {
            setStarted(false)
          }
        }, 1000)
    }

    return (
        <Layout user={auth.user} title="Home">
            <div className="max-w-sm m-3">
                {!started ? (
                    <div>
                        {questions.length > 0 && (
                            <>
                                <h2 className='text-lg font-bold text-gray-800'>{questions.length}問 クリア</h2>
                                <ul className="my-4 space-y-3">
                                    {questions.map((item, i) => (
                                        <li className="flex space-x-3" key={i}>
                                            <span className={'flex size-5 items-center justify-center rounded-full ' + (item.is_failed ? 'bg-red-600' : 'bg-cyan-700') }>
                                                {item.is_failed ?
                                                    <img src="/img/check.svg" alt="OK" className="size-3.5 flex-shrink-0" width={24} height={24} /> :
                                                    <img src="/img/clear.svg" alt="NG" className="size-3.5 flex-shrink-0" width={24} height={24} />
                                                }
                                            </span>
                                            <span className="text-gray-800">{i + 1}.</span>
                                            <span className="text-gray-800">{item.contents}</span>
                                            <span className="text-gray-800"> = {item.answer}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        <ButtonPrimary onClick={handleStart}>スタート</ButtonPrimary>
                    </div>
                ) : (
                    <div>
                        {timeLeft > 0 ? (
                            <>
                                <h3 className='text-md text-gray-800'>残り時間: {timeLeft}秒</h3>
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                                    <p className="text-2xl">{ questions[no].contents }</p>
                                    <input
                                        type="tel"
                                        className={`block w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring ${
                                            isErr ? ' border-red-500 focus:border-red-500 focus:ring-red-500' : ' border-gray-400 focus:border-blue-500 focus:ring-blue-500'
                                        }`}
                                        name="answer"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder=""
                                        autoFocus
                                    />
                                </form>
                            </>
                        ) : (
                            <h3 className='text-md text-gray-800'>時間切れ</h3>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    )
}
