import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import useData from '../hooks/useData'

const numbers = ["0","1","2","3","4","5","6","7","8","9"]

export default function SearchBar({searchList, sidebar}) {

  const [selected, setSelected] = useState({})
  const [query, setQuery] = useState('')

  const { setFoundItem } = useData()

  const navigate = useNavigate()

  const filteredSearch =
    query === ''
      ? searchList
      : searchList.filter((item) =>
          item.customId
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
          || item.name && item.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
          || item.lastName && item.lastName
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )
        
  return (
    <div className="m-1 mt-5">
      <Combobox value={selected} onChange={item => sidebar ? navigate(`/admin-console/${item.searchType}/${item._id}`) : setFoundItem(item)}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md 
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 
          focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-3 pl-3 pr-10 text-sm leading-5 text-almost-white focus:ring-0 bg-admin-primary"
              placeholder='Search'
              displayValue={query !=="" ? (item) => item.customId : ""}
              onChange={ e => setQuery(e.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-admin-primary py-1 text-almost-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredSearch.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-almost-white">
                  Nothing found.
                </div>
              ) :
              query.length > 2 &&
              (
                filteredSearch.map((item) => (
                  <Combobox.Option
                    key={item.customId}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-admin-secondary text-admin-light' : 'text-almost-white'
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {numbers.includes(query.charAt(1)) ? item.customId : <>{item.lastName}, {item.name}</>}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-admin-light'
                            }`}
                          >
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
