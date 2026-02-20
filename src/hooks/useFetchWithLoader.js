import { useState, useEffect } from 'react'

export const useFetchWithLoader = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Minimum loading time for smooth UX
        const [result] = await Promise.all([
          fetchFunction(),
          new Promise(resolve => setTimeout(resolve, 500))
        ])
        
        if (mounted) {
          setData(result)
        }
      } catch (err) {
        if (mounted) {
          setError(err)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, dependencies)

  return { data, loading, error, refetch: () => setLoading(true) }
}
