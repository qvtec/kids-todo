import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { PageProps } from '@/types'
import { Link } from '@inertiajs/react'
import Layout from '@/Layouts/Layout'

export default function SettingsMenuPage({ auth }: PageProps) {
    return (
        <Layout user={auth.user} title="Home">
            <div className="max-w-sm m-3 text-gray-900 bg-white border border-gray-200 rounded-lg">
                <Link href="/">
                    <button
                        type="button"
                        className="relative inline-flex items-center w-full px-4 py-6 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700"
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4 me-2.5" />
                        ログアウト
                    </button>
                </Link>
                <Link href="/admin/todo">
                    <button
                        type="button"
                        className="relative inline-flex items-center w-full px-4 py-6 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700"
                    >
                        <FontAwesomeIcon icon={faCrown} className="w-4 h-4 me-2.5" />
                        タスク編集
                    </button>
                </Link>
                <Link href="/admin/user">
                    <button
                        type="button"
                        className="relative inline-flex items-center w-full px-4 py-6 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700"
                    >
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4 me-2.5" />
                        ユーザ一覧
                    </button>
                </Link>
                <Link href="/study">
                    <button
                        type="button"
                        className="relative inline-flex items-center w-full px-4 py-6 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700"
                    >
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4 me-2.5" />
                        study
                    </button>
                </Link>
            </div>
        </Layout>
    )
}
