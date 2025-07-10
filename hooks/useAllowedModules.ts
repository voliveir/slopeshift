import { useEffect, useState } from 'react'

export function useAllowedModules(clientId: string | null) {
  const [modules, setModules] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clientId) {
      setModules([])
      return
    }
    setLoading(true)
    setError(null)
    fetch(`/api/client-modules?clientId=${clientId}`)
      .then(res => res.json())
      .then(data => {
        setModules(Array.isArray(data.modules) ? data.modules : [])
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to fetch modules')
        setLoading(false)
      })
  }, [clientId])

  return { modules, loading, error }
} 