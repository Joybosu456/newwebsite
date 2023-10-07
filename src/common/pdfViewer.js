import React, { useMemo } from 'react';
import PDFViewerRaw from 'pdf-viewer-reactjs'

export default function PDFViewer(props) {
  const { src } = props
  const memoizedSrc = useMemo(() => {
    return {
      url: src.toString(),
    }
  }, [src]);


  return (
    <div
      style={{
        height: '150px',
        width: '230px',
        overflow: 'auto',
      }}
    >
      <div>
        <PDFViewerRaw
          document={memoizedSrc}
          hideZoom
          hideRotation
          hideNavbar
        />
      </div>
    </div>
  )
}