import { useState } from 'react'
import { todayISO } from '../db.js'
import { formatBRL, formatDate, sanitizeDecimalInput, sanitizeIntegerInput } from '../utils.js'

const CATEGORIES = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Tecnologia', 'Lazer', 'Educação', 'Outros']

const CATEGORY_COLORS = {
  'Alimentação': '#DC2626',
  'Moradia': '#D97706',
  'Transporte': '#2563EB',
  'Saúde': '#16A34A',
  'Tecnologia': '#7C3AED',
  'Lazer': '#DB2777',
  'Educação': '#0891B2',
  'Outros': '#6B6860',
}

export default function ExpensesPage({ expenses, onAdd, onRemove, isMobile }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Outros')
  const [isInstallment, setIsInstallment] = useState(false)
  const [installments, setInstallments] = useState('2')
  const [error, setError] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!description.trim()) { setError('Informe uma descrição.'); return }
    const val = parseFloat(amount.replace(',', '.'))
    if (isNaN(val) || val <= 0) { setError('Informe um valor válido.'); return }
    const parts = isInstallment ? parseInt(installments) : 1
    if (isInstallment && (parts < 2 || parts > 60)) { setError('Parcelas: entre 2 e 60.'); return }
    setError('')
    onAdd({
      description: description.trim(),
      amount: isInstallment ? val / parts : val,
      date: todayISO(),
      installments: parts,
      currentInstallment: 1,
      category,
    })
    setDescription('')
    setAmount('')
    setInstallments('2')
    setIsInstallment(false)
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  // Agrupa os gastos por categoria e calcula a porcentagem de cada uma sobre o total
  const categoryBreakdown = Object.entries(
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {})
  )
    .map(([cat, sum]) => ({
      category: cat,
      amount: sum,
      pct: total > 0 ? (sum / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  const inputStyle = {
    height: 42,
    padding: '0 14px',
    border: '1.5px solid #E4E2DC',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'var(--font-sans)',
    color: '#1A1A1A',
    backgroundColor: '#FAFAF8',
    outline: 'none',
    transition: 'border-color 0.15s',
    width: '100%',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 24 : 32, fontWeight: 600, color: '#1A1A1A', margin: 0, letterSpacing: '-0.02em' }}>
          Despesas
        </h1>
        <p style={{ margin: '6px 0 0', color: '#6B6860', fontSize: 14 }}>
          Registre seus gastos, com ou sem parcelamento.
        </p>
      </div>

      {/* Form */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 12, padding: '28px 32px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 20 }}>Nova despesa</div>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Descrição</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="ex: Netflix, Mercado…"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#DC2626')}
                onBlur={e => (e.target.style.borderColor = '#E4E2DC')}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {isInstallment ? 'Valor total (R$)' : 'Valor (R$)'}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={e => setAmount(sanitizeDecimalInput(e.target.value))}
                placeholder="0,00"
                style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
                onFocus={e => (e.target.style.borderColor = '#DC2626')}
                onBlur={e => (e.target.style.borderColor = '#E4E2DC')}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Categoria</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => (e.target.style.borderColor = '#DC2626')}
                onBlur={e => (e.target.style.borderColor = '#E4E2DC')}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Row 2 — installment toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
              <div
                onClick={() => setIsInstallment(v => !v)}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: isInstallment ? '#DC2626' : '#D1CBC2',
                  position: 'relative',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 3,
                  left: isInstallment ? 21 : 3,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </div>
              <span style={{ fontSize: 13, color: '#4B5563', fontWeight: 500 }}>Compra parcelada</span>
            </label>

            {isInstallment && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  Nº de parcelas
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={installments}
                  onChange={e => setInstallments(sanitizeIntegerInput(e.target.value))}
                  style={{ ...inputStyle, width: 80, fontFamily: 'var(--font-mono)' }}
                  onFocus={e => (e.target.style.borderColor = '#DC2626')}
                  onBlur={e => (e.target.style.borderColor = '#E4E2DC')}
                />
                {amount && !isNaN(parseFloat(amount.replace(',', '.'))) && (
                  <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'var(--font-mono)' }}>
                    = {formatBRL(parseFloat(amount.replace(',', '.')) / parseInt(installments || '1'))}/mês
                  </span>
                )}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Data</div>
              <div style={{
                height: 42,
                padding: '0 14px',
                border: '1.5px solid #E4E2DC',
                borderRadius: 8,
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                color: '#9CA3AF',
                backgroundColor: '#F5F4F2',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}>
                {formatDate(todayISO())}
              </div>
            </div>
          </div>

          {error && <div style={{ fontSize: 12, color: '#DC2626' }}>{error}</div>}

          <div>
            <button
              type="submit"
              style={{
                height: 42,
                padding: '0 28px',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => (e.target.style.backgroundColor = '#B91C1C')}
              onMouseLeave={e => (e.target.style.backgroundColor = '#DC2626')}
            >
              + Adicionar despesa
            </button>
          </div>
        </form>
      </div>

      {/* Gastos por categoria */}
      {categoryBreakdown.length > 0 && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 12, padding: '24px 28px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 20, letterSpacing: '0.01em' }}>
            Gastos por categoria
          </div>

          {/* Barra empilhada mostrando a proporção de cada categoria */}
          <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 20 }}>
            {categoryBreakdown.map(item => (
              <div
                key={item.category}
                title={`${item.category}: ${item.pct.toFixed(1)}%`}
                style={{
                  width: `${item.pct}%`,
                  backgroundColor: CATEGORY_COLORS[item.category] || '#6B6860',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {categoryBreakdown.map(item => (
              <div key={item.category}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: '50%',
                        backgroundColor: CATEGORY_COLORS[item.category] || '#6B6860',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{item.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#6B6860' }}>
                      {formatBRL(item.amount)}
                    </span>
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: CATEGORY_COLORS[item.category] || '#6B6860', fontWeight: 600, minWidth: 44, textAlign: 'right' }}>
                      {item.pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div style={{ height: 5, backgroundColor: '#F3F2EE', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${item.pct}%`,
                      backgroundColor: CATEGORY_COLORS[item.category] || '#6B6860',
                      borderRadius: 3,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid #F3F2EE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>Histórico de despesas</div>
          <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: '#DC2626', fontWeight: 600 }}>
            Total: {formatBRL(total)}
          </div>
        </div>
        {expenses.length === 0 ? (
          <div style={{ padding: '40px 28px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
            Nenhuma despesa registrada ainda.
          </div>
        ) : (
          <div>
            {expenses.map((exp, i) => (
              <div
                key={exp.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 28px',
                  borderBottom: i < expenses.length - 1 ? '1px solid #F3F2EE' : 'none',
                  transition: 'background-color 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAFAF8')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    ↓
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, color: '#1A1A1A', fontWeight: 500 }}>{exp.description}</span>
                      <span style={{
                        fontSize: 11,
                        color: '#6B6860',
                        backgroundColor: '#F3F2EE',
                        padding: '1px 7px',
                        borderRadius: 3,
                        fontWeight: 500,
                      }}>
                        {exp.category}
                      </span>
                      {exp.installments > 1 && (
                        <span style={{
                          fontSize: 11,
                          color: '#D97706',
                          backgroundColor: '#FFFBEB',
                          padding: '1px 7px',
                          borderRadius: 3,
                          fontWeight: 500,
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {exp.currentInstallment}/{exp.installments}×
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{formatDate(exp.date)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#DC2626' }}>
                      -{formatBRL(exp.amount)}
                    </div>
                    {exp.installments > 1 && (
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1, fontFamily: 'var(--font-mono)' }}>
                        total {formatBRL(exp.amount * exp.installments)}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(exp.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#D1CBC2',
                      cursor: 'pointer',
                      fontSize: 16,
                      padding: '4px',
                      borderRadius: 4,
                      lineHeight: 1,
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.target.style.color = '#DC2626')}
                    onMouseLeave={e => (e.target.style.color = '#D1CBC2')}
                    title="Remover"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
