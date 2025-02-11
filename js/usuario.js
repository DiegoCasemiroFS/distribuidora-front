// Função para exibir formulários no <main>
function mostrarFormularioUsuario(tipo) {
    const conteudo = document.getElementById("conteudo");

    if (!conteudo) {
        console.error("Elemento #conteudo não encontrado.");
        return;
    }

    let html = "";

    switch (tipo) {
        case "login":
            html = `
                <h2>Login</h2>
                <form onsubmit="loginUsuario(event)">
                    <label>Email:</label>
                    <input type="email" id="loginEmail" required>
                    <label>Senha:</label>
                    <input type="password" id="loginSenha" required>
                    <button type="submit">Entrar</button>
                </form>
                <div id="loginMensagem"></div>
            `;
            break;

        case "procurar":
            html = `
                <h2>Procurar Usuário por ID</h2>
                <form onsubmit="procurarUsuario(event)">
                    <label>ID:</label>
                    <input type="number" id="usuarioId" required>
                    <button type="submit">Procurar</button>
                </form>
                <div id="usuarioProcurado"></div>
            `;
            break;

        case "procurarPorEmail":
            html = `
                <h2>Procurar Usuário por Email</h2>
                <form onsubmit="procurarUsuarioEmail(event)">
                    <label>Email:</label>
                    <input type="email" id="usuarioEmail" required>
                    <button type="submit">Procurar</button>
                </form>
                <div id="usuarioProcuradoEmail"></div>
            `;
            break;

        case "lista":
            html = `
                <h2>Lista de Usuários</h2>
                <button onclick="listarUsuarios()">Atualizar Lista</button>
                <div id="listaUsuarios"></div>
            `;
            break;

        case "cadastro":
            html = `
                <h2>Cadastrar Usuário</h2>
                <form onsubmit="cadastrarUsuario(event)">
                    <label>Nome:</label>
                    <input type="text" id="nome" required>
                    <label>Email:</label>
                    <input type="email" id="email" required>
                    <label>Senha:</label>
                    <input type="password" id="senha" required>
                    <label>Telefone:</label>
                    <input type="text" id="telefone">
                    <label>Rua:</label>
                    <input type="text" id="enderecoRua" required>
                    <label>Número:</label>
                    <input type="number" id="enderecoNumero" required>
                    <label>Complemento:</label>
                    <input type="text" id="enderecoComplemento">
                    <label>Bairro:</label>
                    <input type="text" id="enderecoBairro" required>
                    <label>Cidade:</label>
                    <input type="text" id="enderecoCidade" required>
                    <label>Estado:</label>
                    <input type="text" id="enderecoEstado" required>
                    <label>CEP:</label>
                    <input type="text" id="enderecoCep" required>
                    <button type="submit">Cadastrar</button>
                </form>
            `;
            break;

        case "altera":
            html = `
                <h2>Alterar Usuário</h2>
                <form onsubmit="alterarUsuario(event)">
                    <label>ID:</label>
                    <input type="number" id="id" required>
                    <label>Nome:</label>
                    <input type="text" id="nome" required>
                    <label>Email:</label>
                    <input type="email" id="email" required>
                    <label>Senha:</label>
                    <input type="password" id="senha" required>
                    <label>Telefone:</label>
                    <input type="text" id="telefone">
                    <label>Rua:</label>
                    <input type="text" id="enderecoRua" required>
                    <label>Número:</label>
                    <input type="number" id="enderecoNumero" required>
                    <label>Complemento:</label>
                    <input type="text" id="enderecoComplemento">
                    <label>Bairro:</label>
                    <input type="text" id="enderecoBairro" required>
                    <label>Cidade:</label>
                    <input type="text" id="enderecoCidade" required>
                    <label>Estado:</label>
                    <input type="text" id="enderecoEstado" required>
                    <label>CEP:</label>
                    <input type="text" id="enderecoCep" required>
                    <button type="submit">Alterar</button>
                </form>
            `;
            break;

        case "deleta":
            html = `
                <h2>Deletar Usuário</h2>
                <form onsubmit="deletarUsuario(event)">
                    <label>ID:</label>
                    <input type="number" id="id" required>
                    <button type="submit">Deletar</button>
                </form>
            `;
            break;

        default:
            html = "<p>Selecione uma ação.</p>";
    }

    conteudo.innerHTML = html;
}
// Login de Usuário
function loginUsuario(event) {
    event.preventDefault();

    const loginRequest = {
        email: document.getElementById("loginEmail").value,
        senha: document.getElementById("loginSenha").value
    };

    fetch("http://localhost:8080/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginRequest)
    })
    .then(response => response.json())
    .then(usuario => {
        document.getElementById("loginMensagem").innerHTML = `<p>Bem-vindo(a), ${usuario.nome}!</p>`;
    })
    .catch(error => console.error("Erro ao realizar login:", error));
}

// Procurar Usuário por ID
function procurarUsuario(event) {
    event.preventDefault();
    const id = document.getElementById("usuarioId").value;

    if (!id) {
        alert("ID do usuário é necessário.");
        return;
    }

    fetch(`http://localhost:8080/usuario/procuraPorId/${id}`)
        .then(response => response.json())
        .then(usuario => {
            const usuarioProcurado = document.getElementById("usuarioProcurado");
            if (!usuarioProcurado) return;

            if (!usuario || Object.keys(usuario).length === 0) {
                usuarioProcurado.innerHTML = "<p>Usuário não encontrado.</p>";
            } else {
                usuarioProcurado.innerHTML = `
                    <p>ID: ${usuario.id}</p>
                    <p>Nome: ${usuario.nome}</p>
                    <p>Email: ${usuario.email}</p>
                    <p>Telefone: ${usuario.telefone}</p>
                    <p>Endereço: ${usuario.endereco}</p>
                `;
            }
        })
        .catch(error => console.error("Erro ao procurar usuário:", error));
}

// Procurar Usuário por Email
function procurarUsuarioEmail(event) {
    event.preventDefault();
    const email = document.getElementById("usuarioEmail").value;

    if (!email) {
        alert("Email do usuário é necessário.");
        return;
    }

    fetch(`http://localhost:8080/usuario/procuraPorEmail?email=${encodeURIComponent(email)}`)
        .then(response => response.json())
        .then(usuario => {
            const usuarioProcuradoEmail = document.getElementById("usuarioProcuradoEmail");
            if (!usuarioProcuradoEmail) return;

            if (!usuario || Object.keys(usuario).length === 0) {
                usuarioProcuradoEmail.innerHTML = "<p>Usuário não encontrado.</p>";
            } else {
                usuarioProcuradoEmail.innerHTML = `
                    <p>ID: ${usuario.id}</p>
                    <p>Nome: ${usuario.nome}</p>
                    <p>Email: ${usuario.email}</p>
                    <p>Telefone: ${usuario.telefone}</p>
                    <p>Endereço: ${usuario.endereco.rua}, ${usuario.endereco.numero}, ${usuario.endereco.complemento || ''}, ${usuario.endereco.bairro}, ${usuario.endereco.cidade}, ${usuario.endereco.estado}, ${usuario.endereco.cep}</p>
                `;
            }
        })
        .catch(error => console.error("Erro ao procurar usuário por email:", error));
}

// Listar Usuários
function listarUsuarios() {
    fetch("http://localhost:8080/usuario/listaTodos")
        .then(response => response.json())
        .then(usuarios => {
            const lista = document.getElementById("listaUsuarios");
            if (!lista) return;

            if (usuarios.length === 0) {
                lista.innerHTML = "<p>Nenhum usuário encontrado.</p>";
            } else {
                let html = `<table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Endereço</th>
                        </tr>
                    </thead>
                    <tbody>
                `;

                usuarios.forEach(usuario => {
                    const endereco = usuario.endereco;
                    const enderecoCompleto = `${endereco.rua}, ${endereco.numero}, ${endereco.complemento || ''}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}, ${endereco.cep}`;

                    html += `
                        <tr>
                            <td>${usuario.id}</td>
                            <td>${usuario.nome}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.telefone}</td>
                            <td>${enderecoCompleto}</td>
                        </tr>
                    `;
                });

                html += "</tbody></table>";
                lista.innerHTML = html;
            }
        })
        .catch(error => console.error("Erro ao buscar usuários:", error));
}

// Cadastrar Usuário
function cadastrarUsuario(event) {
    event.preventDefault();

    const usuario = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value,
        telefone: document.getElementById("telefone").value,
        endereco: {
            rua: document.getElementById("enderecoRua").value,
            numero: document.getElementById("enderecoNumero").value,
            complemento: document.getElementById("enderecoComplemento").value,
            bairro: document.getElementById("enderecoBairro").value,
            cidade: document.getElementById("enderecoCidade").value,
            estado: document.getElementById("enderecoEstado").value,
            cep: document.getElementById("enderecoCep").value
        }
    };

    fetch("http://localhost:8080/usuario/cadastraUsuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(data => alert("Usuário cadastrado com sucesso!"))
    .catch(error => console.error("Erro ao cadastrar usuário:", error));
}

// Alterar Usuário
function alterarUsuario(event) {
    event.preventDefault();

    const usuario = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value,
        telefone: document.getElementById("telefone").value,
        endereco: document.getElementById("endereco").value
    };

    const id = document.getElementById("id").value;

    fetch(`http://localhost:8080/usuario/alteraUsuario/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(data => alert("Usuário alterado com sucesso!"))
    .catch(error => console.error("Erro ao alterar usuário:", error));
}

// Deletar Usuário
function deletarUsuario(event) {
    event.preventDefault();
    const id = document.getElementById("id").value;

    fetch(`http://localhost:8080/usuario/deletaUsuario/${id}`, {
        method: "DELETE"
    })
    .then(() => alert("Usuário deletado com sucesso!"))
    .catch(error => console.error("Erro ao deletar usuário:", error));
}