import { useEffect, useRef, useState } from 'react'

const CHAVE_ORCAMENTO = 'orcamentoTotal'

// Cor da barra conforme a situação; o trilho é um tom claro da mesma cor
const situacoes = {
  ok: { barra: 'var(--color-razao)', trilho: 'var(--color-razao-claro)', icone: '●', rotulo: 'Dentro do orçamento' },
  alerta: { barra: 'var(--color-alerta)', trilho: 'var(--color-alerta-claro)', icone: '▲', rotulo: 'Perto do limite' },
  estourado: { barra: 'var(--color-estouro)', trilho: 'var(--color-estouro-claro)', icone: '✕', rotulo: 'Orçamento estourado' },
}

const moeda = (valor) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const lerOrcamentoSalvo = () => {
  try {
    return localStorage.getItem(CHAVE_ORCAMENTO) ?? ''
  } catch {
    return ''
  }
}

// Faz o número "correr" até o valor novo em vez de trocar de uma vez
function useNumeroAnimado(alvo) {
  const [valor, setValor] = useState(0)
  const atual = useRef(0)

  useEffect(() => {
    const inicio = atual.current
    const comeco = performance.now()
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let quadro

    const passo = (agora) => {
      const progresso = semMovimento ? 1 : Math.min((agora - comeco) / 600, 1)
      const suavizado = 1 - (1 - progresso) ** 3
      atual.current = inicio + (alvo - inicio) * suavizado
      setValor(atual.current)
      if (progresso < 1) quadro = requestAnimationFrame(passo)
    }

    quadro = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(quadro)
  }, [alvo])

  return valor
}

export default function BudgetStatsDashboard({ budgetData }) {
  const [orcamento, setOrcamento] = useState(lerOrcamentoSalvo)
  const [dica, setDica] = useState(false)

  const alterarOrcamento = (e) => {
    setOrcamento(e.target.value)
    try {
      localStorage.setItem(CHAVE_ORCAMENTO, e.target.value)
    } catch {
      // Sem localStorage o valor vale só até recarregar a página
    }
  }

  const total = Number(orcamento) || 0
  const gasto = budgetData.reduce((soma, d) => soma + (Number(d.quantidade) || 0), 0)
  const restante = total - gasto
  const percentual = total > 0 ? (gasto / total) * 100 : 0

  const gastoAnimado = useNumeroAnimado(gasto)
  const restanteAnimado = useNumeroAnimado(restante)

  const situacao =
    gasto > total ? 'estourado' : percentual >= 80 ? 'alerta' : 'ok'
  const { barra, trilho, icone, rotulo } = situacoes[situacao]

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-lapis">Restante</p>
          <p
            className={`text-5xl font-semibold tracking-tight ${
              total > 0 && restante < 0 ? 'text-estouro-texto' : 'text-tinta'
            }`}
          >
            {total > 0 ? moeda(restanteAnimado) : '—'}
          </p>
        </div>

        <dl className="grid grid-cols-[auto_auto] items-center gap-x-6 gap-y-2 text-sm">
          <dt className="text-lapis">Orçamento</dt>
          <dd className="flex items-center justify-end gap-1">
            <span className="text-lapis">R$</span>
            <input
              type="number"
              value={orcamento}
              onChange={alterarOrcamento}
              aria-label="Orçamento total em reais"
              min={0}
              step="0.01"
              placeholder="1000"
              className="w-28 border-b border-pauta bg-transparent px-1 py-0.5 text-right font-medium tabular-nums transition-colors focus:border-razao focus:outline-none"
            />
          </dd>
          <dt className="text-lapis">Gasto</dt>
          <dd className="text-right font-medium tabular-nums">{moeda(gastoAnimado)}</dd>
        </dl>
      </div>

      {total === 0 ? (
        <p className="text-sm text-lapis">
          Defina o orçamento para ver quanto ainda resta.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <div
            className="relative"
            onMouseEnter={() => setDica(true)}
            onMouseLeave={() => setDica(false)}
          >
            <div
              role="meter"
              aria-label="Orçamento gasto"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={gasto}
              aria-valuetext={`${moeda(gasto)} de ${moeda(total)}`}
              className="h-3 overflow-hidden rounded transition-colors duration-500"
              style={{ backgroundColor: trilho }}
            >
              <div
                className="h-full origin-left animate-encher rounded transition-[width,background-color] duration-500 ease-out"
                style={{ width: `${Math.min(percentual, 100)}%`, backgroundColor: barra }}
              />
            </div>

            {dica && (
              <div className="absolute top-5 left-0 z-10 animate-aparecer rounded-md border border-pauta bg-white px-3 py-2 text-sm shadow-sm">
                <p>
                  Gasto: <strong>{moeda(gasto)}</strong>
                </p>
                <p className="text-lapis">
                  Restante: {moeda(restante)} de {moeda(total)}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>
              <span aria-hidden="true" style={{ color: barra }}>
                {icone}
              </span>{' '}
              {rotulo}
            </span>
            <span className="text-lapis tabular-nums">
              {Math.round(percentual)}% gasto
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
