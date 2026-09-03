// ─────────────────────────────────────────────────────────────────────────
// "Banco de dados" em JS puro.
//
// Persiste os dados no localStorage do navegador (chave única, formato
// JSON) e expõe uma API de CRUD simples para cada "tabela": incomes
// (receitas), expenses (despesas) e goals (metas de poupança, cada uma
// com sua lista de deposits).
//
// A UI (App.jsx) nunca mexe no localStorage diretamente — sempre passa
// pelas funções deste arquivo, então dá pra trocar a forma de persistência
// no futuro (ex: IndexedDB, uma API remota, etc.) sem tocar nos
// componentes.
// ─────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'controle-financeiro:db:v1'

const EMPTY_DB = () => ({
  incomes: [],
  expenses: [],
  goals: [],
})

// ── Helpers internos ────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function readRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_DB()
    const parsed = JSON.parse(raw)
    return {
      incomes: Array.isArray(parsed.incomes) ? parsed.incomes : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
    }
  } catch (err) {
    console.error('Falha ao ler o banco local, iniciando um banco vazio.', err)
    return EMPTY_DB()
  }
}

function writeRaw(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ── API pública do banco ────────────────────────────────────────────────

export const db = {
  // Retorna o banco inteiro de uma vez (usado para carregar o app no início)
  getAll() {
    return readRaw()
  },

  clearAll() {
    const empty = EMPTY_DB()
    writeRaw(empty)
    return empty
  },

  // ── Receitas ───────────────────────────────────────────────────────
  getIncomes() {
    return readRaw().incomes
  },

  addIncome({ description, amount, date = todayISO() }) {
    const data = readRaw()
    const income = { id: uid(), description, amount, date }
    data.incomes = [income, ...data.incomes]
    writeRaw(data)
    return data.incomes
  },

  removeIncome(id) {
    const data = readRaw()
    data.incomes = data.incomes.filter(i => i.id !== id)
    writeRaw(data)
    return data.incomes
  },

  // ── Despesas ───────────────────────────────────────────────────────
  getExpenses() {
    return readRaw().expenses
  },

  addExpense({ description, amount, date = todayISO(), installments = 1, currentInstallment = 1, category }) {
    const data = readRaw()
    const expense = { id: uid(), description, amount, date, installments, currentInstallment, category }
    data.expenses = [expense, ...data.expenses]
    writeRaw(data)
    return data.expenses
  },

  removeExpense(id) {
    const data = readRaw()
    data.expenses = data.expenses.filter(e => e.id !== id)
    writeRaw(data)
    return data.expenses
  },

  // ── Metas de poupança ──────────────────────────────────────────────
  getGoals() {
    return readRaw().goals
  },

  addGoal({ name, targetAmount, createdAt = todayISO() }) {
    const data = readRaw()
    const goal = { id: uid(), name, targetAmount, deposits: [], createdAt }
    data.goals = [goal, ...data.goals]
    writeRaw(data)
    return data.goals
  },

  removeGoal(id) {
    const data = readRaw()
    data.goals = data.goals.filter(g => g.id !== id)
    writeRaw(data)
    return data.goals
  },

  addDeposit(goalId, { amount, note = '', date = todayISO() }) {
    const data = readRaw()
    data.goals = data.goals.map(g => {
      if (g.id !== goalId) return g
      const deposit = { id: uid(), amount, note, date }
      return { ...g, deposits: [deposit, ...g.deposits] }
    })
    writeRaw(data)
    return data.goals
  },

  removeDeposit(goalId, depositId) {
    const data = readRaw()
    data.goals = data.goals.map(g =>
      g.id !== goalId ? g : { ...g, deposits: g.deposits.filter(d => d.id !== depositId) }
    )
    writeRaw(data)
    return data.goals
  },
}

export { uid, todayISO }
