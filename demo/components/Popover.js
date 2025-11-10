import React, { useState } from 'react'
import { useFloating, autoUpdate, offset, arrow } from '@floating-ui/react'
import { Transition } from '@tailwindui/react'

export default function Popover({ open, content, children }) {
  const [arrowElement, setArrowElement] = useState(null)
  const { refs, floatingStyles, middlewareData } = useFloating({
    placement: 'top-end',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: 10, crossAxis: 16 }),
      arrow({ element: arrowElement }),
    ],
  })
  return (
    <>
      <span ref={refs.setReference}>{children}</span>
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
        <div ref={refs.setFloating} style={floatingStyles}>
          <div className="px-4 relative">
            <div className="bg-help text-copy text-sm rounded text-left px-2 py-1 font-medium relative z-10 max-w-sm">
              {content}
            </div>
            <div
              className="z-0 absolute"
              ref={setArrowElement}
              style={{
                left: middlewareData.arrow?.x,
                top: middlewareData.arrow?.y,
              }}
            >
              <div className="h-4 w-4 bg-help rounded rotate-45 -translate-y-1/2 relative -top-1" />
            </div>
          </div>
        </div>
      </Transition>
    </>
  )
}
