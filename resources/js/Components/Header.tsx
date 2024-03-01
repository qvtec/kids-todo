import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

import { isMorning } from '@/utils/date'

export default function Header() {
    const now = new Date()
    const formattedDate = format(now, 'yyyy年M月d日 (E)', { locale: ja })

    return (
        <div className="bg-blue-800 text-white w-full py-2 px-4">
            <span>{formattedDate}</span>
            <FontAwesomeIcon icon={isMorning ? faSun : faMoon} className="ml-2" />
        </div>
    )
}
