const colunas = ['Nome', 'Email', 'Telefone', 'Cidade', 'DataCadastro']

// O Sheets pode converter a data em Date, que chega como string ISO
const formatarData = (valor) => {
  const data = new Date(valor)
  return typeof valor === 'string' && valor.includes('T') && !isNaN(data)
    ? data.toLocaleDateString('pt-BR')
    : valor
}

export default function ListaCadastros({ cadastros, carregando, erro }) {
  if (carregando) {
    return <p className="text-sm text-gray-500">Carregando cadastros...</p>
  }
  if (erro) {
    return (
      <p className="text-sm text-red-600">
        Não foi possível carregar os cadastros.
      </p>
    )
  }
  if (cadastros.length === 0) {
    return <p className="text-sm text-gray-500">Nenhum cadastro ainda.</p>
  }

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            {colunas.map((col) => (
              <th key={col} className="px-3 py-2 font-medium whitespace-nowrap">
                {col === 'DataCadastro' ? 'Data' : col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cadastros.map((linha, i) => (
            <tr key={i} className="border-t border-gray-200">
              {colunas.map((col) => (
                <td key={col} className="px-3 py-2 whitespace-nowrap">
                  {col === 'DataCadastro' ? formatarData(linha[col]) : linha[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
