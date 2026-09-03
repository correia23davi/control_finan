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
