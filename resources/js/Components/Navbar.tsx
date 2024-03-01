import { useState } from 'react'
import { Link } from '@inertiajs/react'
import { User } from '@/types'

export default function Navbar({ user }: { user: User }) {
    const [isShowNavSP, setIsShowNavSP] = useState(false)

    return (
        <nav className="fixed start-0 top-0 z-20 w-full bg-cyan-700">
            <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-2">
                <Link href="/" className="flex items-center space-x-3 text-white rtl:space-x-reverse">
                    <img src="/img/user.svg" alt="App Logo" className="h-8 w-8" width={54} height={54} />
                    <span className="self-center whitespace-nowrap text-2xl font-semibold">Kids Todo APP</span>
                </Link>
                <div className="flex items-center space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
                    <span className='text-white'>{user.name}</span>

                    <button type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 md:hidden"
                        onClick={() => setIsShowNavSP((previousState) => !previousState)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <img src="/img/menu.svg" alt="menu" className="h-5 w-5" width={17} height={14} />
                    </button>
                </div>
                <div className={(isShowNavSP ? '' : 'hidden') + ' w-full items-center justify-between md:order-1 md:flex md:w-auto'}>
                    <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 rtl:space-x-reverse">
                        <li>
                            <Link href="/" className={'block rounded px-3 py-2 text-white md:p-0' + (route().current('home') ? ' text-cyan-500' : ' hover:text-sky-200')}>
                                HOME
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
