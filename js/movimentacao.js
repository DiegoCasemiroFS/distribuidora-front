// Função para exibir formulários de movimentação no <main>
function mostrarFormularioMovimentacao(tipo) {
    const conteudo = document.getElementById("conteudo");

    if (!conteudo) {
        console.error("Elemento #conteudo não encontrado.");
        return;
    }

    let html = "";

    switch (tipo) {
        case "procurar":
            html = `
                <h2>Procurar Movimentação</h2>
                <form onsubmit="procurarMovimentacao(event)">
                    <label for="id">ID:</label>
                    <input type="number" id="id" required>
                    <button type="submit">Procurar</button>
                </form>
                <div id="resultado"></div>
            `;
            break;

        case "lista":
            html = `
                <h2>Lista de Movimentações</h2>
                <button onclick="listarMovimentacoes()">Atualizar Lista</button>
                <div id="resultado"></div>
            `;
            break;

        case "venda":
            html = `
                <h2>Venda de Produto</h2>
                <form onsubmit="realizarVenda(event)">
                    <label for="id_produto">ID do Produto:</label>
                    <input type="number" id="id_produto" required>
                    <label for="id_cliente">ID do Cliente:</label>
                    <input type="number" id="id_cliente" required>
                    <label for="quantidade">Quantidade:</label>
                    <input type="number" id="quantidade" required>
                    <button type="submit">Vender</button>
                </form>
                <div id="resultado"></div>
            `;
            break;

        case "compra":
            html = `
                <h2>Compra de Produto</h2>
                <form onsubmit="realizarCompra(event)">
                    <label for="id_produto">ID do Produto:</label>
                    <input type="number" id="id_produto" required>
                    <label for="id_fornecedor">ID do Fornecedor:</label>
                    <input type="number" id="id_fornecedor" required>
                    <label for="quantidade">Quantidade:</label>
                    <input type="number" id="quantidade" required>
                    <button type="submit">Comprar</button>
                </form>
                <div id="resultado"></div>
            `;
            break;

        case "deleta":
            html = `
                <h2>Deletar Movimentação</h2>
                <form onsubmit="deletarMovimentacao(event)">
                    <label for="id">ID:</label>
                    <input type="number" id="id" required>
                    <button type="submit">Deletar</button>
                </form>
                <div id="resultado"></div>
            `;
            break;

        default:
            html = "<p>Selecione uma ação.</p>";
    }

    conteudo.innerHTML = html;
}

function mostrarFormularioUsuario(acao) {
    let conteudo = document.getElementById("conteudo");
    conteudo.innerHTML = ""; // Limpa o conteúdo antes de adicionar algo novo

    if (acao === "procurar") {
        conteudo.innerHTML = `
            <h2>Procurar Movimentação por ID</h2>
            <input type="text" id="movId" placeholder="Digite o ID">
            <button onclick="procurarMovimentacao()">Buscar</button>
            <div id="resultado"></div>
        `;
    } else if (acao === "lista") {
        conteudo.innerHTML = `<h2>Lista de Movimentações</h2>`;
        listarMovimentacoes(); // Certifique-se de que essa função existe
    } else if (acao === "venda") {
        conteudo.innerHTML = `<h2>Registrar Venda</h2>`;
    } else if (acao === "compra") {
        conteudo.innerHTML = `<h2>Registrar Compra</h2>`;
    } else if (acao === "deleta") {
        conteudo.innerHTML = `<h2>Deletar Movimentação</h2>`;
    }
}

// Função para listar todas as movimentações
function listarMovimentacoes() {
    fetch("http://localhost:8080/movimentacao/listaTodas")
        .then(response => response.json())
        .then(movimentacoes => {
            const resultado = document.getElementById("resultado");
            if (!movimentacoes.length) {
                resultado.innerHTML = "<p>Nenhuma movimentação encontrada.</p>";
                return;
            }

            let html = "<table><tr><th>ID</th><th>Produto</th><th>Tipo</th><th>Quantidade</th><th>Data</th></tr>";
            movimentacoes.forEach(mov => {
                const produtoNome = mov.produtoId ? mov.produtoId.nome : "Produto não encontrado";
                const tipoMovimentacao = mov.tipoMovimentacao === 1 ? "Venda" : "Compra";
                const dataFormatada = new Date(mov.dataPedido).toLocaleString();

                html += `<tr>
                    <td>${mov.id}</td>
                    <td>${produtoNome}</td>
                    <td>${tipoMovimentacao}</td>
                    <td>${mov.quantidade}</td>
                    <td>${dataFormatada}</td>
                </tr>`;
            });
            html += "</table>";
            resultado.innerHTML = html;
        })
        .catch(error => console.error("Erro ao listar movimentações:", error));
}

// Função para realizar venda
function realizarVenda(event) {
    event.preventDefault();

    const idProduto = document.getElementById("id_produto").value;
    const idCliente = document.getElementById("id_cliente").value;
    const quantidade = document.getElementById("quantidade").value;

    fetch("http://localhost:8080/movimentacao/vendaCliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idProduto, idCliente, quantidade })
    })
    .then(response => response.json())
    .then(data => {
        alert("Venda realizada com sucesso!");
    })
    .catch(error => console.error("Erro ao realizar venda:", error));
}

// Função para realizar compra
function realizarCompra(event) {
    event.preventDefault();

    const idProduto = document.getElementById("id_produto").value;
    const idFornecedor = document.getElementById("id_fornecedor").value;
    const quantidade = document.getElementById("quantidade").value;

    fetch("http://localhost:8080/movimentacao/compraFornecedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idProduto, idFornecedor, quantidade })
    })
    .then(response => response.json())
    .then(data => {
        alert("Compra realizada com sucesso!");
    })
    .catch(error => console.error("Erro ao realizar compra:", error));
}

// Função para deletar movimentação
function deletarMovimentacao(event) {
    event.preventDefault();

    const id = document.getElementById("id").value;

    fetch(`http://localhost:8080/movimentacao/deletaMovimentacao/${id}`, { method: "DELETE" })
        .then(() => {
            alert("Movimentação deletada com sucesso!");
        })
        .catch(error => console.error("Erro ao deletar movimentação:", error));
}