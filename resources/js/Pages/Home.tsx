import Layout from '@/Layouts/Layout'
import useAdmin from '@/hooks/useAdmin'
import { PageProps } from '@/types'
import { Link } from '@inertiajs/react'

export default function Home({ auth }: PageProps) {
    const isAdmin = useAdmin(auth.user)

    const adminMenu = [
        { name: 'ユーザ管理', href: `/admin/user` },
    ]

    return (
        <Layout user={auth.user} title="Home">
            <div className="px-4">
                <div className="my-8 p-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <Link href={`/sample`} className="block max-w-full rounded-lg border border-gray-200 p-6 shadow hover:bg-gray-100">
                            <div className="flex flex-col items-center text-sm text-gray-500">Sample</div>
                        </Link>
                    </div>
                </div>

                {isAdmin && (
                    <div className="my-8 border-2 border-dotted p-4">
                        <div className="-mt-7 mb-4 w-40 bg-white text-center text-gray-500">管理者用リンク</div>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {adminMenu.map(({ href, name }, i) => (
                                <Link key={i} href={href} className="block max-w-full rounded-lg border border-gray-200 p-6 shadow hover:bg-gray-100">
                                    <div className="flex flex-col items-center text-sm text-gray-500">{name}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
