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

        case "lista":
            html = `
                <h2>Lista de Produtos</h2>
                <button onclick="listarProdutos()">Atualizar Lista</button>
                <div id="listaProdutos"></div>
            `;
            break;

        default:
            html = "<p>Selecione uma ação.</p>";
    }

    conteudo.innerHTML = html;
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
                lista.innerHTML = "<ul>" + produtos.map(produto =>
                    `<li>ID: ${produto.id} - ${produto.nome} - ${produto.tipoProduto} - R$${produto.preco} - Estoque: ${produto.estoque}</li>`
                ).join("") + "</ul>";
            }
        })
        .catch(error => console.error("Erro ao buscar produtos:", error));
}
