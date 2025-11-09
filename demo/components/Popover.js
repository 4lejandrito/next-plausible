import React from 'react'
import { Transition } from '@tailwindui/react'

export default function Popover({ open, content, children }) {
  return (
    <span className="relative inline-flex">
      {children}
      <Transition
        as="span"
        show={open}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute -top-2 right-0 -translate-y-full">
          <div className="px-4 relative">
            <div className="bg-help text-copy text-sm rounded text-left px-2 py-1 font-medium relative z-10 max-w-sm">
              {content}
            </div>
            <div className="relative z-0 h-4 w-full">
              <div className="h-4 w-4 bg-help rounded rotate-45 absolute right-4 -top-2" />
            </div>
          </div>
        </div>
      </Transition>
    </span>
  )
}
