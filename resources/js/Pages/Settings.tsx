import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { PageProps } from '@/types'
import { Link } from '@inertiajs/react'
import Layout from '@/Layouts/Layout'

export default function SettingsMenuPage({ auth }: PageProps) {
    function logout() {
        console.log('logout')
    }

    return (
        <Layout user={auth.user} title="Home">
            <div className="max-w-sm m-3 text-gray-900 bg-white border border-gray-200 rounded-lg">
                <button
                    type="button"
                    onClick={logout}
                    className="relative inline-flex items-center w-full px-4 py-6 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700"
                >
                    <FontAwesomeIcon
                        icon={faRightFromBracket}
                        className="w-4 h-4 me-2.5"
                    />
                    ログアウト
                </button>
                <Link href="/todo/edit">
                    <button
                        type="button"
                        className="relative inline-flex items-center w-full px-4 py-6 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700"
                    >
                        <FontAwesomeIcon icon={faCrown} className="w-4 h-4 me-2.5" />
                        リスト編集
                    </button>
                </Link>
                <Link href="/todo/edit">
                    <button
                        type="button"
                        className="relative inline-flex items-center w-full px-4 py-6 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700"
                    >
                        <FontAwesomeIcon icon={faCrown} className="w-4 h-4 me-2.5" />
                        タスク登録
                    </button>
                </Link>
            </div>
        </Layout>
    )
}
