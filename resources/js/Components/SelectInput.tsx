import { Option } from '@/types'
import { Listbox, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface Props {
  options: Option[]
  selectedOption?: Option
  onChange: (option?: Option) => void
}

const SelectInput = ({ options, selectedOption, onChange }: Props) => {
  return (
    <Listbox value={selectedOption || { id: '', label: '' }} onChange={onChange}>
      {({ open }) => (
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            {selectedOption ? (
              <span className="block truncate">{selectedOption.label}</span>
            ) : (
              <span className="block truncate text-gray-400">選択してください</span>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <img src="/img/expand.svg" className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          {open && (
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    value={option}
                    className={({ active }) =>
                      `${active ? 'bg-blue-500 text-white' : 'text-gray-900'} relative cursor-pointer select-none px-4 py-2`
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}>
                          {option.label}
                        </span>
                        {selected && (
                          <span
                            className={`${active ? 'text-white' : 'text-blue-600'} absolute inset-y-0 right-0 flex items-center pr-4`}
                          >
                            <img src="/img/check.svg" alt="" className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          )}
        </div>
      )}
    </Listbox>
  )
}

export default SelectInput
