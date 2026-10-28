import { use, useState } from 'react'
import BudgetStatsDashboard from './components/BudgetStatsDashboard'
import BudgetTable from './components/BudgetTable'
import { lerLinhas, salvarLinhas } from './services/planilha'

const ABA = 'orcamentos'

const loadBudgetData = async () => {
  try {
    const dados = await lerLinhas(ABA)
    return dados.map((linha) => ({
      // A tabela usa o id para editar e remover linhas
      id: crypto.randomUUID(),
      categoria: linha.Categoria,
      quantidade: linha.Quantidade,
    }))
  } catch (erro) {
    console.error('Erro ao carregar o orçamento:', erro)
    return []
  }
}

// Criada uma vez só, fora do componente, para não buscar de novo a cada renderização
const budgetDataPromise = loadBudgetData()

function App() {
  const [budgetData, setBudgetData] = useState(use(budgetDataPromise))
  const [status, setStatus] = useState(null)

  const saveBudgetData = async () => {
    setStatus('salvando')
    try {
      // Volta para os nomes das colunas da planilha; o id não vai junto
      const linhas = budgetData.map((item) => ({
        Categoria: item.categoria,
        Quantidade: item.quantidade,
      }))
      await salvarLinhas(ABA, linhas)
      setStatus('salvo')
    } catch (erro) {
      console.error('Erro ao salvar o orçamento:', erro)
      setStatus('erro')
    }
  }

  const alterarDados = (atualizar) => {
    setBudgetData(atualizar)
    setStatus(null)
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-semibold">Despesas</h1>
      <BudgetStatsDashboard budgetData={budgetData} />

      <h2 className="mt-12 mb-4 text-xl font-semibold">Lançamentos</h2>
      <BudgetTable budgetData={budgetData} setBudgetData={alterarDados} />

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={saveBudgetData}
          disabled={status === 'salvando'}
          className="rounded-md bg-razao px-4 py-2 text-sm font-medium text-white transition hover:bg-razao-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-razao active:scale-[0.98] disabled:opacity-60"
        >
          {status === 'salvando' ? 'Salvando...' : 'Salvar na planilha'}
        </button>
        {status === 'salvo' && (
          <p className="animate-aparecer text-sm text-razao">Alterações salvas.</p>
        )}
        {status === 'erro' && (
          <p className="animate-aparecer text-sm text-estouro-texto">
            Não foi possível salvar. Verifique a conexão e tente de novo.
          </p>
        )}
      </div>
    </main>
  )
}

export default App
