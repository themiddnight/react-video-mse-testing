export default function OverlayScreen({
  zIndex = 20,
  color = 'white',
  bgColor = '#000000aa',
  content = '',
  children,
}: {
  zIndex?: number
  color?: string
  bgColor?: string
  content?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div
      style={{
        position: 'absolute',
        zIndex,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColor,
        color: color ?? 'white',
      }}
    >
      <div style={{ fontSize: 'small', padding: '10px' }}>
        {content}
        {children}
      </div>
    </div>
  )
}
