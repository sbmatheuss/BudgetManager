import { useState } from 'react'
import BudgetForm from './BudgetForm'

const colunas = [
  { nome: 'categoria', titulo: 'Categoria', tipo: 'text' },
  { nome: 'quantidade', titulo: 'Quantidade', tipo: 'number' },
]

const moeda = (valor) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// "novo" só serve para a animação de entrada; não vai para a planilha
const novaLinha = (categoria = '', quantidade = '') => ({
  id: crypto.randomUUID(),
  categoria,
  quantidade,
  novo: true,
})

export default function BudgetTable({
  budgetData,
  setBudgetData,
}) {
  const [saindo, setSaindo] = useState([])

  const addRow = (categoria, quantidade) =>
    setBudgetData((atual) => [...atual, novaLinha(categoria, quantidade)])

  const alterar = (id, campo, valor) =>
    setBudgetData((atual) =>
      atual.map((d) => (d.id === id ? { ...d, [campo]: valor } : d)),
    )

  const remover = (id) => {
    setBudgetData((atual) => atual.filter((d) => d.id !== id))
    setSaindo((atual) => atual.filter((s) => s !== id))
  }

  // A linha só é removida quando a animação de saída termina
  const comecarRemocao = (id) => setSaindo((atual) => [...atual, id])

  const total = budgetData.reduce((soma, d) => soma + (Number(d.quantidade) || 0), 0)

  const animacao = (despesa) =>
    saindo.includes(despesa.id) ? 'animate-sair' : despesa.novo ? 'animate-entrar' : ''

  return (
    <div className="flex flex-col gap-5">
      <BudgetForm onAddRow={addRow} />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-pauta text-lapis">
              {colunas.map(({ nome, titulo, tipo }) => (
                <th
                  key={nome}
                  className={`px-3 py-2 font-medium whitespace-nowrap ${tipo === 'number' ? 'text-right' : ''}`}
                >
                  {titulo ?? nome}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {budgetData.length === 0 && (
              <tr className="animate-aparecer">
                <td colSpan={colunas.length + 1} className="px-3 py-6 text-lapis">
                  Nenhuma despesa. Use o formulário acima para adicionar.
                </td>
              </tr>
            )}
            {budgetData.map((despesa) => (
              <tr
                key={despesa.id}
                className={`border-b border-pauta ${animacao(despesa)}`}
                onAnimationEnd={(e) => {
                  if (e.animationName === 'sair') remover(despesa.id)
                }}
              >
                {colunas.map(({ nome, titulo, tipo }) => (
                  <td key={nome} className="px-1 py-1">
                    <input
                      type={tipo}
                      value={despesa[nome]}
                      onChange={(e) => alterar(despesa.id, nome, e.target.value)}
                      aria-label={titulo ?? nome}
                      min={tipo === 'number' ? 0 : undefined}
                      step={tipo === 'number' ? '1' : undefined}
                      className={`w-full min-w-24 rounded border border-transparent bg-transparent px-2 py-1.5 transition-colors hover:border-pauta focus:border-razao focus:bg-white focus:outline-none ${tipo === 'number' ? 'text-right tabular-nums' : ''}`}
                    />
                  </td>
                ))}
                <td className="px-1 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => comecarRemocao(despesa.id)}
                    disabled={saindo.includes(despesa.id)}
                    aria-label="Remover despesa"
                    className="rounded px-2 py-1 text-lapis transition-colors hover:bg-estouro-claro hover:text-estouro-texto focus-visible:outline-2 focus-visible:outline-razao"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {/* Sublinhado duplo: o jeito de marcar o total num livro contábil */}
            <tr className="border-t-4 border-double border-tinta font-semibold">
              <td colSpan={colunas.length - 1} className="px-3 py-2">
                Total
              </td>
              <td className="px-3 py-2 text-right whitespace-nowrap tabular-nums">
                {moeda(total)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
