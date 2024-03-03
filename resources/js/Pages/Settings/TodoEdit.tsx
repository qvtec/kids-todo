import Layout from '@/Layouts/Layout'
import useAdmin from '@/hooks/useAdmin'
import { PageProps } from '@/types'

import ButtonDanger from '@/Components/ButtonDanger'
import ButtonPrimary from '@/Components/ButtonPrimary'
import Input from '@/Components/Input'
import Label from '@/Components/Label'
import Loading from '@/Components/Loading'
import { get, post, put, remove } from '@/utils/api'
import { formatDateTime } from '@/utils/date'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import ButtonSecondary from '@/Components/ButtonSecondary'

interface UserForm {
    name: string
    time: string
    icon: string
    color: string
    type: string
}

interface Todo {
    id?: number
    name: string
    time: string
    icon: string
    color: string
    type: string
}

export default function TodoEditPage({ auth }: PageProps) {
    const [data, setData] = useState<Todo[] | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [edit, setEdit] = useState<Todo | undefined>(undefined)

    const [formData, setFormData] = useState<UserForm | undefined>(undefined)

    const isAdmin = useAdmin(auth.user)

    useEffect(() => {
        async function fetchData() {
          const res = await get<Todo[]>(`/api/todo`)
          if (res) {
            setData(res)
            setLoading(false)
          }
        }
        fetchData()
    }, [])

    function onClickShowEdit(todo: Todo) {
        setEdit(todo)
        setFormData({
            name: todo.name,
            time: todo.time,
            icon: todo.icon,
            color: todo.color,
            type: todo.type,
        })
    }

    function onClickShowCreate() {
        const initFormData = {
            name: '',
            time: '',
            icon: '',
            color: '',
            type: '',
        }
        setFormData(initFormData)
        setEdit(initFormData)
    }

    async function onClickDelete(user: Todo) {
        if (confirm('本当に削除しますか？')) {
            await remove<Todo[]>(`/api/todo/${user.id}`)

            if (!data || !user) return
            const updated = data.filter((item) => item.id != user.id)
            setData(updated)
        }
    }

    function handleInput(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        if (formData) {
            setFormData({ ...formData, [name]: value })
        }
    }

    async function submitForm(e: FormEvent) {
        e.preventDefault()
        if (!edit || !formData) return
        setLoading(true)
        if (edit.id) {
            await put<Todo>(`/api/todo/${edit.id}`, formData)
        } else {
            await post<Todo>(`/api/todo`, formData)
        }
        setLoading(false)

        if (!data) return
        const updated = data.map((item) => (item.id === edit.id ? { ...edit, ...formData } : item))
        setData(updated)
    }

    if (loading || !data) return <Loading />

    return (
        <Layout user={auth.user} title="User">
            <div className="mx-auto max-w-xl p-4">
                {edit && (
                    <form onSubmit={submitForm}>
                        <p>{edit?.id}</p>
                        <Label htmlFor="name">name</Label>
                        <Input type="text" name="name" value={formData?.name ?? ''} className="mt-1 block w-full" onChange={handleInput} />
                        <Label htmlFor="name">time</Label>
                        <Input type="text" name="time" value={formData?.time ?? ''} className="mt-1 block w-full" onChange={handleInput} />
                        <Label htmlFor="name">icon</Label>
                        <Input type="text" name="icon" value={formData?.icon ?? ''} className="mt-1 block w-full" onChange={handleInput} />
                        <Label htmlFor="name">color</Label>
                        <Input type="text" name="color" value={formData?.color ?? ''} className="mt-1 block w-full" onChange={handleInput} />
                        <Label htmlFor="name">type</Label>
                        <Input type="text" name="type" value={formData?.type ?? ''} className="mt-1 block w-full" onChange={handleInput} />
                        <ButtonPrimary className="mt-2">{edit?.id ? '更新' : '新規登録'}</ButtonPrimary>
                    </form>
                )}
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 lg:py-16">
                <ButtonPrimary className='mb-2' onClick={onClickShowCreate}>新規登録</ButtonPrimary>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-left text-sm text-gray-500 rtl:text-right">
                        <thead className="bg-gray-50 text-xs font-medium uppercase text-gray-900">
                            <tr>
                                <th scope="col" className="px-6 py-3">id</th>
                                <th scope="col" className="px-6 py-3">name</th>
                                <th scope="col" className="px-6 py-3">time</th>
                                <th scope="col" className="px-6 py-3">icon</th>
                                <th scope="col" className="px-6 py-3">color</th>
                                <th scope="col" className="px-6 py-3">type</th>
                                <th scope="col" className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4">{user.id}</td>
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4">{user.time}</td>
                                    <td className="px-6 py-4">{user.icon}</td>
                                    <td className="px-6 py-4">{user.color}</td>
                                    <td className="px-6 py-4">{user.type}</td>
                                    <td className="px-6 py-4">
                                        <ButtonSecondary onClick={() => onClickShowEdit(user)}>編集</ButtonSecondary>
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
