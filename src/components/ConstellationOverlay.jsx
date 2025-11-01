import { useLayoutEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'

const MotionBackdrop = motion.div
const MotionContainer = motion.div

const blueprint = [
  { id: 'n1', offset: 0, stars: [[0, 220], [0, 100], [60, 160], [60, 220]], links: [[0, 1], [1, 2], [2, 3]] },
  { id: 'i', offset: 110, stars: [[0, 220], [0, 100], [0, 70]], links: [[0, 1]], singles: [2] },
  { id: 'g', offset: 180, stars: [[50, 100], [10, 150], [10, 220], [60, 260], [110, 210], [70, 180]], links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
  { id: 'h', offset: 320, stars: [[0, 220], [0, 100], [0, 160], [60, 160], [60, 100], [60, 220]], links: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5]] },
  { id: 't', offset: 460, stars: [[30, 90], [30, 220], [0, 140], [60, 140]], links: [[0, 1], [0, 2], [0, 3], [2, 3]] },
  { id: 'm', offset: 590, stars: [[0, 220], [0, 100], [35, 170], [70, 100], [70, 220]], links: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { id: 'o1', offset: 720, stars: [[40, 100], [0, 160], [5, 230], [45, 270], [90, 220], [85, 160]], links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]] },
  { id: 'o2', offset: 860, stars: [[40, 100], [0, 160], [5, 230], [45, 270], [90, 220], [85, 160]], links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]] },
  { id: 'n2', offset: 1000, stars: [[0, 220], [0, 100], [60, 160], [60, 220]], links: [[0, 1], [1, 2], [2, 3]] },
]

const viewBoxWidth = 1120
const viewBoxHeight = 320

export function ConstellationOverlay({ visible, onClose }) {
  const overlayRef = useRef(null)
  const lineRefs = useRef([])
  const starRefs = useRef([])

  useLayoutEffect(() => {
    if (!visible || !overlayRef.current) {
      return undefined
    }

    const ctx = gsap.context(() => {
      lineRefs.current.forEach((line, index) => {
        const length = line.getTotalLength()
        gsap.fromTo(
          line,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 1.4,
            delay: 0.12 * index,
            ease: 'power2.out',
          },
        )
      })

      gsap.fromTo(
        starRefs.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.08,
          delay: 0.2,
        },
      )
    }, overlayRef)

    return () => ctx.revert()
  }, [visible])

  lineRefs.current = []
  starRefs.current = []

  return (
    <AnimatePresence>
      {visible && (
        <MotionBackdrop
          ref={overlayRef}
          className="pointer-events-auto fixed inset-0 z-30 flex items-center justify-center bg-black/65 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <MotionContainer
            className="relative mx-4 w-full max-w-4xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <svg
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              className="h-full w-full"
            >
              {blueprint.map((letter) => {
                const stars = letter.stars.map(([x, y]) => [x + letter.offset, y])
                return (
                  <g key={letter.id}>
                    {letter.links.map(([fromIdx, toIdx], linkIndex) => {
                      const [x1, y1] = stars[fromIdx]
                      const [x2, y2] = stars[toIdx]
                      return (
                        <line
                          key={`${letter.id}-${linkIndex}`}
                          ref={(node) => node && lineRefs.current.push(node)}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="rgba(255,255,255,0.65)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      )
                    })}
                    {stars.map(([x, y], starIndex) => {
                      const isHighlighted = letter.singles?.includes(starIndex)
                      return (
                        <circle
                          key={`${letter.id}-star-${starIndex}`}
                          ref={(node) => node && starRefs.current.push(node)}
                          cx={x}
                          cy={y}
                          r={isHighlighted ? 5 : 4}
                          fill="rgba(255,255,255,0.95)"
                          filter="url(#glow)"
                        />
                      )
                    })}
                  </g>
                )
              })}
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
            <button
              type="button"
              className="absolute right-6 top-6 rounded-full border border-white/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 transition hover:border-white hover:text-white"
              onClick={onClose}
            >
              fechar
            </button>
          </MotionContainer>
        </MotionBackdrop>
      )}
    </AnimatePresence>
  )
}
