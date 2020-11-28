import { useLocation } from 'wouter-preact';
import { useLayoutEffect } from 'preact/hooks';

export default function Redirect({ from, to }) {
  const [location, setLocation] = useLocation();
  useLayoutEffect(() => {
    if (from === undefined) {
      setLocation(to);
    } else if (location === '/') {
      setLocation(to);
    }
  }, []);
  return null;
}
