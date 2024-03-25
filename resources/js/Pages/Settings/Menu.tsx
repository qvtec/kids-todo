import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faUser, faRightFromBracket, faPencil } from '@fortawesome/free-solid-svg-icons'
import { PageProps } from '@/types'
import { Link } from '@inertiajs/react'
import Layout from '@/Layouts/Layout'

export default function SettingsMenuPage({ auth }: PageProps) {
  return (
    <Layout user={auth.user} title="Home">
      <div className="m-3 max-w-sm rounded-lg border border-gray-200 bg-white text-gray-900">
        <Link href="/">
          <button
            type="button"
            className="relative inline-flex w-full items-center rounded-t-lg border-b border-gray-200 px-4 py-6 text-sm font-medium hover:bg-gray-100 hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="me-2.5 h-4 w-4" />
            ログアウト
          </button>
        </Link>
        <Link href="/admin/todo">
          <button
            type="button"
            className="relative inline-flex w-full items-center border-b border-gray-200 px-4 py-6 text-sm font-medium hover:bg-gray-100 hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faCrown} className="me-2.5 h-4 w-4" />
            タスク編集
          </button>
        </Link>
        <Link href="/admin/user">
          <button
            type="button"
            className="relative inline-flex w-full items-center border-b border-gray-200 px-4 py-6 text-sm font-medium hover:bg-gray-100 hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faUser} className="me-2.5 h-4 w-4" />
            ユーザ一覧
          </button>
        </Link>
        <Link href="/admin/study">
          <button
            type="button"
            className="relative inline-flex w-full items-center border-b border-gray-200 px-4 py-6 text-sm font-medium hover:bg-gray-100 hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faPencil} className="me-2.5 h-4 w-4" />
            study master
          </button>
        </Link>
      </div>
    </Layout>
  )
}
