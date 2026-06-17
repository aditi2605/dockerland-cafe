// hooks/useFetch.js — A reusable hook for API calls with loading/error state.
// This pattern (loading, data, error) is standard React practice for async data.
import { useState, useEffect } from 'react'

export function useFetch(fetchFn, deps = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchFn()
      setData(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Re-run whenever `deps` change (similar to how useEffect works with deps)
  useEffect(() => { load() }, deps)  // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: load }
}
