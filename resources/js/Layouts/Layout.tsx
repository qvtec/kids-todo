import { PropsWithChildren } from 'react'
import { Head } from '@inertiajs/react'
import { User } from '@/types'
import Header from '@/Components/Header'
import Footer from '@/Components/Footer'

import '../../css/main.scss'

export default function Layout({ user, title, children }: PropsWithChildren<{ user: User; title?: string }>) {
  return (
    <>
      <Head title={title} />
      <Header />
      <main className="flex flex-col items-center justify-start pb-20">{children}</main>
      <Footer />
    </>
  )
}
