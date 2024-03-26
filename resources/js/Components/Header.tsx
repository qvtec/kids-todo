import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

import { DateWeek, isMorning } from '@/utils/date'

export default function Header() {
  return (
    <div className="w-full bg-blue-800 px-4 py-2 text-white">
      <span>{DateWeek()}</span>
      <FontAwesomeIcon icon={isMorning ? faSun : faMoon} className="ml-2" />
    </div>
  )
}
