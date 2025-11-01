import { useEffect, useState } from 'react'

export function useTypewriter(text, speed = 45, enabled = true) {
  const [output, setOutput] = useState('')

  useEffect(() => {
    if (!enabled || !text) {
      setOutput('')
      return
    }

    setOutput('')
    let frame = 0
    const interval = window.setInterval(() => {
      frame += 1
      setOutput((prev) => prev + text[frame - 1])
      if (frame >= text.length) {
        window.clearInterval(interval)
      }
    }, speed)

    return () => {
      window.clearInterval(interval)
    }
  }, [text, speed, enabled])

  return output
}
