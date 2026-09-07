# Controle Financeiro

Conversão do projeto original (React + TypeScript, Figma Make) para **React puro em JavaScript**,
com um módulo de banco de dados em JS (`src/db.js`) responsável pela persistência dos dados.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173).

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

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

## Observações

- Os dados agora **persistem entre recarregamentos da página** (antes ficavam só em memória e
  sumiam ao dar F5). Isso é o que o `db.js` resolve.
- Removido o TypeScript e a configuração específica do Figma Make (plugins de preview, Tailwind, etc.),
  deixando um projeto Vite + React padrão, fácil de rodar em qualquer lugar.
