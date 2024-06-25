interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export interface PaginationItems {
  current_page: number
  first_page_url: string | null
  from: number
  last_page: number
  last_page_url: string
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
  data: any[]
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, lastPage, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = []
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(lastPage - 1, currentPage + 1)

    if (startPage > 2) {
      pages.push('...')
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < lastPage - 1) {
      pages.push('...')
    }

    return pages
  }

  const pages = getPageNumbers()

  const buttonClass = (page: number) => {
    return `mx-1 rounded border px-4 py-2 ${page === currentPage ? 'bg-cyan-600 text-white' : 'bg-white text-cyan-600'}`
  }

  return (
    <div className="mt-4 flex justify-center">
      {currentPage > 0 && (
        <button className={buttonClass(1)} onClick={() => onPageChange(1)}>
          1
        </button>
      )}
      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <button key={index} className={buttonClass(page)} onClick={() => onPageChange(page)}>
            {page}
          </button>
        ) : (
          <span key={index} className="mx-1 px-4 py-2">
            {page}
          </span>
        ),
      )}
      {currentPage <= lastPage && lastPage > 1 && (
        <button className={buttonClass(lastPage)} onClick={() => onPageChange(lastPage)}>
          {lastPage}
        </button>
      )}
    </div>
  )
}

export default Pagination
