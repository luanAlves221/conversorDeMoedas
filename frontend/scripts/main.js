async function carregarMoedas() {
    try {
        const url = "https://open.er-api.com/v6/latest/USD";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao carregar moedas");
        const dados = await response.json();
        const moedas = Object.keys(dados.rates);

        const s_moeda_o = document.getElementById("moedaOrigem");
        const s_moeda_d = document.getElementById("moedaDestino");

        moedas.forEach(codigo => {
            let opcao = new Option(codigo, codigo);
            s_moeda_o.add(opcao.cloneNode(true));
            s_moeda_d.add(opcao);
        });
    } catch (error) {
        alert("Falha ao carregar moedas. Tente novamente mais tarde.");
    }
}

async function calc(moeda_o, moeda_d, valor) {
    const url = `https://open.er-api.com/v6/latest/${moeda_o}`;
    const response = await fetch(url);
    const dados = await response.json();
    const taxa = dados.rates[moeda_d];
    return (valor * taxa).toFixed(2);
}

function s_historico(o, d, quantidade, resultado) {
    let historico = JSON.parse(localStorage.getItem('historicoC')) || [];
    historico.unshift({ o: o, d: d, quantidade: quantidade, resultado: resultado });
    historico = historico.slice(0, 10);
    localStorage.setItem('historicoC', JSON.stringify(historico));
    exibirHistorico();
}

function exibirHistorico() {
    const historico = JSON.parse(localStorage.getItem('historicoC')) || [];
    const lista = document.getElementById('historicoConversoes');
    lista.innerHTML = '';
    historico.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.quantidade} ${item.o} → ${item.d} = ${item.resultado}`;
        lista.appendChild(li);
    });
}

async function converterMoeda() {
    const moeda_o = document.getElementById('moedaOrigem').value;
    const moeda_d = document.getElementById('moedaDestino').value;
    let valor = document.getElementById('valor').value;

    valor = valor.replace("R$", "").replace(",", ".").trim();
    valor = parseFloat(valor);

    if (!moeda_o || !moeda_d || isNaN(valor) || valor <= 0) {
        document.getElementById('resultado').innerText = 'Por favor, insira um valor válido e selecione as moedas.';
        return;
    }

    try {
        const resultado = await calc(moeda_o, moeda_d, valor);
        document.getElementById('resultado').innerText = `R$ ${resultado}`;
        s_historico(moeda_o, moeda_d, valor, resultado);
    } catch (erro) {
        document.getElementById('resultado').innerText = 'Erro ao tentar realizar a conversão. Tente novamente mais tarde.';
    }
}

function formatarMoeda(campo) {
    let valor = campo.value.replace(/\D/g, "");
    valor = (valor / 100).toFixed(2) + "";
    valor = valor.replace(".", ",");
    valor = "R$ " + valor;
    campo.value = valor;
}

function limparResultados() {
    document.getElementById("valor").value = "R$ 0,00";
    document.getElementById("resultado").textContent = "";
}

function inverterMoedas() {
    const moedaOrigem = document.getElementById('moedaOrigem');
    const moedaDestino = document.getElementById('moedaDestino');
    const temp = moedaOrigem.value;
    moedaOrigem.value = moedaDestino.value;
    moedaDestino.value = temp;
}

document.addEventListener('DOMContentLoaded', function() {
    carregarMoedas();
    exibirHistorico();
});

function limparHistorico() {
    localStorage.removeItem('historicoC'); // Remove o item 'historicoC' do localStorage
    exibirHistorico(); // Atualiza a interface para refletir o histórico vazio
}
