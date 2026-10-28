import { useState } from 'react'

const estiloCampo =
  'rounded-md border border-pauta bg-white px-3 py-2 font-normal transition-[border-color,box-shadow] focus:border-razao focus:ring-2 focus:ring-razao/20 focus:outline-none'

export default function BudgetForm({ onAddRow }) {
  const [categoria, setCategoria] = useState('')
  const [quantidade, setQuantidade] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    onAddRow(categoria.trim(), Number(quantidade))
    setCategoria('')
    setQuantidade('')
  }

  return (
    <form onSubmit={enviar} className="flex flex-wrap items-end gap-3">
      <label className="flex flex-1 flex-col gap-1 text-sm font-medium">
        Categoria
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
          className={estiloCampo}
        />
      </label>

      <label className="flex w-32 flex-col gap-1 text-sm font-medium">
        Quantidade
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          min={0}
          step="1"
          required
          className={`${estiloCampo} text-right tabular-nums`}
        />
      </label>

      <button
        type="submit"
        className="rounded-md border border-razao px-4 py-2 text-sm font-medium text-razao transition hover:bg-razao-claro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-razao active:scale-[0.98]"
      >
        Adicionar linha
      </button>
    </form>
  )
}
