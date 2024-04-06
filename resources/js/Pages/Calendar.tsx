import { useEffect, useState } from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocale from '@fullcalendar/core/locales/ja'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import { IconName } from '@fortawesome/fontawesome-common-types'
import { library } from '@fortawesome/fontawesome-svg-core'
import Layout from '@/Layouts/Layout'
import { Answer, Check, PageProps, Todo } from '@/types'
import { formatDate, formatDateTime, now } from '@/utils/date'
import { get } from '@/utils/api'
import { DatesSetArg, EventClickArg } from '@fullcalendar/core/index.js'
import { format } from 'date-fns'
import Modal from '@/Components/Modal'
import CalendarDetailModal from '@/Components/Features/Calendar/DetailModal'
import CalendarDetailModalStudy from '@/Components/Features/Calendar/DetailModalStudy'

import { faCrown, faHouse, faPencil } from '@fortawesome/free-solid-svg-icons'
library.add(faCrown, faHouse, faPencil)

interface Events {
  start: string
  title?: string // iconName
}

export default function CalendarPage({ auth }: PageProps) {
  const [checks, setChecks] = useState<Check[]>()
  const [study, setStudy] = useState<Answer[]>()
  const [todoAll, setTodoAll] = useState<Todo[]>()
  const [dispDate, setDispDate] = useState(now('yyyy-MM-01'))
  const [events, setEvents] = useState<Events[]>([])
  const [point, setPoint] = useState(0)
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectEvent, setSelectEvent] = useState<Check>()
  const [selectEventStudy, setSelectEventStudy] = useState<Answer[]>()

  const POINT_RATE = 10

  useEffect(() => {
    fetchData()
  }, [dispDate])

  async function fetchData() {
    const checkList = await get<Check[]>(`/api/check?date=${dispDate}`)
    setChecks(checkList)
    const studyList = await get<Answer[]>(`/api/study/answer?date=${dispDate}`)
    setStudy(studyList)

    const todoAllList = await get<Todo[]>(`/api/todo-all`)
    setTodoAll(todoAllList)

    if (checkList) {
      const events = filterEevnt(checkList, studyList)
      setEvents(events)

      const point = countPoint(checkList, studyList)
      setPoint(point)
    }
  }

  function filterEevnt(checkList: Check[], studyList?: Answer[]) {
    const events: any[] = checkList
      .filter((item) => item.todos.length > 0)
      .map((item) => {
        return {
          id: item.id,
          start: item.all_done_at ? item.all_done_at : item.date,
          title: item.type == 'todo' ? 'crown' : 'house',
        }
      })

    if (studyList && studyList.length > 0) {
      const groupedData = studyDateGroup(studyList)
      Object.keys(groupedData).map((date) => {
        const is_complete = groupedData[date].some((item) => item.is_complete)
        events.push({
          id: events.length,
          start: is_complete ? formatDate(date, 'yyyy-MM-dd 07:00:00') : date,
          title: 'pencil',
        })
      })
    }
    return events
  }

  function countPoint(checkList: Check[], studyList?: Answer[]) {
    const houseChecks = checkList.filter((item) => item.type == 'house')
    let houseCheckCount = 0
    houseChecks.map((item) => {
      houseCheckCount += item.todos.filter((todo) => todo.is_done).length
    })

    const todoChecks = checkList.filter((item) => item.type == 'todo' && item.all_done_at)
    const todoCheckCount = todoChecks.length

    let studyCount = 0
    if (studyList && studyList.length > 0) {
      const groupedData = studyDateGroup(studyList)
      studyCount = Object.keys(groupedData).length
    }

    return (houseCheckCount + todoCheckCount + studyCount) * POINT_RATE
  }

  function studyDateGroup(study: Answer[]) {
    type AnswerDateGroup = { [date: string]: Answer[] }
    const groupedData: AnswerDateGroup = study.reduce((acc: AnswerDateGroup, obj) => {
      const date = formatDate(obj.created_at)
      if (!acc[date]) acc[date] = []
      acc[date].push(obj)
      return acc
    }, {})
    return groupedData
  }

  function handleDispDate(info: DatesSetArg) {
    const currentDispDate = format(info.view.currentStart, 'yyyy-MM-dd')
    if (dispDate != currentDispDate) {
      setDispDate(currentDispDate)
    }
  }

  function handleEventClick(info: EventClickArg) {
    if (info.event.title.includes('pen')) {
      const start = formatDate(info.event.start?.toString() || '')
      const studyEvents = study?.filter((item) => item.created_at.includes(start))
      setSelectEventStudy(studyEvents)
      setSelectEvent(undefined)
    } else {
      const checkEvent = checks?.find((item) => item.id == Number(info.event.id))
      setSelectEvent(checkEvent)
      setSelectEventStudy(undefined)
    }
    setShowEventModal(true)
  }

  return (
    <Layout user={auth.user} title="Calendar">
      <div className="relative -mb-20">
        <div className="absolute ml-3 p-1">
          <div className="relative h-10 w-10">
            <FontAwesomeIcon icon={faCrown} className="absolute left-0 top-0 h-10 w-10 text-yellow-300" />
            <div className="shadow-text absolute left-0 top-4 w-10 text-center font-bold text-rose-500">{point}</div>
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
        {selectEventStudy ? (
          <CalendarDetailModalStudy selectEvents={selectEventStudy} onClose={() => setShowEventModal(false)} />
        ) : (
          <CalendarDetailModal
            selectEvent={selectEvent}
            todoAll={todoAll}
            pointRate={POINT_RATE}
            onClose={() => setShowEventModal(false)}
          />
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

  let color = 'text-yellow-400'
  switch (eventInfo.event.title) {
    case 'house':
      color = 'text-blue-400'
      break
    case 'pencil':
      color = 'text-purple-400'
      break
    case 'pen':
      color = 'text-gray-400'
      break
    default:
      color = 'text-yellow-400'
      break
  }
  return (
    <div className="flex w-full items-center justify-center text-xl">
      <FontAwesomeIcon icon={icon} className={color} />
    </div>
  )
}

function renderDayCellContent(e: { dayNumberText: string }) {
  return e.dayNumberText.replace('日', '')
}
