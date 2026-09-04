import { useState } from 'react'
import { todayISO } from '../db.js'
import { formatBRL, formatDate, maskCurrencyInput, unmaskCurrency } from '../utils.js'

export default function IncomePage({ incomes, onAdd, onRemove, isMobile }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayISO())
  const [error, setError] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!description.trim()) { setError('Informe uma descrição.'); return }
    const val = unmaskCurrency(amount)
    if (isNaN(val) || val <= 0) { setError('Informe um valor válido.'); return }
    if (!date) { setError('Informe a data.'); return }
    setError('')
    onAdd({ description: description.trim(), amount: val, date })
    setDescription('')
    setAmount('')
    setDate(todayISO())
  }

  const total = incomes.reduce((s, i) => s + i.amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 24 : 32, fontWeight: 600, color: '#1A1A1A', margin: 0, letterSpacing: '-0.02em' }}>
          Receitas
        </h1>
        <p style={{ margin: '6px 0 0', color: '#6B6860', fontSize: 14 }}>
          Registre seus ganhos e entradas financeiras.
        </p>
      </div>

      {/* Form */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 12, padding: '28px 32px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 20 }}>Nova receita</div>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr auto', gap: 12, alignItems: isMobile ? 'stretch' : 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Descrição
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="ex: Salário, Freelance…"
                style={{
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
                }}
                onFocus={e => (e.target.style.borderColor = '#2563EB')}
                onBlur={e => (e.target.style.borderColor = '#E4E2DC')}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Valor (R$)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={e => setAmount(maskCurrencyInput(e.target.value))}
                placeholder="0,00"
                style={{
                  height: 42,
                  padding: '0 14px',
                  border: '1.5px solid #E4E2DC',
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: 'var(--font-mono)',
                  color: '#1A1A1A',
                  backgroundColor: '#FAFAF8',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#2563EB')}
                onBlur={e => (e.target.style.borderColor = '#E4E2DC')}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  height: 42,
                  padding: '0 14px',
                  border: '1.5px solid #E4E2DC',
                  borderRadius: 8,
                  fontSize: 13,
                  fontFamily: 'var(--font-mono)',
                  color: '#1A1A1A',
                  backgroundColor: '#FAFAF8',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#2563EB')}
                onBlur={e => (e.target.style.borderColor = '#E4E2DC')}
              />
            </div>
          </div>

          {error && <div style={{ fontSize: 12, color: '#DC2626' }}>{error}</div>}

          <div>
            <button
              type="submit"
              style={{
                height: 42,
                padding: '0 28px',
                backgroundColor: '#16A34A',
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
              onMouseEnter={e => (e.target.style.backgroundColor = '#15803D')}
              onMouseLeave={e => (e.target.style.backgroundColor = '#16A34A')}
            >
              + Adicionar receita
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid #F3F2EE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
            Histórico de receitas
          </div>
          <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: '#16A34A', fontWeight: 600 }}>
            Total: {formatBRL(total)}
          </div>
        </div>
        {incomes.length === 0 ? (
          <div style={{ padding: '40px 28px', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
            Nenhuma receita registrada ainda.
          </div>
        ) : (
          <div>
            {incomes.map((income, i) => (
              <div
                key={income.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 28px',
                  borderBottom: i < incomes.length - 1 ? '1px solid #F3F2EE' : 'none',
                  transition: 'background-color 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAFAF8')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    ↑
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: '#1A1A1A', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{income.description}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{formatDate(income.date)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, marginLeft: 10 }}>
                  <div style={{ fontSize: 15, fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#16A34A', whiteSpace: 'nowrap' }}>
                    +{formatBRL(income.amount)}
                  </div>
                  <button
                    onClick={() => onRemove(income.id)}
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
