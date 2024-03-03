import Layout from '@/Layouts/Layout'
import { PageProps } from '@/types'
import { useEffect, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'

import {
  IconDefinition,
  findIconDefinition,
} from '@fortawesome/fontawesome-svg-core'
import { IconName } from '@fortawesome/fontawesome-common-types'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

import { AnimationButton } from '@/Components/Animation'
import { now } from '@/utils/date'
import { get, put } from '@/utils/api'

interface Todo {
    id: number
    name: string
    time: string
    icon: string
    color: string
    type: string
    is_done?: boolean
    iconDef?: IconDefinition
}
interface Check {
    todo_id: number
    is_done: boolean
}

export default function TodoPage({ auth, type }: PageProps) {
    const [data, setData] = useState<Todo[]>([])
    const [checkData, setCheckData] = useState<Check[]>([])
    const [filterData, setFilterData] = useState<Todo[]>([])
    const [allDone, setAllDone] = useState(false)
    const [doneAnimOn, setDoneAnimOn] = useState(false)

    const date = now('yyyy-MM-dd')

    useEffect(() => {
        async function fetchData() {
            const res = await get<Todo[]>(`/api/todo`)
            if (res) setData(res)
        }
        async function fetchCheckData() {
            const res = await get<Check[]>(`/api/check/${date}?type=${type}`)
            if (res) setCheckData(res)
        }
        fetchData()
        fetchCheckData()
    }, [])

    useEffect(() => {
        const filterTodo = data.filter((todo) => todo.type == type)

        filterTodo.forEach((item, i) => {
            const iconName: IconName = item.icon as IconName
            filterTodo[i]['iconDef'] = findIconDefinition({
                prefix: 'fas',
                iconName: iconName,
            })

            if (checkData.length > 0) {
                const check = checkData.find((checkItem) => checkItem.todo_id == item.id)
                if (check) filterTodo[i]['is_done'] = check.is_done
            }
        })
        setFilterData(filterTodo)

        document.querySelectorAll('audio').forEach((el) => {
            el.load()
        })
    }, [data, checkData, type])

    useEffect(() => {
        const isAllDone = filterData.every((todo) => todo.is_done)
        setAllDone(isAllDone)
    }, [filterData])

    /**
     * CheckboxChange
     */
    async function handleCheckboxChange(id: number) {
        const updatedSchedules = filterData.map((item) => {
            if (item.id != id) return item

            if (!item.is_done) {
                audioPlay('schedule_audio_' + id)
                return { ...item, is_done: true }
            }

            if (confirm('完了済みのタスクを戻しますか？')) {
                return { ...item, is_done: false }
            }
            return item
        })
        setFilterData(updatedSchedules)

        const checkTodos = updatedSchedules.map(function(item) {
            return {
                todo_id: item['id'],
                is_done: !!item['is_done'],
            }
        })
        await put<Check[]>(`/api/check/${date}`, {
            type,
            todos: checkTodos
        })
    }

    /**
     * AllDoneButtonClick
     */
    async function handleAllDoneButtonClick() {
        await put<Check[]>(`/api/check/${date}`, { all_done: true })

        audioPlay('audio_all_done')

        if (doneAnimOn) {
            setDoneAnimOn(false)
        }
        setTimeout(() => {
            setDoneAnimOn(true)
        }, 100)
    }

    /**
     * audioPlay
     */
    function audioPlay(id: string) {
        const audio = document.getElementById(id) as HTMLAudioElement
        audio.play()
    }

    return (
        <Layout user={auth.user} title="Home">
            <div className="w-full max-w-md grid gap-2 my-2 px-2">
                {filterData?.map((item, i) => (
                    <div key={i}>
                        <input
                            id={'schedule_' + item.id}
                            type="checkbox"
                            checked={item.is_done}
                            name="schedule"
                            className="hidden peer"
                            onChange={() => handleCheckboxChange(item.id)}
                        />
                        <label
                            htmlFor={'schedule_' + item.id}
                            className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 rounded-lg cursor-pointer peer-checked:bg-gray-200 peer-checked:text-gray-400"
                        >
                            <div className="inline-flex items-center">
                                <FontAwesomeIcon icon={item.is_done ? faSquareCheck : faSquare} className="text-gray-500" />
                                <div className="block ml-5">
                                    <div className="w-full text-lg font-semibold">{item.name}</div>
                                    <div className="w-full text-xs text-blue-800/50">{item.time}</div>
                                </div>
                            </div>
                            {item.iconDef && <FontAwesomeIcon icon={item.iconDef} className={item.color + ' text-xl'} />}
                        </label>
                        <audio
                            id={'schedule_audio_' + item.id}
                            src="/sounds/button-click.mp3"
                        ></audio>
                    </div>
                ))}
            </div>

            <button
                type="button"
                className={'text-white font-medium rounded-lg text-sm px-5 py-3 mr-2 mb-2 ' + (allDone ? 'bg-blue-700' : 'bg-gray-200')}
                disabled={!allDone}
                onClick={handleAllDoneButtonClick}
                >
                <FontAwesomeIcon icon={faCrown} className="mr-2" />
                できた！
            </button>
            <AnimationButton on={doneAnimOn} />
            <audio id="audio_all_done" src="/sounds/donpaf.mp3"></audio>
        </Layout>
    )
}
