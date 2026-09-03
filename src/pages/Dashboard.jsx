import StatCard from '../components/StatCard.jsx'
import { formatBRL, formatDate } from '../utils.js'

export default function Dashboard({ incomes, expenses, goals, isMobile }) {
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const balance = totalIncome - totalExpenses

  const futureInstallments = expenses.filter(e => e.installments > 1)
  const futureTotal = futureInstallments.reduce(
    (s, e) => s + e.amount * (e.installments - e.currentInstallment),
    0
  )

  const totalSaved = goals.reduce((s, g) => s + g.deposits.reduce((ds, d) => ds + d.amount, 0), 0)

  const recentAll = [
    ...incomes.map(i => ({ ...i, type: 'income' })),
    ...expenses.map(e => ({ ...e, type: 'expense' })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? 24 : 32, fontWeight: 600, color: '#1A1A1A', margin: 0, letterSpacing: '-0.02em' }}>
          Visão Geral
        </h1>
        <p style={{ margin: '6px 0 0', color: '#6B6860', fontSize: 14 }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard
          label="Saldo atual"
          value={formatBRL(balance)}
          sub={balance >= 0 ? '↑ Positivo' : '↓ Negativo'}
          color={balance >= 0 ? '#16A34A' : '#DC2626'}
          bg={balance >= 0 ? '#F0FDF4' : '#FEF2F2'}
        />
        <StatCard
          label="Total recebido"
          value={formatBRL(totalIncome)}
          sub={`${incomes.length} lançamentos`}
          color="#2563EB"
          bg="#EFF6FF"
        />
        <StatCard
          label="Total gasto"
          value={formatBRL(totalExpenses)}
          sub={`${expenses.length} despesas`}
          color="#DC2626"
          bg="#FEF2F2"
        />
        <StatCard
          label="Parcelas futuras"
          value={formatBRL(futureTotal)}
          sub={`${futureInstallments.length} parcelamentos`}
          color="#D97706"
          bg="#FFFBEB"
        />
        <StatCard
          label="Total poupado"
          value={formatBRL(totalSaved)}
          sub={`${goals.length} ${goals.length === 1 ? 'meta' : 'metas'}`}
          color="#7C3AED"
          bg="#F5F3FF"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
        {/* Recent transactions */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 12, padding: '24px 28px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 20, letterSpacing: '0.01em' }}>
            Lançamentos recentes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentAll.length === 0 && (
              <div style={{ color: '#9CA3AF', fontSize: 13 }}>Nenhum lançamento ainda.</div>
            )}
            {recentAll.map((item, i) => (
              <div
                key={item.id + item.type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: i < recentAll.length - 1 ? '1px solid #F3F2EE' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: item.type === 'income' ? '#16A34A' : '#DC2626',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{item.description}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{formatDate(item.date)}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)', color: item.type === 'income' ? '#16A34A' : '#DC2626' }}>
                  {item.type === 'income' ? '+' : '-'}{formatBRL(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings goals */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 12, padding: '24px 28px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 20, letterSpacing: '0.01em' }}>
            Metas de poupança
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {goals.length === 0 && (
              <div style={{ color: '#9CA3AF', fontSize: 13 }}>Nenhuma meta criada ainda.</div>
            )}
            {goals.map((goal, i) => {
              const saved = goal.deposits.reduce((s, d) => s + d.amount, 0)
              const pct = goal.targetAmount > 0 ? Math.min((saved / goal.targetAmount) * 100, 100) : 0
              const done = pct >= 100
              return (
                <div
                  key={goal.id}
                  style={{
                    padding: '12px 0',
                    borderBottom: i < goals.length - 1 ? '1px solid #F3F2EE' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{goal.name}</span>
                        {done && <span style={{ fontSize: 10, color: '#7C3AED', backgroundColor: '#F5F3FF', padding: '1px 6px', borderRadius: 3, fontWeight: 600 }}>CONCLUÍDA</span>}
                      </div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1, fontFamily: 'var(--font-mono)' }}>
                        {formatBRL(saved)} / {formatBRL(goal.targetAmount)}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600 }}>
                      {pct.toFixed(0)}%
                    </div>
                  </div>
                  <div style={{ height: 4, backgroundColor: '#F3F2EE', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: done ? '#7C3AED' : '#A78BFA', borderRadius: 2, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Installments panel */}
      {futureInstallments.length > 0 && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E2DC', borderRadius: 12, padding: '24px 28px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 20, letterSpacing: '0.01em' }}>
            Parcelas em andamento
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {futureInstallments.map(exp => {
              const remaining = exp.installments - exp.currentInstallment
              const pct = (exp.currentInstallment / exp.installments) * 100
              return (
                <div key={exp.id} style={{ padding: '14px 16px', backgroundColor: '#FAFAF8', borderRadius: 8, border: '1px solid #F3F2EE' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{exp.description}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                        {exp.currentInstallment}/{exp.installments} · {remaining} restantes
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#D97706', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {formatBRL(exp.amount * remaining)}
                    </div>
                  </div>
                  <div style={{ height: 3, backgroundColor: '#E4E2DC', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#D97706', borderRadius: 2 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
