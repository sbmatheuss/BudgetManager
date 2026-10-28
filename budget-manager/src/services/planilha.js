const url = import.meta.env.VITE_SHEETS_URL

const enviar = (corpo) =>
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(corpo),
  }).then((r) => r.json())

export const lerLinhas = (aba) =>
  fetch(aba ? `${url}?aba=${encodeURIComponent(aba)}` : url).then((r) => r.json())

export const adicionarLinha = (dados) => enviar(dados)

// Troca todas as linhas da aba (menos o cabeçalho) pelas linhas enviadas
export const salvarLinhas = (aba, linhas) =>
  enviar({ acao: 'substituir', aba, linhas })
