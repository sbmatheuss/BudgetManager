// API do Budget Manager: lê e grava as abas da planilha.
// Cole este código em Extensões → Apps Script na própria planilha e publique como app da Web.

const ABA = 'clientes'

function doGet(e) {
  const nomeAba = (e && e.parameter.aba) || ABA
  const planilha = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = planilha.getSheetByName(nomeAba)
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      erro: 'aba não encontrada: ' + nomeAba,
      abas: planilha.getSheets().map(s => s.getName()),
    })).setMimeType(ContentService.MimeType.JSON)
  }
  const [cabecalho, ...linhas] = sheet.getDataRange().getValues()
  const dados = linhas.map(linha =>
    Object.fromEntries(cabecalho.map((col, i) => [col, linha[i]]))
  )
  return ContentService.createTextOutput(JSON.stringify(dados))
    .setMimeType(ContentService.MimeType.JSON)
}

function doPost(e) {
  const dados = JSON.parse(e.postData.contents)
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(dados.aba || ABA)
  const cabecalho = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]

  if (dados.acao === 'substituir') {
    const ultima = sheet.getLastRow()
    if (ultima > 1) {
      sheet.getRange(2, 1, ultima - 1, cabecalho.length).clearContent()
    }
    if (dados.linhas.length > 0) {
      const valores = dados.linhas.map(l => cabecalho.map(col => l[col] ?? ''))
      sheet.getRange(2, 1, valores.length, cabecalho.length).setValues(valores)
    }
  } else {
    sheet.appendRow(cabecalho.map(col => dados[col] ?? ''))
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON)
}
