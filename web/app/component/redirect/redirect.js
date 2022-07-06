import { useLocation } from '../../../deps/wouter-preact.js';
import { useLayoutEffect } from '../../../deps/preact-hooks.js';

export default function Redirect({ from, to }) {
  const [location, setLocation] = useLocation();
  useLayoutEffect(() => {
    if (from === undefined) {
      setLocation(to);
    } else if (location === '/') {
      setLocation(to);
    }
  });
  return null;
}
