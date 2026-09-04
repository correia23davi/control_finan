export default function StatCard({ label, value, sub, color, bg }) {
  // Reduz o tamanho da fonte automaticamente quando o valor formatado é
  // muito longo (ex: "R$ 1.234.567,89"), para não estourar a largura do card.
  const length = String(value).length
  const valueFontSize = length > 16 ? 18 : length > 12 ? 22 : 28

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
        minWidth: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: 12, color: '#6B6860', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: valueFontSize,
          fontWeight: 600,
          color,
          lineHeight: 1.1,
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
        }}
      >
        {value}
      </div>
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
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  )
}
