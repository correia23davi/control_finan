import { useState } from 'react'
import { todayISO } from '../db.js'
import { formatBRL, formatDate, sanitizeDecimalInput } from '../utils.js'

export default function SavingsPage({ goals, onAddGoal, onRemoveGoal, onAddDeposit, onRemoveDeposit, isMobile }) {
  const [goalName, setGoalName] = useState('')
  const [goalTarget, setGoalTarget] = useState('')
  const [goalError, setGoalError] = useState('')

  const [selectedGoalId, setSelectedGoalId] = useState(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositNote, setDepositNote] = useState('')
  const [depositError, setDepositError] = useState('')

  function handleAddGoal(e) {
    e.preventDefault()
    if (!goalName.trim()) { setGoalError('Informe o nome da meta.'); return }
    const target = parseFloat(goalTarget.replace(',', '.'))
    if (isNaN(target) || target <= 0) { setGoalError('Informe um valor alvo válido.'); return }
    setGoalError('')
    const newGoalId = onAddGoal({ name: goalName.trim(), targetAmount: target })
    setGoalName('')
    setGoalTarget('')
    setSelectedGoalId(newGoalId)
  }

  function handleAddDeposit(e) {
    e.preventDefault()
    const val = parseFloat(depositAmount.replace(',', '.'))
    if (isNaN(val) || val <= 0) { setDepositError('Informe um valor válido.'); return }
    setDepositError('')
    onAddDeposit(selectedGoalId, { amount: val, note: depositNote.trim() })
    setDepositAmount('')
    setDepositNote('')
  }

  function handleRemoveGoal(id) {
    onRemoveGoal(id)
    if (selectedGoalId === id) setSelectedGoalId(null)
  }

  const inputStyle = {
    height: 42, padding: '0 14px', border: '1.5px solid #E4E2DC', borderRadius: 8,
    fontSize: 14, fontFamily: 'var(--font-sans)', color: '#1A1A1A',
    backgroundColor: '#FAFAF8', outline: 'none', transition: 'border-color 0.15s', width: '100%',
  }

  const selectedGoal = goals.find(g => g.id === selectedGoalId) ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 24 : 32, fontWeight: 600, color: '#1A1A1A', margin: 0, letterSpacing: '-0.02em' }}>
          Poupança
        </h1>
        <p style={{ margin: '6px 0 0', color: '#6B6860', fontSize: 14 }}>
          Crie metas de economia e registre seus depósitos.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Left: create goal + goal list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* New goal form */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 12, padding: '24px 28px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 16 }}>Nova meta</div>
            <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Nome da meta</label>
                <input type="text" value={goalName} onChange={e => setGoalName(e.target.value)}
                  placeholder="ex: Viagem, Reserva de emergência…"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#7C3AED')}
                  onBlur={e => (e.target.style.borderColor = '#E4E2DC')} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Valor alvo (R$)</label>
                <input type="text" inputMode="decimal" value={goalTarget} onChange={e => setGoalTarget(sanitizeDecimalInput(e.target.value))}
                  placeholder="0,00"
                  style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
                  onFocus={e => (e.target.style.borderColor = '#7C3AED')}
                  onBlur={e => (e.target.style.borderColor = '#E4E2DC')} />
              </div>
              {goalError && <div style={{ fontSize: 12, color: '#DC2626' }}>{goalError}</div>}
              <button type="submit" style={{
                height: 42, padding: '0 20px', backgroundColor: '#7C3AED', color: '#FFFFFF',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
                fontFamily: 'var(--font-sans)', cursor: 'pointer', transition: 'background-color 0.15s', alignSelf: 'flex-start',
              }}
                onMouseEnter={e => (e.target.style.backgroundColor = '#6D28D9')}
                onMouseLeave={e => (e.target.style.backgroundColor = '#7C3AED')}
              >
                + Criar meta
              </button>
            </form>
          </div>

          {/* Goals list */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F2EE', fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
              Minhas metas
            </div>
            {goals.length === 0 ? (
              <div style={{ padding: '32px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>Nenhuma meta criada.</div>
            ) : goals.map((goal, i) => {
              const saved = goal.deposits.reduce((s, d) => s + d.amount, 0)
              const pct = goal.targetAmount > 0 ? Math.min((saved / goal.targetAmount) * 100, 100) : 0
              const active = selectedGoalId === goal.id
              return (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoalId(active ? null : goal.id)}
                  style={{
                    padding: '16px 24px',
                    borderBottom: i < goals.length - 1 ? '1px solid #F3F2EE' : 'none',
                    cursor: 'pointer',
                    backgroundColor: active ? '#FAF5FF' : 'transparent',
                    borderLeft: active ? '3px solid #7C3AED' : '3px solid transparent',
                    transition: 'background-color 0.1s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#FAFAF8' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>{goal.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#7C3AED', fontWeight: 600 }}>
                        {formatBRL(saved)}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); handleRemoveGoal(goal.id) }}
                        style={{ background: 'none', border: 'none', color: '#D1CBC2', cursor: 'pointer', fontSize: 15, padding: '2px', lineHeight: 1, transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.target.style.color = '#DC2626')}
                        onMouseLeave={e => (e.target.style.color = '#D1CBC2')}
                      >×</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 5, backgroundColor: '#F3F2EE', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: pct >= 100 ? '#7C3AED' : '#A78BFA', borderRadius: 3, transition: 'width 0.4s ease' }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                      {pct.toFixed(0)}% · meta {formatBRL(goal.targetAmount)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: deposit form + deposit history */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {!selectedGoal ? (
            <div style={{
              backgroundColor: '#FFFFFF', border: '1.5px dashed #E4E2DC', borderRadius: 12,
              padding: '48px 28px', textAlign: 'center', color: '#9CA3AF', fontSize: 14,
            }}>
              Selecione uma meta ao lado para registrar depósitos.
            </div>
          ) : (
            <>
              {/* Deposit form */}
              <div style={{ backgroundColor: '#FAF5FF', border: '1.5px solid #DDD6FE', borderRadius: 12, padding: '24px 28px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', marginBottom: 4 }}>
                  Depositar em: {selectedGoal.name}
                </div>
                {(() => {
                  const saved = selectedGoal.deposits.reduce((s, d) => s + d.amount, 0)
                  const remaining = Math.max(selectedGoal.targetAmount - saved, 0)
                  return (
                    <div style={{ fontSize: 12, color: '#A78BFA', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
                      {formatBRL(saved)} guardados · faltam {formatBRL(remaining)}
                    </div>
                  )
                })()}
                <form onSubmit={handleAddDeposit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Valor (R$)</label>
                      <input type="text" inputMode="decimal" value={depositAmount} onChange={e => setDepositAmount(sanitizeDecimalInput(e.target.value))}
                        placeholder="0,00"
                        style={{ ...inputStyle, fontFamily: 'var(--font-mono)' }}
                        onFocus={e => (e.target.style.borderColor = '#7C3AED')}
                        onBlur={e => (e.target.style.borderColor = '#E4E2DC')} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Data</label>
                      <div style={{ height: 42, padding: '0 14px', border: '1.5px solid #E4E2DC', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-mono)', color: '#9CA3AF', backgroundColor: '#F5F4F2', display: 'flex', alignItems: 'center' }}>
                        {formatDate(todayISO())}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: '#6B6860', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Observação (opcional)</label>
                    <input type="text" value={depositNote} onChange={e => setDepositNote(e.target.value)}
                      placeholder="ex: Bônus, economia do mês…"
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#7C3AED')}
                      onBlur={e => (e.target.style.borderColor = '#E4E2DC')} />
                  </div>
                  {depositError && <div style={{ fontSize: 12, color: '#DC2626' }}>{depositError}</div>}
                  <button type="submit" style={{
                    height: 42, padding: '0 20px', backgroundColor: '#7C3AED', color: '#FFFFFF',
                    border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    fontFamily: 'var(--font-sans)', cursor: 'pointer', transition: 'background-color 0.15s', alignSelf: 'flex-start',
                  }}
                    onMouseEnter={e => (e.target.style.backgroundColor = '#6D28D9')}
                    onMouseLeave={e => (e.target.style.backgroundColor = '#7C3AED')}
                  >
                    + Registrar depósito
                  </button>
                </form>
              </div>

              {/* Deposit history */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F2EE', fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
                  Depósitos — {selectedGoal.name}
                </div>
                {selectedGoal.deposits.length === 0 ? (
                  <div style={{ padding: '32px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                    Nenhum depósito ainda.
                  </div>
                ) : selectedGoal.deposits.map((dep, i) => (
                  <div key={dep.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 24px',
                    borderBottom: i < selectedGoal.deposits.length - 1 ? '1px solid #F3F2EE' : 'none',
                    transition: 'background-color 0.1s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAFAF8')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>◎</div>
                      <div>
                        <div style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{dep.note || 'Depósito'}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{formatDate(dep.date)}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#7C3AED' }}>
                        +{formatBRL(dep.amount)}
                      </span>
                      <button
                        onClick={() => onRemoveDeposit(selectedGoal.id, dep.id)}
                        style={{ background: 'none', border: 'none', color: '#D1CBC2', cursor: 'pointer', fontSize: 15, padding: '2px', lineHeight: 1, transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.target.style.color = '#DC2626')}
                        onMouseLeave={e => (e.target.style.color = '#D1CBC2')}
                      >×</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
