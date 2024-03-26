import { Link } from '@inertiajs/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faGift, faGear, faPencil } from '@fortawesome/free-solid-svg-icons'

import { isMorning } from '@/utils/date'

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 z-20 w-full bg-blue-800 p-2 text-white shadow">
      <div className="flex flex-row items-center text-xl">
        <Link href="/" className="flex basis-1/4 justify-center">
          <button
            type="button"
            className={
              'inline-flex rounded-full p-2.5 ' +
              (route().current('todo') ? 'text-yellow-300' : 'text-white hover:bg-blue-700')
            }
          >
            <FontAwesomeIcon icon={isMorning ? faSun : faMoon} />
          </button>
        </Link>
        <Link href="/study" className="flex basis-1/4 justify-center">
          <button
            type="button"
            className={
              'inline-flex rounded-full p-2.5 ' +
              (route().current('study') ? 'text-yellow-300' : 'text-white hover:bg-blue-700')
            }
          >
            <FontAwesomeIcon icon={faPencil} />
          </button>
        </Link>
        <Link href="/calendar" className="flex basis-1/4 justify-center">
          <button
            type="button"
            className={
              'inline-flex rounded-full p-2.5 ' +
              (route().current('calendar') ? 'text-yellow-300' : 'text-white hover:bg-blue-700')
            }
          >
            <FontAwesomeIcon icon={faGift} />
          </button>
        </Link>
        <Link href="/settings" className="flex basis-1/4 justify-center">
          <button
            type="button"
            className={
              'inline-flex rounded-full p-2.5 ' +
              (route().current('settings') ? 'text-yellow-300' : 'text-white hover:bg-blue-700')
            }
          >
            <FontAwesomeIcon icon={faGear} />
          </button>
        </Link>
      </div>
    </footer>
  )
}
