export default function TextInput({ label, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
      {label && <label style={{ marginBottom: '0.25rem' }}>{label}</label>}
      <input
        {...props}
        style={{
          padding: '0.5rem',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      />
    </div>
  )
}
