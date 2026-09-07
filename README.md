

## Estrutura

```
src/
  db.js                    → "banco de dados" (localStorage + CRUD)
  utils.js                 → formatação de moeda (BRL) e datas
  App.jsx                  → estado global, ligação com o banco e navegação
  main.jsx                 → bootstrap do React
  index.css                → estilos globais
  components/
    Sidebar.jsx             → menu lateral de navegação
    StatCard.jsx            → cartão de estatística usado no Dashboard
  pages/
    Dashboard.jsx           → página "Visão Geral"
    IncomePage.jsx          → página "Receitas"
    ExpensesPage.jsx        → página "Despesas"
    SavingsPage.jsx         → página "Poupança"
```

- `src/db.js` — o "banco de dados": persiste tudo no `localStorage` do navegador
  (chave `controle-financeiro:db:v1`) e expõe uma API de CRUD:
  `getAll`, `getIncomes/addIncome/removeIncome`, `getExpenses/addExpense/removeExpense`,
  `getGoals/addGoal/removeGoal/addDeposit/removeDeposit`, `clearAll`.
  A UI nunca acessa o `localStorage` diretamente — só chama essas funções.
- `src/pages/` — cada rota da aplicação (Dashboard, Receitas, Despesas, Poupança) em seu
  próprio arquivo, recebendo os dados e funções de callback (`onAdd`, `onRemove`, etc.) via props.
- `src/components/` — pedaços de UI reutilizados entre páginas (Sidebar, StatCard).
- `src/App.jsx` — dono do estado (`incomes`, `expenses`, `goals`), decide qual página mostrar
  e é o único lugar que chama `db.js` diretamente.
