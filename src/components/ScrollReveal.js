'use client'

import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const directionMap = {
    up: 'translate-y-10',
    down: '-translate-y-10',
    left: 'translate-x-10',
    right: '-translate-x-10',
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? 'opacity-100 translate-x-0 translate-y-0'
          : `opacity-0 ${directionMap[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
