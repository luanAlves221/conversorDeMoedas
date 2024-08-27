function converterMoeda() {
    const moedaOrigem = document.getElementById('moedaOrigem').value;
    const moedaDestino = document.getElementById('moedaDestino').value;
    const valor = document.getElementById('valor').value;

    if (!moedaOrigem || !moedaDestino || !valor || valor <= 0) {
        document.getElementById('resultado').innerText = 'Por favor. Insira um valor Válido e selecione as moedas';
        return;
    }
}
//é necessario fazer a requisição para o backEnd
