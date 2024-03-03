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
import Loading from '@/Components/Loading'

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
    const [loading, setLoading] = useState(true)
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

        setLoading(false)
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

    if (loading || !data) return <Loading />

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

            <div className="hidden gap-x-2 gap-y-8">
                <div className="2xl:contents">
                    <div className="text-sm font-semibold text-slate-900">gray</div>
                    <div className="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2 sm:mt-2 2xl:mt-0">
                        <div className={"h-10 w-10 rounded" + ` text-gray-50`  + ` bg-gray-50`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-gray-100` + ` bg-gray-100`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-gray-200` + ` bg-gray-200`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-gray-300` + ` bg-gray-300`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-gray-400` + ` bg-gray-400`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-gray-500` + ` bg-gray-500`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-gray-600` + ` bg-gray-600`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-gray-700` + ` bg-gray-700`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-gray-800` + ` bg-gray-800`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-gray-900` + ` bg-gray-900`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-gray-950` + ` bg-gray-950`}></div>
                    </div>
                </div>
                <div className="2xl:contents">
                    <div className="text-sm font-semibold text-slate-900">red</div>
                    <div className="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2 sm:mt-2 2xl:mt-0">
                        <div className={"h-10 w-10 rounded" + ` text-red-50`  + ` bg-red-50`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-red-100` + ` bg-red-100`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-red-200` + ` bg-red-200`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-red-300` + ` bg-red-300`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-red-400` + ` bg-red-400`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-red-500` + ` bg-red-500`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-red-600` + ` bg-red-600`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-red-700` + ` bg-red-700`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-red-800` + ` bg-red-800`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-red-900` + ` bg-red-900`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-red-950` + ` bg-red-950`}></div>
                    </div>
                </div>
                <div className="2xl:contents">
                    <div className="text-sm font-semibold text-slate-900">orange</div>
                    <div className="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2 sm:mt-2 2xl:mt-0">
                        <div className={"h-10 w-10 rounded" + ` text-orange-50`  + ` bg-orange-50`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-orange-100` + ` bg-orange-100`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-orange-200` + ` bg-orange-200`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-orange-300` + ` bg-orange-300`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-orange-400` + ` bg-orange-400`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-orange-500` + ` bg-orange-500`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-orange-600` + ` bg-orange-600`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-orange-700` + ` bg-orange-700`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-orange-800` + ` bg-orange-800`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-orange-900` + ` bg-orange-900`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-orange-950` + ` bg-orange-950`}></div>
                    </div>
                </div>
                <div className="2xl:contents">
                    <div className="text-sm font-semibold text-slate-900">yellow</div>
                    <div className="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2 sm:mt-2 2xl:mt-0">
                        <div className={"h-10 w-10 rounded" + ` text-yellow-50`  + ` bg-yellow-50`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-yellow-100` + ` bg-yellow-100`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-yellow-200` + ` bg-yellow-200`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-yellow-300` + ` bg-yellow-300`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-yellow-400` + ` bg-yellow-400`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-yellow-500` + ` bg-yellow-500`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-yellow-600` + ` bg-yellow-600`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-yellow-700` + ` bg-yellow-700`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-yellow-800` + ` bg-yellow-800`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-yellow-900` + ` bg-yellow-900`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-yellow-950` + ` bg-yellow-950`}></div>
                    </div>
                </div>
                <div className="2xl:contents">
                    <div className="text-sm font-semibold text-slate-900">lime</div>
                    <div className="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2 sm:mt-2 2xl:mt-0">
                        <div className={"h-10 w-10 rounded" + ` text-lime-50`  + ` bg-lime-50`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-lime-100` + ` bg-lime-100`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-lime-200` + ` bg-lime-200`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-lime-300` + ` bg-lime-300`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-lime-400` + ` bg-lime-400`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-lime-500` + ` bg-lime-500`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-lime-600` + ` bg-lime-600`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-lime-700` + ` bg-lime-700`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-lime-800` + ` bg-lime-800`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-lime-900` + ` bg-lime-900`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-lime-950` + ` bg-lime-950`}></div>
                    </div>
                </div>
                <div className="2xl:contents">
                    <div className="text-sm font-semibold text-slate-900">green</div>
                    <div className="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2 sm:mt-2 2xl:mt-0">
                        <div className={"h-10 w-10 rounded" + ` text-green-50`  + ` bg-green-50`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-green-100` + ` bg-green-100`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-green-200` + ` bg-green-200`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-green-300` + ` bg-green-300`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-green-400` + ` bg-green-400`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-green-500` + ` bg-green-500`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-green-600` + ` bg-green-600`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-green-700` + ` bg-green-700`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-green-800` + ` bg-green-800`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-green-900` + ` bg-green-900`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-green-950` + ` bg-green-950`}></div>
                    </div>
                </div>
                <div className="2xl:contents">
                    <div className="text-sm font-semibold text-slate-900">teal</div>
                    <div className="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2 sm:mt-2 2xl:mt-0">
                        <div className={"h-10 w-10 rounded" + ` text-teal-50`  + ` bg-teal-50`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-teal-100` + ` bg-teal-100`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-teal-200` + ` bg-teal-200`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-teal-300` + ` bg-teal-300`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-teal-400` + ` bg-teal-400`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-teal-500` + ` bg-teal-500`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-teal-600` + ` bg-teal-600`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-teal-700` + ` bg-teal-700`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-teal-800` + ` bg-teal-800`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-teal-900` + ` bg-teal-900`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-teal-950` + ` bg-teal-950`}></div>
                    </div>
                </div>
                <div className="2xl:contents">
                    <div className="text-sm font-semibold text-slate-900">blue</div>
                    <div className="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2 sm:mt-2 2xl:mt-0">
                        <div className={"h-10 w-10 rounded" + ` text-blue-50`  + ` bg-blue-50`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-blue-100` + ` bg-blue-100`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-blue-200` + ` bg-blue-200`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-blue-300` + ` bg-blue-300`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-blue-400` + ` bg-blue-400`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-blue-500` + ` bg-blue-500`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-blue-600` + ` bg-blue-600`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-blue-700` + ` bg-blue-700`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-blue-800` + ` bg-blue-800`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-blue-900` + ` bg-blue-900`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-blue-950` + ` bg-blue-950`}></div>
                    </div>
                </div>
                <div className="2xl:contents">
                    <div className="text-sm font-semibold text-slate-900">violet</div>
                    <div className="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2 sm:mt-2 2xl:mt-0">
                        <div className={"h-10 w-10 rounded" + ` text-violet-50`  + ` bg-violet-50`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-violet-100` + ` bg-violet-100`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-violet-200` + ` bg-violet-200`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-violet-300` + ` bg-violet-300`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-violet-400` + ` bg-violet-400`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-violet-500` + ` bg-violet-500`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-violet-600` + ` bg-violet-600`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-violet-700` + ` bg-violet-700`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-violet-800` + ` bg-violet-800`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-violet-900` + ` bg-violet-900`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-violet-950` + ` bg-violet-950`}></div>
                    </div>
                </div>
                <div className="2xl:contents">
                    <div className="text-sm font-semibold text-slate-900">purple</div>
                    <div className="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2 sm:mt-2 2xl:mt-0">
                        <div className={"h-10 w-10 rounded" + ` text-purple-50`  + ` bg-purple-50`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-purple-100` + ` bg-purple-100`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-purple-200` + ` bg-purple-200`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-purple-300` + ` bg-purple-300`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-purple-400` + ` bg-purple-400`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-purple-500` + ` bg-purple-500`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-purple-600` + ` bg-purple-600`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-purple-700` + ` bg-purple-700`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-purple-800` + ` bg-purple-800`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-purple-900` + ` bg-purple-900`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-purple-950` + ` bg-purple-950`}></div>
                    </div>
                </div>
                <div className="2xl:contents">
                    <div className="text-sm font-semibold text-slate-900">pink</div>
                    <div className="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2 sm:mt-2 2xl:mt-0">
                        <div className={"h-10 w-10 rounded" + ` text-pink-50`  + ` bg-pink-50`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-pink-100` + ` bg-pink-100`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-pink-200` + ` bg-pink-200`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-pink-300` + ` bg-pink-300`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-pink-400` + ` bg-pink-400`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-pink-500` + ` bg-pink-500`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-pink-600` + ` bg-pink-600`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-pink-700` + ` bg-pink-700`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-pink-800` + ` bg-pink-800`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-pink-900` + ` bg-pink-900`}></div>
                        <div className={"h-10 w-10 rounded" + ` text-pink-950` + ` bg-pink-950`}></div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
