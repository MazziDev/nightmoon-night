import { motion, useMotionTemplate, useSpring, useTransform } from 'framer-motion'

const MotionWrapper = motion.div
const MotionGlow = motion.div

const springConfig = { stiffness: 140, damping: 22, mass: 0.6 }
export function Moon({ pointerX, pointerY, containerSize }) {
  const smoothX = useSpring(pointerX, springConfig)
  const smoothY = useSpring(pointerY, springConfig)

  const shadowX = useTransform(smoothX, [0, containerSize.width || 1], [18, -18])
  const shadowY = useTransform(smoothY, [0, containerSize.height || 1], [22, -12])
  const glowOpacity = useTransform(smoothX, [0, containerSize.width || 1], [0.55, 0.9])

  const background = useMotionTemplate`radial-gradient(circle at 40% 40%, rgba(250, 244, 225, 0.98), rgba(204, 190, 180, 0.42) 55%, rgba(20, 20, 40, 0.12) 75%)`

  return (
    <MotionWrapper
      className="absolute left-0 top-0 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-moon"
      style={{
        x: smoothX,
        y: smoothY,
        background,
        boxShadow: useMotionTemplate`${shadowX}px ${shadowY}px 45px rgba(255, 255, 255, ${glowOpacity})`,
      }}
      aria-hidden
    >
      <MotionGlow
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: useMotionTemplate`radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0) 70%)`,
          mixBlendMode: 'screen',
          opacity: glowOpacity,
        }}
      />
    </MotionWrapper>
  )
}
