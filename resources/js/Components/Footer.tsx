import { Link } from '@inertiajs/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSun,
  faMoon,
  faHandSparkles,
  faGift,
  faGear,
} from '@fortawesome/free-solid-svg-icons'

import { isMorning } from '@/utils/date'

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 z-20 w-full p-2 text-white bg-blue-800 shadow">
            <div className="flex flex-row items-center text-xl">
                <Link href="/todo?type=todo" className="basis-1/4 flex justify-center">
                    <button type="button" className={'rounded-full p-2.5 inline-flex ' + route().current('todo') ? 'text-yellow-300' : 'hover:bg-blue-700'}>
                        <FontAwesomeIcon icon={isMorning ? faSun : faMoon} />
                    </button>
                </Link>
                <Link href="/todo?type=chores" className="basis-1/4 flex justify-center">
                    <button type="button" className={'rounded-full p-2.5 inline-flex ' + route().current('todo') ? 'text-yellow-300' : 'hover:bg-blue-700'}>
                        <FontAwesomeIcon icon={faHandSparkles} />
                    </button>
                </Link>
                <Link href="/calendar" className="basis-1/4 flex justify-center">
                    <button type="button" className={'rounded-full p-2.5 inline-flex ' + route().current('calendar') ? 'text-yellow-300' : 'hover:bg-blue-700'}>
                        <FontAwesomeIcon icon={faGift} />
                    </button>
                </Link>
                <Link href="/settings/menu" className="basis-1/4 flex justify-center">
                    <button type="button" className={'rounded-full p-2.5 inline-flex ' + route().current('settings') ? 'text-yellow-300' : 'hover:bg-blue-700'}>
                        <FontAwesomeIcon icon={faGear} />
                    </button>
                </Link>
            </div>
        </footer>
    )
}
