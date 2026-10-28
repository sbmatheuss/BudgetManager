import { useState } from 'react'
import { adicionarLinha } from '../services/planilha'

const campos = [
  { nome: 'Nome', tipo: 'text' },
  { nome: 'Email', tipo: 'email' },
  { nome: 'Telefone', tipo: 'tel' },
  { nome: 'Cidade', tipo: 'text' },
]

const vazio = { Nome: '', Email: '', Telefone: '', Cidade: '' }

export default function FormCadastro({ onCadastro }) {
  const [dados, setDados] = useState(vazio)
  const [status, setStatus] = useState(null)

  const alterar = (e) =>
    setDados({ ...dados, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()
    setStatus('enviando')
    try {
      const linha = {
        ...dados,
        DataCadastro: new Date().toLocaleDateString('pt-BR'),
      }
      await adicionarLinha(linha)
      setDados(vazio)
      setStatus('ok')
      onCadastro?.(linha)
    } catch {
      setStatus('erro')
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      {campos.map(({ nome, tipo }) => (
        <label key={nome} className="flex flex-col gap-1 text-sm font-medium">
          {nome}
          <input
            type={tipo}
            name={nome}
            value={dados[nome]}
            onChange={alterar}
            required
            className="rounded-md border border-gray-300 px-3 py-2 font-normal focus:border-blue-500 focus:outline-none"
          />
        </label>
      ))}

      <button
        type="submit"
        disabled={status === 'enviando'}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'enviando' ? 'Enviando...' : 'Cadastrar'}
      </button>

      {status === 'ok' && (
        <p className="text-sm text-green-600">Cadastro salvo na planilha.</p>
      )}
      {status === 'erro' && (
        <p className="text-sm text-red-600">
          Não foi possível salvar. Tente novamente.
        </p>
      )}
    </form>
  )
}
