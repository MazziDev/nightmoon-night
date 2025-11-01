import { motion, useMotionValue } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Moon } from './components/Moon'
import { Stars } from './components/Stars'
import { MessageModal } from './components/MessageModal'
import { ConstellationOverlay } from './components/ConstellationOverlay'

const MotionH1 = motion.h1
const MotionParagraph = motion.p

const starMessages = [
  'nightmoon brilha onde o silêncio é mais bonito.',
  'Nem toda luz vem do sol.',
  'A noite é viva quando alguém pensa em você.',
  'Cada estrela é um desejo que aprendeu a respirar.',
  'Os segredos da lua cabem no seu sorriso.',
  'O vento leva recados de quem sente saudade.',
  'Os sonhos são lanternas que acendem o céu.',
  'Quando você olha, a noite canta.',
  'nightmoon guarda promessas nas entrelinhas da escuridão.',
  'Há constelações inteiras esperando pelo seu nome.',
]

const gradientMap = [
  { range: [0, 5], colors: { start: '#020218', mid: '#0b1037', end: '#2a0f4a' } },
  { range: [5, 8], colors: { start: '#040728', mid: '#121d4b', end: '#3a1961' } },
  { range: [8, 18], colors: { start: '#05071f', mid: '#15193f', end: '#361e54' } },
  { range: [18, 21], colors: { start: '#04041a', mid: '#10133a', end: '#40185b' } },
  { range: [21, 24], colors: { start: '#010012', mid: '#0a0f32', end: '#2b0d44' } },
]

const getGradientByHour = (hour) => {
  const profile = gradientMap.find(({ range: [start, end] }) => hour >= start && hour < end)
  return profile?.colors ?? gradientMap[0].colors
}

export default function App() {
  const containerRef = useRef(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const [containerSize, setContainerSize] = useState({ width: 1, height: 1 })
  const [activeMessage, setActiveMessage] = useState(null)
  const [constellationVisible, setConstellationVisible] = useState(false)
  const [gradient, setGradient] = useState(() => getGradientByHour(new Date().getHours()))
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const audioContextRef = useRef(null)
  const noiseSourceRef = useRef(null)
  const gainNodeRef = useRef(null)

  const stars = useMemo(
    () =>
      starMessages.map((message, index) => ({
        id: index,
        message,
        top: `${12 + Math.random() * 72}%`,
        left: `${8 + Math.random() * 82}%`,
        delay: Math.random() * 3.5,
      })),
    [],
  )

  useEffect(() => {
    const updateGradient = () => {
      setGradient(getGradientByHour(new Date().getHours()))
    }

    const interval = window.setInterval(updateGradient, 60_000)
    updateGradient()

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const node = containerRef.current
    if (!node) {
      return undefined
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setContainerSize({ width, height })
      pointerX.set(width / 2)
      pointerY.set(height / 2)
    })

    resizeObserver.observe(node)

    return () => resizeObserver.disconnect()
  }, [pointerX, pointerY])

  useEffect(() => {
    const node = containerRef.current
    if (!node) {
      return undefined
    }

    const handleMove = (event) => {
      const rect = node.getBoundingClientRect()
      pointerX.set(event.clientX - rect.left)
      pointerY.set(event.clientY - rect.top)
    }

    const handleLeave = () => {
      pointerX.set(containerSize.width / 2)
      pointerY.set(containerSize.height / 2)
    }

    node.addEventListener('pointermove', handleMove)
    node.addEventListener('pointerleave', handleLeave)

    return () => {
      node.removeEventListener('pointermove', handleMove)
      node.removeEventListener('pointerleave', handleLeave)
    }
  }, [pointerX, pointerY, containerSize])

  const startAmbientWind = useCallback(async () => {
    try {
      let context = audioContextRef.current
      if (!context) {
        context = new window.AudioContext()
        audioContextRef.current = context
      }

      if (context.state === 'suspended') {
        await context.resume()
      }

      if (noiseSourceRef.current) {
        setIsAudioPlaying(true)
        return
      }

      const bufferLength = context.sampleRate * 4
      const buffer = context.createBuffer(1, bufferLength, context.sampleRate)
      const channelData = buffer.getChannelData(0)
      for (let index = 0; index < bufferLength; index += 1) {
        const fade = Math.sin((Math.PI * index) / bufferLength)
        channelData[index] = (Math.random() * 2 - 1) * 0.18 * fade
      }

      const noiseSource = context.createBufferSource()
      noiseSource.buffer = buffer
      noiseSource.loop = true

      const filter = context.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 220
      filter.Q.value = 0.7

      const gain = context.createGain()
      gain.gain.value = 0.07

      noiseSource.connect(filter)
      filter.connect(gain)
      gain.connect(context.destination)
      noiseSource.start()

      noiseSourceRef.current = noiseSource
      gainNodeRef.current = gain
      setIsAudioPlaying(true)
    } catch (error) {
      console.error('Falha ao iniciar áudio ambiente', error)
    }
  }, [])

  const stopAmbientWind = useCallback(async () => {
    try {
      noiseSourceRef.current?.stop?.()
      noiseSourceRef.current?.disconnect?.()
    } catch (error) {
      console.error('Erro ao parar fonte de ruído', error)
    }

    noiseSourceRef.current = null
    gainNodeRef.current?.disconnect?.()
    gainNodeRef.current = null

    if (audioContextRef.current) {
      await audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }

    setIsAudioPlaying(false)
  }, [])

  const toggleAmbientWind = useCallback(() => {
    if (isAudioPlaying) {
      stopAmbientWind()
    } else {
      startAmbientWind()
    }
  }, [isAudioPlaying, startAmbientWind, stopAmbientWind])

  useEffect(() => {
    return () => {
      stopAmbientWind()
    }
  }, [stopAmbientWind])

  const gradientStyle = useMemo(
    () => ({
      '--gradient-start': gradient.start,
      '--gradient-mid': gradient.mid,
      '--gradient-end': gradient.end,
      backgroundSize: '220% 220%',
    }),
    [gradient],
  )

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-night-sky font-sans text-white animate-gradient-move"
      style={gradientStyle}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)] opacity-70 mix-blend-screen" aria-hidden />

      <div className="absolute inset-0 z-20">
        <Stars stars={stars} onStarClick={setActiveMessage} />
        <Moon pointerX={pointerX} pointerY={pointerY} containerSize={containerSize} />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
        <MotionH1
          className="text-4xl font-light tracking-[0.35em] text-white/80 sm:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          NOITE DE <span className="font-script text-5xl text-white sm:text-6xl">nightmoon</span>
        </MotionH1>
        <MotionParagraph
          className="mt-8 max-w-2xl text-lg text-white/70 sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
        >
          Um céu minimalista para navegar com o olhar, sentir o vento noturno e descobrir versos guardados nas estrelas.
        </MotionParagraph>
        <MotionParagraph
          className="mt-6 text-sm uppercase tracking-[0.5em] text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.6 }}
        >
          clique em uma estrela para ouvir a voz da noite
        </MotionParagraph>
      </main>

      <button
        type="button"
        className="fixed left-6 top-6 z-20 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white/75 transition hover:border-white/80 hover:bg-white/10 hover:text-white"
        onClick={toggleAmbientWind}
      >
        {isAudioPlaying ? 'vento em play' : 'vento em espera'}
      </button>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-20 text-2xl opacity-60 transition hover:opacity-100"
        aria-label="Revelar constelação nightmoon"
        onClick={() => setConstellationVisible(true)}
      >
        🌙
      </button>

      <MessageModal message={activeMessage} onClose={() => setActiveMessage(null)} />
      <ConstellationOverlay
        visible={constellationVisible}
        onClose={() => setConstellationVisible(false)}
      />
    </div>
  )
}
