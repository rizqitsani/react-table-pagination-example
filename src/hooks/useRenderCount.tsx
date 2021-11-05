import * as React from 'react';

export default function useRenderCount() {
  const count = React.useRef(1);
  React.useEffect(() => {
    count.current++;
  });
  return count.current;
}
