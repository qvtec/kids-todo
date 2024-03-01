import { Head, Link } from '@inertiajs/react'

export default function Login({ status }: { status: string }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <Head title="Login" />

                <Link href="/">
                    <img src="/pwa-192x192.png" className="mx-auto my-2 w-20 h-20 fill-current text-gray-500" height="48" width="48" />
                </Link>

                <div className="my-4 flex items-center justify-center">
                    <a href={ route('google.login') } className="flex w-60 items-center justify-center rounded border border-gray-200 bg-white px-7 py-2 text-sm font-medium shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg">
                        <img src="/img/google.svg" alt="google" className="h-8 w-8 pr-2" width={32} height={32} />
                        Sign in with Google
                    </a>
                </div>
                {status == 'pending' && <div className="text-gray-500 text-center mt-4">管理者の承認をお待ちください</div>}
            </div>
        </div>
    )
}
