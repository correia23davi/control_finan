import { useState, useEffect } from 'react'
import { db, uid } from './db.js'
import { useIsMobile } from './hooks/useIsMobile.js'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import IncomePage from './pages/IncomePage.jsx'
import ExpensesPage from './pages/ExpensesPage.jsx'
import SavingsPage from './pages/SavingsPage.jsx'

export default function App() {
  const isMobile = useIsMobile()
  const [page, setPage] = useState('dashboard')
  const [incomes, setIncomes] = useState([])
  const [expenses, setExpenses] = useState([])
  const [goals, setGoals] = useState([])

  // Carrega o "banco" (localStorage) uma vez, ao montar o app.
  useEffect(() => {
    const data = db.getAll()
    setIncomes(data.incomes)
    setExpenses(data.expenses)
    setGoals(data.goals)
  }, [])

  // ── Ações — cada uma persiste no banco e atualiza o estado local
  // com o retorno (a "fonte da verdade" é sempre o db.js) ──────────────

  function handleAddIncome(payload) {
    setIncomes(db.addIncome(payload))
  }
  function handleRemoveIncome(id) {
    setIncomes(db.removeIncome(id))
  }

  function handleAddExpense(payload) {
    setExpenses(db.addExpense(payload))
  }
  function handleRemoveExpense(id) {
    setExpenses(db.removeExpense(id))
  }

  function handleAddGoal(payload) {
    const newId = uid()
    const updated = db.addGoal(payload)
    setGoals(updated)
    // O primeiro item da lista é sempre o recém-criado
    return updated[0]?.id ?? newId
  }
  function handleRemoveGoal(id) {
    setGoals(db.removeGoal(id))
  }
  function handleAddDeposit(goalId, payload) {
    setGoals(db.addDeposit(goalId, payload))
  }
  function handleRemoveDeposit(goalId, depositId) {
    setGoals(db.removeDeposit(goalId, depositId))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: '100vh',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <Sidebar page={page} setPage={setPage} isMobile={isMobile} />
      <main
        style={{
          flex: 1,
          padding: isMobile ? '20px 16px' : '40px 48px',
          backgroundColor: '#F7F6F2',
          overflowY: 'auto',
          minHeight: isMobile ? 'auto' : '100vh',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {page === 'dashboard' && <Dashboard incomes={incomes} expenses={expenses} goals={goals} isMobile={isMobile} />}
          {page === 'income' && (
            <IncomePage incomes={incomes} onAdd={handleAddIncome} onRemove={handleRemoveIncome} isMobile={isMobile} />
          )}
          {page === 'expenses' && (
            <ExpensesPage expenses={expenses} onAdd={handleAddExpense} onRemove={handleRemoveExpense} isMobile={isMobile} />
          )}
          {page === 'savings' && (
            <SavingsPage
              goals={goals}
              onAddGoal={handleAddGoal}
              onRemoveGoal={handleRemoveGoal}
              onAddDeposit={handleAddDeposit}
              onRemoveDeposit={handleRemoveDeposit}
              isMobile={isMobile}
            />
          )}
        </div>
      </main>
    </div>
  )
}
