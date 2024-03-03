import { useEffect, useState } from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'

import { findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import { IconName } from '@fortawesome/fontawesome-common-types'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Layout from '@/Layouts/Layout'
import { PageProps } from '@/types'
import { formatDate, now } from '@/utils/date'
import { get } from '@/utils/api'
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

export default function CalendarPage({ auth }: PageProps) {
    const [dispDate, setDispDate] = useState(now('yyyy-MM-01'))
    const [events, setEvents] = useState<Events[]>([])
    const [point, setPoint] = useState(0)

    const pointRate = 10

    useEffect(() => {
        async function fetchData() {
            const checkList = await get<Check[]>(`/api/check?date=${dispDate}`)
            console.log(checkList)

            if (checkList) {
                const events: Events[] = checkList
                    .filter((item) => item.all_done_at)
                    .map((item) => {
                        return {
                            start: item.all_done_at
                        }
                    })
                setEvents(events)

                const houseChecks = checkList.filter((item) => item.type == 'house')
                let houseCheckCount = 0
                houseChecks.map((item) => {
                    houseCheckCount += item.todos.filter((todo) => todo.is_done).length
                })

                setPoint((events.length + houseCheckCount) * pointRate)
            }
        }
        fetchData()
    }, [])

    function handleDispDate(info: any) {
        setDispDate(formatDate(info.view.currentStart))
    }

    return (
        <Layout user={auth.user} title="Calendar">
            <div className="-mb-20 relative">
                <div className="total absolute">
                    <div className="relative flex justify-center pt-1 px-4">
                        <FontAwesomeIcon icon={faCrown} className="text-yellow-200" />
                        <h5 className="text-md font-extrabold text-rose-500 absolute mt-2">
                            {point}
                        </h5>
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
                />
            </div>
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
        <div className="flex items-center w-full text-xl justify-center text-yellow-400">
            <FontAwesomeIcon icon={icon} />
        </div>
    )
}

function renderDayCellContent(e: { dayNumberText: string }) {
    return e.dayNumberText.replace('日', '')
}
