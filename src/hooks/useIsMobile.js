import { useState, useEffect } from 'react'

/**
 * Retorna true quando a largura da tela é menor ou igual ao breakpoint
 * (768px por padrão, equivalente a tablets/celulares).
 * Atualiza automaticamente quando a janela é redimensionada.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  )

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= breakpoint)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isMobile
}
