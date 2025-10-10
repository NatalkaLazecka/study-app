export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#1976d2',
        border: 'none',
        borderRadius: '6px',
        color: '#fff',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  )
}
