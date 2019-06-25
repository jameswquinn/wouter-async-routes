import React, {
  lazy,
  useEffect,
  useMemo,
  useCallback,
  createContext,
  useContext
} from 'react'

import { Link as WLink, useRoute } from 'wouter'

const PathsContext = createContext(new Map())
const usePaths = () => useContext(PathsContext)

const LazyRoute = ({ path, factory }) => {
  const paths = usePaths()
  const [matches, params] = useRoute(path)
  const Component = useMemo(() => lazy(factory), [factory])

  useEffect(() => {
    paths.set(path, factory)

    return () => paths.delete(path)
  }, [paths, path, factory])

  return matches && <Component params={params} />
}

const LinkWithPrefetch = ({ to, ...props }) => {
  const paths = usePaths()
  const prefetch = useCallback(() => {
    if (paths.has(to)) {
      let fetcher = paths.get(to)

      // hack for run lazy promise
      fetcher().then(v => v)
    }
  }, [paths, to])

  return <WLink to={to} {...props} onMouseEnter={prefetch} />
}

export { LinkWithPrefetch, LazyRoute }
