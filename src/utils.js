export function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(iso) {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}


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

    void sep
  }

  return cleaned
}


export function sanitizeIntegerInput(value) {
  return value.replace(/[^0-9]/g, '')
}


export function addMonths(iso, months) {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1 + months, day))
  return date.toISOString().split('T')[0]
}


export function maskCurrencyInput(value) {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  const cents = parseInt(digits, 10)
  const amount = cents / 100
  return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function unmaskCurrency(masked) {
  if (!masked) return NaN
  const normalized = masked.replace(/\./g, '').replace(',', '.')
  return parseFloat(normalized)
}
