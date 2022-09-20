import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { usePlausible } from '../next-plausible/index.esm'
import millify from 'millify'

function Heart({ className }) {
  return (
    <svg className={className} viewBox="-2 0 105 92">
      <path d="M85.24 2.67C72.29-3.08 55.75 2.67 50 14.9 44.25 2 27-3.8 14.76 2.67 1.1 9.14-5.37 25 5.42 44.38 13.33 58 27 68.11 50 86.81 73.73 68.11 87.39 58 94.58 44.38c10.79-18.7 4.32-35.24-9.34-41.71z" />
    </svg>
  )
}
export default function Like({ className }) {
  const plausible = usePlausible()
  const [animating, setAnimating] = useState(false)
  const [likes, setLikes] = useState(null)
  const [hovering, setHovering] = useState(false)
  const [hover, setHover] = useState(false)
  const timeoutRef = useRef()

  const like = () => {
    setAnimating(true)
    setLikes(likes + 1)
    plausible('Like')
  }

  useEffect(() => {
    fetch('/api/like')
      .then((res) => res.json())
      .then(({ likes }) => setLikes(likes))
      .then(() => setAnimating(true))
  }, [])

  return (
    <button
      className={classNames(
        className,
        'relative h-10 inline-flex items-center justify-center text-xs font-bold',
        {
          'animate-beat': animating,
        }
      )}
      title="Like"
      onClick={() => {
        clearTimeout(timeoutRef.current)
        setHover(false)
        setHovering(false)
        if (!animating && !hover) {
          like()
        }
      }}
      onAnimationEnd={() => {
        setAnimating(false)
        if (hover) {
          timeoutRef.current = setTimeout(like, 200)
        }
      }}
      onMouseEnter={() => {
        timeoutRef.current = setTimeout(() => {
          setHovering(true)
          timeoutRef.current = setTimeout(() => {
            setHover(true)
            like()
          }, 2000)
        }, 500)
      }}
      onMouseLeave={() => {
        setHovering(false)
        setHover(false)
        clearTimeout(timeoutRef.current)
      }}
    >
      <Heart className="fill-heart h-full" />
      <Heart
        className={classNames('absolute fill-heart-burst h-full', {
          'scale-0': !hovering,
          'scale-100 duration-[2s]': hovering,
        })}
      />
      {likes !== null ? (
        <span className="z-10 absolute -mt-0.5 inline-block animate-beat">
          {millify(likes)}
        </span>
      ) : null}
    </button>
  )
}
