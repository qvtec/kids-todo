import Layout from '@/Layouts/Layout'
import { Money, PageProps } from '@/types'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import Loading from '@/Components/Loading'
import { get, post, put, remove } from '@/utils/api'
import Pagination, { PaginationItems } from '@/Components/Pagination'
import ButtonPrimary from '@/Components/ButtonPrimary'
import ButtonSecondary from '@/Components/ButtonSecondary'
import CloseButton from '@/Components/CloseButton'
import ButtonDanger from '@/Components/ButtonDanger'
import Input from '@/Components/Input'
import Label from '@/Components/Label'
import Modal from '@/Components/Modal'
import { formatToday, shortDate } from '@/utils/date'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

interface MoneyItems extends PaginationItems {
  data: Money[]
}

export default function TodoPage({ auth }: PageProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Money[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const [edit, setEdit] = useState<Money>()
  const [type, setType] = useState<string>()
  const [showEdit, setShowEdit] = useState(false)
  const [formData, setFormData] = useState<Money>()

  const [total, setTotal] = useState(0)

  useEffect(() => {
    let isMounted = true
    fetchData(1, isMounted)
    fetchTotalData()

    return () => {
      isMounted = false
    }
  }, [])

  async function fetchData(page = 1, isMounted = true) {
    const res = await get<MoneyItems>(`/api/money?page=${page}`)
    if (res && isMounted) {
      setData(res.data)
      setCurrentPage(res.current_page)
      setLastPage(res.last_page)
      setLoading(false)
    }
  }

  async function fetchTotalData() {
    const res = await get<number>(`/api/money/1`)
    if (res) {
      setTotal(res)
    }
  }

  function handlePageChange(page: number) {
    fetchData(page)
  }

  function onClickShowCreate(type: string) {
    const initFormData = {
      id: 0,
      date: formatToday(),
      name: '',
      amount: 0,
      memo: '',
    }
    setType(type)
    setFormData(initFormData)
    setEdit(initFormData)
    setShowEdit(true)
  }

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    if (formData) setFormData({ ...formData, [name]: value })
  }

  async function submitForm(e: FormEvent) {
    e.preventDefault()
    if (!edit || !formData) return
    setLoading(true)

    if (type == '-') {
      formData.amount = -Math.abs(formData.amount)
    }

    if (edit.id) {
      await put<Money>(`/api/money/${edit.id}`, formData)
    } else {
      await post<Money>(`/api/money`, formData)
    }

    fetchData()
    setLoading(false)
    setShowEdit(false)
  }

  if (loading || !data) return <Loading />

  return (
    <Layout user={auth.user} title="Money">
      <div className="mx-auto w-full px-4 py-8 lg:py-16">
        <div className="px-12 py-3 text-center">
          <h2 className="rounded-lg border-2 border-orange-400 bg-yellow-200 px-6 py-3 text-lg text-black">
            {total}円
          </h2>
        </div>
        <div className="flex justify-between px-12 py-3">
          <ButtonSecondary className="" type="button" onClick={() => onClickShowCreate('+')}>
            <FontAwesomeIcon icon={faPlus} />
          </ButtonSecondary>
          <ButtonSecondary className="" type="button" onClick={() => onClickShowCreate('-')}>
            <FontAwesomeIcon icon={faMinus} />
          </ButtonSecondary>
        </div>
        <div className="relative max-w-full overflow-x-auto shadow-md sm:rounded-lg md:max-w-md">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right">
            <thead className="bg-gray-200 text-xs font-medium uppercase text-gray-900">
              <tr>
                <th scope="col" className="px-6 py-2">
                  いつ
                </th>
                <th scope="col" className="px-6 py-2">
                  なに
                </th>
                <th scope="col" className="px-6 py-2">
                  つかった
                </th>
                <th scope="col" className="px-6 py-2">
                  もらった
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="py-3 pl-2 pr-6 md:px-6">{shortDate(item.date)}</td>
                  <td className="whitespace-nowrap text-nowrap px-3 py-2 md:px-6">{item.name}</td>
                  <td className="py-3 pl-2 pr-6 text-end md:px-6">{item.amount < 0 && Math.abs(item.amount) + '円'}</td>
                  <td className="py-3 pl-2 pr-6 text-end md:px-6">{item.amount > 0 && item.amount + '円'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={handlePageChange} />
      </div>
      <Modal show={showEdit} closeable={false} onClose={() => setShowEdit(false)}>
        <div className="float-end">
          <CloseButton onClose={() => setShowEdit(false)} />
        </div>
        <form onSubmit={submitForm}>
          <Label htmlFor="date" className="mt-4">
            いつ
          </Label>
          <Input
            type="date"
            name="date"
            value={formData?.date ?? ''}
            className="mt-1 block w-full"
            onChange={handleInput}
            required
          />

          <Label htmlFor="name" className="mt-4">
            なに
          </Label>
          <Input
            type="text"
            name="name"
            value={formData?.name ?? ''}
            className="mt-1 block w-full"
            onChange={handleInput}
            required
          />

          <Label htmlFor="amount" className="mt-4">
            いくら
          </Label>
          <Input
            type="number"
            name="amount"
            value={formData?.amount != 0 ? formData?.amount : ''}
            className="mt-1 block w-full"
            onChange={handleInput}
            required
          />

          <Label htmlFor="memo" className="mt-4">
            メモ
          </Label>
          <Input
            type="text"
            name="memo"
            value={formData?.memo ?? ''}
            className="mt-1 block w-full"
            onChange={handleInput}
          />

          <ButtonPrimary className="mt-5">OK</ButtonPrimary>
        </form>
      </Modal>
    </Layout>
  )
}
