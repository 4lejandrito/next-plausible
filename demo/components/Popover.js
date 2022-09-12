import React, { useState } from 'react'
import { usePopper } from 'react-popper'
import { Transition } from '@tailwindui/react'

export default function Popover({ open, content, children }) {
  const [element, setElement] = useState(null)
  const [arrowElement, setArrowElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const { styles, attributes } = usePopper(element, popperElement, {
    placement: 'top-end',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [16, 10],
        },
      },
      {
        name: 'arrow',
        options: {
          element: arrowElement,
        },
      },
    ],
  })
  return (
    <>
      <span ref={setElement}>{children}</span>
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
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="px-4 relative">
            <div className="bg-help text-copy text-sm rounded text-left px-2 py-1 font-medium relative z-10 max-w-sm">
              {content}
            </div>
            <div
              className="z-0"
              ref={setArrowElement}
              style={styles.arrow}
              {...attributes.arrow}
            >
              <div className="h-4 w-4 bg-help rounded rotate-45 -translate-y-1/2 relative -top-1" />
            </div>
          </div>
        </div>
      </Transition>
    </>
  )
}
