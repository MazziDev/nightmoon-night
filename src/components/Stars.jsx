import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function Stars({ stars, onStarClick }) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    if (!scope.current) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.nightmoon-star').forEach((star) => {
        const delay = Number(star.getAttribute('data-delay') || '0')
        gsap.fromTo(
          star,
          { opacity: 0, scale: 0 },
          {
            opacity: 0.75,
            scale: 1,
            delay,
            duration: 1.4,
            ease: 'power2.out',
          },
        )

        gsap.to(star, {
          opacity: 0.35,
          scale: 0.88,
          duration: 2.2 + Math.random() * 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: delay + 1,
        })
      })
    }, scope)

    return () => ctx.revert()
  }, [stars])

  return (
    <div ref={scope} className="absolute inset-0">
      {stars.map((star) => (
        <button
          key={star.id}
          type="button"
          className="nightmoon-star absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.85)] transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 hover:scale-110"
          style={{ top: star.top, left: star.left }}
          data-delay={star.delay.toFixed(2)}
          onClick={() => onStarClick(star.message)}
          aria-label={`Estrela ${star.id + 1}`}
        />
      ))}
    </div>
  )
}
