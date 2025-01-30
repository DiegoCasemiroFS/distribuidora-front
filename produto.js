// Função para exibir formulários no <main>
// Função para exibir formulários no <main>
function mostrarFormulario(tipo) {
    const conteudo = document.getElementById("conteudo");

    if (!conteudo) {
        console.error("Elemento #conteudo não encontrado.");
        return;
    }

    let html = "";

    switch (tipo) {
        case "procurar": 
            html = `
                <h2>Procurar Produto por Id</h2>
                <input type="number" id="produtoId" placeholder="Digite o ID">
                <button onclick="procurarProduto()">Procurar</button>
                <div id="produtoProcurado"></div>
            `;
            break;

        case "lista":
            html = `
                <h2>Lista de Produtos</h2>
                <button onclick="listarProdutos()">Atualizar Lista</button>
                <div id="listaProdutos"></div>
            `;
            break;

        case "cadastro":
            html = `
                <h2>Cadastrar Produto</h2>
                <form onsubmit="cadastrarProduto(event)">
                    <label>Nome:</label>
                    <input type="text" id="nome" required>

                    <label>Tipo:</label>
                    <select id="tipo">
                        <option value="CAPSULA">Cápsula</option>
                        <option value="OLEO_ESSENCIAL">Óleo Essencial</option>
                        <option value="OLEO_VEGETAL">Óleo Vegetal</option>
                        <option value="LIQUIDOS">Líquidos</option>
                    </select>

                    <label>Preço:</label>
                    <input type="number" id="preco" step="0.01" required>

                    <label>Quantidade:</label>
                    <input type="number" id="quantidade" required>

                    <label>Estoque Inicial:</label>
                    <input type="number" id="estoque" required>

                    <button type="submit">Cadastrar</button>
                </form>
            `;
            break;

            case "atualizaPreco":
                html = `
                <h2>Atualizar Preço</h2>
                <form onsubmit="atualizarPreco(event)">
                    <label>Id:</label>
                    <input type="number" id="id" required>

                    <label>Preço:</label>
                    <input type="number" id="preco" step="0.01" required>

                    <button type="submit">Atualizar</button>
                `;
                break;

            case "atualizaEstoque":
                html = `
                <h2>Atualizar Estoque</h2>
                <form onsubmit="atualizarEstoque(event)">
                    <label>Id:</label>
                    <input type="number" id="id" required>

                    <label>Quantidade:</label>
                    <input type="number" id="estoque" required>

                    <button type="submit">Atualizar</button>
                `;
                break
                
            case "deletar":
                html = `
                <h2>Deletar Produto</h2>
                <form onsubmit="deletarProduto(event)">
                    <label>Id:</label>
                    <input type="number" id="id" required>

                    <button type="submit">Deletar</button>
                `;
                break

        default:
            html = "<p>Selecione uma ação.</p>";
    }

    conteudo.innerHTML = html;
}

// Procurar Produto por ID
function procurarProduto() {
    const id = document.getElementById("produtoId").value;

    if (!id) {
        alert("ID do produto é necessário.");
        return;
    }

    fetch(`http://localhost:8080/produto/procuraPorId/${id}`)
    .then(response => response.json())
    .then(produto => {
        console.log(produto);  // Verifique o retorno no console
        const produtoProcurado = document.getElementById("produtoProcurado");
        if (!produtoProcurado) return;

        if (!produto || Object.keys(produto).length === 0) {
            produtoProcurado.innerHTML = "<p>Produto não encontrado.</p>";
        } else {
            produtoProcurado.innerHTML = `
                <p>ID: ${produto.id}</p>
                <p>Nome: ${produto.nome}</p>
                <p>Tipo: ${produto.tipoProduto}</p>
                <p>Preço: R$${produto.preco}</p>
                <p>Estoque: ${produto.estoque}</p>
            `;
        }
    })
    .catch(error => console.error("Erro ao procurar produto:", error));
}

// Listar Produtos
function listarProdutos() {
    fetch("http://localhost:8080/produto/listaTodos")
        .then(response => response.json())
        .then(produtos => {
            console.log(produtos);

            const lista = document.getElementById("listaProdutos");
            if (!lista) return;

            if (produtos.length === 0) {
                lista.innerHTML = "<p>Nenhum produto encontrado.</p>";
            } else {
                let html = `
                    <button onclick="exportarParaExcel()">Exportar para Excel</button>
                    <table id="tabelaProdutos">
                        <thead>
                            <tr>
                                <th onclick="ordenarTabela(0)">ID ⬍</th>
                                <th onclick="ordenarTabela(1)">Nome ⬍</th>
                                <th onclick="ordenarTabela(2)">Tipo ⬍</th>
                                <th onclick="ordenarTabela(3)">Preço ⬍</th>
                                <th onclick="ordenarTabela(4)">Estoque ⬍</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                produtos.forEach(produto => {
                    html += `
                        <tr>
                            <td>${produto.id}</td>
                            <td>${produto.nome}</td>
                            <td>${produto.tipoProduto}</td>
                            <td>R$${produto.preco.toFixed(2)}</td>
                            <td>${produto.estoque}</td>
                        </tr>
                    `;
                });

                html += "</tbody></table>";
                lista.innerHTML = html;
            }
        })
        .catch(error => console.error("Erro ao buscar produtos:", error));
}

// Cadastrar Produto
function cadastrarProduto(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const tipoProduto = document.getElementById("tipo").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const estoque = parseInt(document.getElementById("estoque").value);
    
    const produto = {
        nome: nome,
        tipoProduto: tipoProduto,
        preco: preco,
        quantidade: quantidade,
        estoque: estoque
    };

    fetch("http://localhost:8080/produto/cadastraProduto", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(data => {
        alert("Produto cadastrado com sucesso!");
    })
    .catch(error => console.error("Erro ao cadastrar produto:", error));
}

function atualizarPreco(event) {
    event.preventDefault();

    const id = document.getElementById("id").value;
    const preco = parseFloat(document.getElementById("preco").value);

    const produto = {
        id: id,
        preco: preco
    };

    fetch(`http://localhost:8080/produto/alteraPreco/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(data => {
        alert("Preço atualizado com sucesso!");
    })
    .catch(error => console.error("Erro ao atualizar preço:", error));
}

function atualizarEstoque(event) {
    event.preventDefault();

    const id = document.getElementById("id").value;
    const quantidade = parseInt(document.getElementById("estoque").value); // Alterado para "quantidade"

    const produto = {
        quantidade: quantidade // Nome correto para o backend
    };

    fetch(`http://localhost:8080/produto/alteraEstoque/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(data => {
        alert("Estoque atualizado com sucesso!");
    })
    .catch(error => console.error("Erro ao atualizar estoque:", error));
}


function deletarProduto(event) {
    event.preventDefault();

    const id = document.getElementById("id").value;

    fetch(`http://localhost:8080/produto/deletaProduto/${id}`, {
        method: "DELETE"
    })
    .then(() => alert("Produto deletado com sucesso!"))    
}

function ordenarTabela(coluna) {
    const tabela = document.getElementById("tabelaProdutos");
    const tbody = tabela.querySelector("tbody");
    const linhas = Array.from(tbody.rows);

    let ordemAtual = tabela.getAttribute(`data-ordem-${coluna}`) || "asc";

    linhas.sort((a, b) => {
        let valorA = a.cells[coluna].innerText.trim();
        let valorB = b.cells[coluna].innerText.trim();

        // Converter para número se for possível
        if (!isNaN(valorA) && !isNaN(valorB)) {
            valorA = Number(valorA);
            valorB = Number(valorB);
        }

        return ordemAtual === "asc" ? valorA > valorB ? 1 : -1 : valorA < valorB ? 1 : -1;
    });

    // Alternar ordem para próxima vez que clicar
    ordemAtual = ordemAtual === "asc" ? "desc" : "asc";
    tabela.setAttribute(`data-ordem-${coluna}`, ordemAtual);

    linhas.forEach(linha => tbody.appendChild(linha));
}

function exportarParaExcel() {
    const tabela = document.getElementById("tabelaProdutos");

    if (!tabela) {
        alert("Nenhuma tabela disponível para exportar.");
        return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(tabela);
    
    XLSX.utils.book_append_sheet(wb, ws, "Produtos");
    
    XLSX.writeFile(wb, "Lista_de_Produtos.xlsx");
}