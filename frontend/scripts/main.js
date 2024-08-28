async function carregarMoedas() {
    const url = "https://open.er-api.com/v6/latest/USD";
    const response = await fetch(url);
    const dados = await response.json();
    const moedas = Object.keys(dados.rates);
    
    const s_moeda_o = document.getElementById("moedaOrigem");
    const s_moeda_d = document.getElementById("moedaDestino");

    moedas.forEach(codigo => {
        let opcao = new Option(codigo, codigo);
        s_moeda_o.add(opcao.cloneNode(true));
        s_moeda_d.add(opcao);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    carregarMoedas();
});

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
}

async function converterMoeda() {
    const moeda_o = document.getElementById('moedaOrigem').value;
    const moeda_d = document.getElementById('moedaDestino').value;
    let valor = document.getElementById('valor').value;

    valor = valor.replace("R$", "").replace(",", ".").trim();
    valor = parseFloat(valor);

    if (!moeda_o || !moeda_d || isNaN(valor) || valor <= 0) {
        document.getElementById('resultado').innerText = 'Por favor, insira um valor válido e selecione as moedas';
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


function formatarMoeda(campo) {
    let valor = campo.value.replace(/\D/g, "");
    valor = (valor / 100).toFixed(2) + "";
    valor = valor.replace(".", ",");
    valor = "R$ " + valor;
    campo.value = valor;
}

function limparResultados() {
    document.getElementById("valor").value = "R$ 0,00";  // Redefine o campo de input 'valor' para o valor inicial
    document.getElementById("resultado").textContent = "";  // Limpa o conteúdo da div 'resultado'
}
