import { useEffect, useState } from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'

import { findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import { IconName } from '@fortawesome/fontawesome-common-types'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Layout from '@/Layouts/Layout'
import { PageProps } from '@/types'
import { formatDate, now } from '@/utils/date'
import { get } from '@/utils/api'
import { DatesSetArg, EventClickArg } from '@fullcalendar/core/index.js'
import { format } from 'date-fns'
import Modal from '@/Components/Modal'

library.add(fas)

interface Events {
    start: string
    title?: string // iconName
}

interface Check {
    id: number
    date: string
    type: string
    todos: CheckTodo[]
    all_done_at: string
}
interface CheckTodo {
    todo_id: number
    is_done: boolean
}

interface Todo {
    id: number
    name: string
    time: string
    icon: string
    color: string
    type: string
}

export default function CalendarPage({ auth }: PageProps) {
    const [checks, setChecks] = useState<Check[]>()
    const [todoAll, setTodoAll] = useState<Todo[]>()
    const [dispDate, setDispDate] = useState(now('yyyy-MM-01'))
    const [events, setEvents] = useState<Events[]>([])
    const [point, setPoint] = useState(0)
    const [showEventModal, setShowEventModal] = useState(false)
    const [selectEvent, setSelectEvent] = useState<Check>()

    const pointRate = 10

    useEffect(() => {
        fetchData()
    }, [dispDate])

    async function fetchData() {
        const checkList = await get<Check[]>(`/api/check?date=${dispDate}`)
        setChecks(checkList)

        const todoAllList = await get<Todo[]>(`/api/todo-all`)
        setTodoAll(todoAllList)

        if (checkList) {
            const events = filterEevnt(checkList)
            setEvents(events)

            const point = countPoint(checkList)
            setPoint(point)
        }
    }

    function filterEevnt(checkList: Check[]) {
        const events: Events[] = checkList
            .filter((item) => item.todos.length > 0)
            .map((item) => {
                return {
                    id: item.id,
                    start: item.all_done_at ? item.all_done_at : item.date,
                    title: item.type == 'todo' ? 'crown' : 'house',
                }
            })
        return events
    }

    function countPoint(checkList: Check[]) {
        const houseChecks = checkList.filter((item) => item.type == 'house')
        let houseCheckCount = 0
        houseChecks.map((item) => {
            houseCheckCount += item.todos.filter((todo) => todo.is_done).length
        })

        const todoChecks = checkList.filter((item) => item.type == 'todo' && item.all_done_at)
        const todoCheckCount = todoChecks.length

        return (houseCheckCount + todoCheckCount) * pointRate
    }

    function handleDispDate(info: DatesSetArg) {
        const currentDispDate = format(info.view.currentStart, 'yyyy-MM-dd')
        if (dispDate != currentDispDate) {
            setDispDate(currentDispDate)
        }
    }

    function handleEventClick(info: EventClickArg) {
        const checkEvent = checks?.find((item) => item.id == Number(info.event.id))
        setSelectEvent(checkEvent)
        setShowEventModal(true)
    }

    return (
        <Layout user={auth.user} title="Calendar">
            <div className="-mb-20 relative">
                <div className="absolute ml-3 p-1">
                    <div className="relative w-10 h-10">
                        <FontAwesomeIcon icon={faCrown} className="absolute w-10 h-10 top-0 left-0 text-yellow-300" />
                        <div className="absolute w-10 top-4 left-0 text-rose-500 font-bold shadow-text text-center">{point}</div>
                    </div>
                </div>
                <FullCalendar
                    locales={[jaLocale]}
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    contentHeight={'auto'}
                    eventContent={renderEventContent}
                    dayCellContent={renderDayCellContent}
                    datesSet={handleDispDate}
                    eventClick={handleEventClick}
                />
            </div>
            <Modal show={showEventModal} onClose={() => setShowEventModal(false)}>
                { selectEvent && todoAll && (
                    <>
                        <div className="flex text-lg font-medium leading-6 text-gray-900">
                            { formatDate(selectEvent.date, 'y年M月d日') }
                            { selectEvent.all_done_at && (
                                <div className="relative w-10 h-10 ml-3 -mt-3">
                                    <FontAwesomeIcon icon={faCrown} className="absolute w-10 h-10 top-0 left-0 text-yellow-300" />
                                    <div className="absolute w-10 top-4 left-0 text-rose-500 font-bold text-sm shadow-text text-center">
                                        { selectEvent.type == 'todo' ? pointRate : selectEvent.todos.filter((item) => item.is_done).length * pointRate }
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-2 min-w-52">
                            {selectEvent.todos?.map((item, i) => (
                                <div className="flex items-center rounded-lg">
                                    <div className="flex h-10 w-10 shrink-0 items-center">
                                        <FontAwesomeIcon icon={item.is_done ? faSquareCheck : faSquare} className="text-gray-500" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        { todoAll.find((todo) => todo.id == item.todo_id)?.name }
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                onClick={() => setShowEventModal(false)}
                            >
                                とじる
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </Layout>
    )
}

function renderEventContent(eventInfo: { event: { title: string } }) {
    let icon = faCrown
    if (eventInfo.event.title) {
        const iconName: IconName = eventInfo.event.title as IconName
        icon = findIconDefinition({ prefix: 'fas', iconName: iconName })
    }
    return (
        <div className="flex items-center w-full text-xl justify-center">
            <FontAwesomeIcon icon={icon} className={eventInfo.event.title == 'house' ? 'text-blue-400' :  'text-yellow-400'} />
        </div>
    )
}

function renderDayCellContent(e: { dayNumberText: string }) {
    return e.dayNumberText.replace('日', '')
}
