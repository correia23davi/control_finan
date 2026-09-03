export default function StatCard({ label, value, sub, color, bg }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E2DC',
        borderRadius: 12,
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ fontSize: 12, color: '#6B6860', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600, color, lineHeight: 1.1 }}>{value}</div>
      {sub && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            color,
            backgroundColor: bg,
            padding: '2px 8px',
            borderRadius: 4,
            width: 'fit-content',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  )
}
