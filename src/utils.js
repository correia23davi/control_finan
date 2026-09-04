export function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(iso) {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

/**
 * Filtra um texto digitado deixando só o que é válido para um valor
 * monetário: dígitos e UMA vírgula ou ponto decimal (o que vier primeiro).
 * Usado nos campos de "Valor (R$)" para impedir que o usuário digite letras.
 */
export function sanitizeDecimalInput(value) {
  // Remove tudo que não é dígito, vírgula ou ponto
  let cleaned = value.replace(/[^0-9,.]/g, '')

  // Mantém só o primeiro separador decimal (vírgula ou ponto) digitado
  const firstSeparatorMatch = cleaned.match(/[,.]/)
  if (firstSeparatorMatch) {
    const sepIndex = firstSeparatorMatch.index
    const sep = cleaned[sepIndex]
    const before = cleaned.slice(0, sepIndex + 1)
    const after = cleaned.slice(sepIndex + 1).replace(/[,.]/g, '')
    cleaned = before + after
    // guarda qual separador foi usado (não precisa fazer nada extra aqui,
    // parseFloat(value.replace(',', '.')) já trata os dois casos)
    void sep
  }

  return cleaned
}

/**
 * Filtra um texto digitado deixando só dígitos inteiros.
 * Usado no campo "Nº de parcelas".
 */
export function sanitizeIntegerInput(value) {
  return value.replace(/[^0-9]/g, '')
}

/**
 * Soma (ou subtrai) meses a uma data ISO (yyyy-mm-dd), retornando outra
 * data ISO. Usado para calcular a data da última parcela de uma despesa
 * parcelada (data da 1ª parcela + número de parcelas).
 */
export function addMonths(iso, months) {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1 + months, day))
  return date.toISOString().split('T')[0]
}

/**
 * Aplica uma máscara de moeda em tempo real, no formato "1.234,56".
 * Trata os dígitos digitados como centavos (funciona como as máscaras de
 * valor de bancos/apps financeiros): ao digitar "150000" o campo mostra
 * "1.500,00". Usado em todos os campos de "Valor (R$)" do sistema.
 */
export function maskCurrencyInput(value) {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  const cents = parseInt(digits, 10)
  const amount = cents / 100
  return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * Converte um valor com máscara de moeda (ex: "1.234,56") de volta para
 * number (ex: 1234.56). Retorna NaN se estiver vazio ou inválido.
 */
export function unmaskCurrency(masked) {
  if (!masked) return NaN
  const normalized = masked.replace(/\./g, '').replace(',', '.')
  return parseFloat(normalized)
}
