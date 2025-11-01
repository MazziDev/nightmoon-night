import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'

const MotionOverlay = motion.div
const MotionPanel = motion.div

export function MessageModal({ message, onClose }) {
  const typed = useTypewriter(message ?? '', 48, Boolean(message))

  useEffect(() => {
    if (!message) {
      return
    }

    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [message, onClose])

  return (
    <AnimatePresence>
      {message && (
        <MotionOverlay
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <MotionPanel
            className="relative mx-4 max-w-2xl rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 text-center text-white shadow-lg"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-script text-3xl leading-snug text-white/90 sm:text-4xl">{typed}</p>
            <button
              type="button"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-medium uppercase tracking-widest text-white/80 transition hover:border-white/80 hover:text-white"
              onClick={onClose}
            >
              Fechar
            </button>
          </MotionPanel>
        </MotionOverlay>
      )}
    </AnimatePresence>
  )
}
