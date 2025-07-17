import { Portal } from '@chakra-ui/react'

const Demo = () => {
  const containerRef = React.useRef()
  return (
    <>
      <Portal container={containerRef}>
        <div>Portal content</div>
      </Portal>
      <div ref={containerRef} />
    </>
  )
}
