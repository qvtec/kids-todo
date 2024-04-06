import { Check, Todo } from '@/types'

import { formatDate } from '@/utils/date'
import { faCrown, faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  selectEvent?: Check
  todoAll?: Todo[]
  pointRate: number
  onClose: () => void
}

export default function CalendarDetailModal({ selectEvent, todoAll, pointRate, onClose }: Props) {
  if (!selectEvent || !todoAll) return

  return (
    <>
      <div className="flex text-lg font-medium leading-6 text-gray-900">
        {formatDate(selectEvent.date, 'y年M月d日')}
        {selectEvent && (
          <div className="relative -mt-3 ml-3 h-10 w-10">
            <FontAwesomeIcon icon={faCrown} className="absolute left-0 top-0 h-10 w-10 text-yellow-300" />
            <div className="shadow-text absolute left-0 top-4 w-10 text-center text-sm font-bold text-rose-500">
              {selectEvent.type == 'todo'
                ? selectEvent.all_done_at
                  ? pointRate
                  : 0
                : selectEvent.todos.filter((item) => item.is_done).length * pointRate}
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 min-w-52">
        {selectEvent.todos?.map((item, i) => (
          <div className="flex items-center rounded-lg" key={i}>
            <div className="flex h-10 w-10 shrink-0 items-center">
              <FontAwesomeIcon icon={item.is_done ? faSquareCheck : faSquare} className="text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-900">{todoAll.find((todo) => todo.id == item.todo_id)?.name}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={onClose}
        >
          とじる
        </button>
      </div>
    </>
  )
}
