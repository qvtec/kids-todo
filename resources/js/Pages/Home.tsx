import Layout from '@/Layouts/Layout'
import useAdmin from '@/hooks/useAdmin'
import { PageProps } from '@/types'
import { Link } from '@inertiajs/react'
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
import { isMorning } from '@/utils/date'

interface Schedules {
  id: number
  name: string
  time: string
  iconName: string
  color: string
  icon?: IconDefinition
  is_done: boolean
  type: string
}

async function getSchedules(date: string) {
  console.log(date)
  const schedule: Schedules[] = [
    {
      id: 1,
      name: '朝ごはん',
      time: '7:00',
      iconName: 'utensils',
      color: 'text-gray-600',
      is_done: true,
      type: 'todo',
    },
    {
      id: 2,
      name: '歯みがき',
      time: '7:00',
      iconName: 'tooth',
      color: 'text-green-600',
      is_done: false,
      type: 'todo',
    },
    {
      id: 3,
      name: 'きがえ',
      time: '7:00',
      iconName: 'shirt',
      color: 'text-red-600',
      is_done: false,
      type: 'todo',
    },
    {
      id: 4,
      name: 'くつをならべる',
      time: '20:00',
      iconName: 'shoe-prints',
      color: 'text-gray-600',
      is_done: true,
      type: 'todo',
    },
    {
      id: 5,
      name: '手をあらう',
      time: '20:00',
      iconName: 'hand-sparkles',
      color: 'text-orange-400',
      is_done: false,
      type: 'todo',
    },
    {
      id: 6,
      name: 'おふろ',
      time: '20:00',
      iconName: 'bath',
      color: 'text-blue-600',
      is_done: false,
      type: 'todo',
    },
    {
      id: 7,
      name: 'ふくをかたづける',
      time: '20:00',
      iconName: 'socks',
      color: 'text-red-600',
      is_done: false,
      type: 'todo',
    },
    {
      id: 8,
      name: 'あらいものをだす',
      time: '20:00',
      iconName: 'bottle-water',
      color: 'text-green-500',
      is_done: false,
      type: 'todo',
    },
    {
      id: 9,
      name: 'しゅくだい',
      time: '20:00',
      iconName: 'book',
      color: 'text-violet-600',
      is_done: false,
      type: 'todo',
    },
    {
      id: 10,
      name: 'はみがき',
      time: '20:00',
      iconName: 'tooth',
      color: 'text-gray-400',
      is_done: false,
      type: 'todo',
    },
    {
      id: 11,
      name: 'あしたのじゅんび',
      time: '20:00',
      iconName: 'school',
      color: 'text-pink-500',
      is_done: false,
      type: 'todo',
    },
    {
      id: 12,
      name: 'せんたくたたみ',
      time: '',
      iconName: 'tooth',
      color: 'text-gray-400',
      is_done: false,
      type: 'chores',
    },
    {
      id: 13,
      name: 'さらあらい',
      time: '',
      iconName: 'school',
      color: 'text-pink-500',
      is_done: false,
      type: 'chores',
    },
  ]
  return schedule
  // const apiURL = process.env.NEXT_PUBLIC_API_URL ?? ''
  // const res = await fetch(apiURL + '/kids-schedule')
  // return res.json()
}

export default function Home({ auth }: PageProps) {
    const { user } = auth

    const [isLoading, setIsLoading] = useState(true)
    const [schedules, setSchedules] = useState<Schedules[]>([])
    const [currentSchedules, setCurrentSchedules] = useState<Schedules[]>([])
    const [allDone, setAllDone] = useState(false)
    const [doneAnimOn, setDoneAnimOn] = useState(false)

    // const searchParams = useSearchParams()
    // const date = searchParams.get('date') || ''
    // const type = searchParams.get('type') || 'todo'
    const date = ''
    const type = 'todo'

    useEffect(() => {
      async function fetchData() {
        const result = await getSchedules(date)
        setSchedules(result)
      }
      fetchData()
      setIsLoading(false)
    }, [date])

    useEffect(() => {
      const filterSchedules = schedules.filter((schedule) => {
        if (type == 'todo') {
          const scheduleHour = parseInt(schedule.time.split(':')[0])
          return schedule.type == 'todo' && isMorning
            ? scheduleHour < 12
            : scheduleHour >= 12
        } else if (type == 'chores') {
          return schedule.type == 'chores'
        }
        return false
      })

      filterSchedules.forEach((item, i) => {
        const iconName: IconName = item.iconName as IconName
        filterSchedules[i]['icon'] = findIconDefinition({
          prefix: 'fas',
          iconName: iconName,
        })
      })
      setCurrentSchedules(filterSchedules)

      document.querySelectorAll('audio').forEach((el) => {
        el.load()
      })
    }, [schedules, type])

    useEffect(() => {
      const isAllDone = currentSchedules.every((schedule) => schedule.is_done)
      setAllDone(isAllDone)
    }, [currentSchedules])

    /**
     * CheckboxChange
     */
    async function handleCheckboxChange(id: number) {
      const updatedSchedules = currentSchedules.map((item) => {
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
      setCurrentSchedules(updatedSchedules)

      // const res = await fetch('/api/todo', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ id }),
      // })
      // console.log(res)
    }

    /**
     * AllDoneButtonClick
     */
    function handleAllDoneButtonClick() {
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
                {currentSchedules?.map((item, i) => (
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
                            {item.icon && <FontAwesomeIcon icon={item.icon} className={item.color + ' text-xl'} />}
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
