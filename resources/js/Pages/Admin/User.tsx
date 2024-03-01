import Layout from '@/Layouts/Layout'
import useAdmin from '@/hooks/useAdmin'
import { PageProps, User } from '@/types'

import ButtonDanger from '@/Components/ButtonDanger'
import ButtonPrimary from '@/Components/ButtonPrimary'
import Input from '@/Components/Input'
import Label from '@/Components/Label'
import Loading from '@/Components/Loading'
import { get, put, remove } from '@/utils/api'
import { formatDateTime } from '@/utils/date'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

interface UserForm {
    role?: string
}

export default function UserPage({ auth }: PageProps) {
    const [data, setData] = useState<User[] | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [editUser, setEditUser] = useState<User | undefined>(undefined)

    const [formData, setFormData] = useState<UserForm>()

    const isAdmin = useAdmin(auth.user)

    useEffect(() => {
        async function fetchData() {
          const res = await get<User[]>(`/api/admin/user`)
          if (res) {
            setData(res)
            setLoading(false)
          }
        }
        fetchData()
    }, [])

    function onClickShowEdit(user: User) {
        setEditUser(user)
        setFormData({
            role: user.role,
        })
    }

    async function onClickDelete(user: User) {
        if (confirm('本当に削除しますか？')) {
            await remove<User[]>(`/api/admin/user/${user.id}`)

            if (!data || !user) return
            const updated = data.filter((item) => item.id != user.id)
            setData(updated)
        }
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    async function submitForm(e: FormEvent) {
        e.preventDefault()
        if (!editUser || !formData) return
        setLoading(true)
        const res = await put<User>(`/api/admin/user/${editUser.id}`, formData)
        setLoading(false)

        if (!data || !res) return
        const updated = data.map((item) => (item.id === editUser.id ? { ...editUser, ...formData } : item))
        setData(updated)
    }

    if (loading || !data) return <Loading />

    return (
        <Layout user={auth.user} title="User">
            <div className="mx-auto max-w-xl p-4">
                {editUser && (
                    <form onSubmit={submitForm}>
                        <p>{editUser.name}</p>
                        <Label htmlFor="role">role</Label>
                        <Input type="text" name="role" value={formData?.role ?? ''} className="mt-1 block w-full" onChange={handleInputChange} />
                        <ButtonPrimary className="mt-2">更新</ButtonPrimary>
                    </form>
                )}
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 lg:py-16">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-left text-sm text-gray-500 rtl:text-right">
                    <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-900">
                    <tr>
                        <th scope="col" className="px-6 py-3">id</th>
                        <th scope="col" className="px-6 py-3">name</th>
                        <th scope="col" className="px-6 py-3">email</th>
                        <th scope="col" className="px-6 py-3">role</th>
                        <th scope="col" className="px-6 py-3">date</th>
                        <th scope="col" className="px-6 py-3"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((user, i) => (
                        <tr key={i}>
                            <td className="px-6 py-4">{user.id}</td>
                            <td className="px-6 py-4">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4">
                                {formatDateTime(user.created_at.toLocaleString())}
                                <br />
                                {formatDateTime(user.updated_at.toLocaleString())}
                            </td>
                            <td className="px-6 py-4">
                                <ButtonPrimary onClick={() => onClickShowEdit(user)}>編集</ButtonPrimary>
                                <ButtonDanger onClick={() => onClickDelete(user)} className='ml-4'>削除</ButtonDanger>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </Layout>
    )
}
