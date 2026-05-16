import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  // Base das funcionalidades
  const [produtos, setProdutos] = useState([]);

  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    quantidade: "",
    preco: ""
  });

  const [produtoEditando, setProdutoEditando] = useState(null);

  // Validação de produtos (para evitar produtos "vazios")
  const validarProduto = () => {
      if (
        !novoProduto.nome.trim() ||
        !novoProduto.quantidade ||
        !novoProduto.preco
      ) {
        alert("Preencha todos os campos corretamente!");
        return false;
      }

      if (Number(novoProduto.quantidade) <= 0) {
        alert("Quantidade deve ser maior que 0!");
        return false;
      }

      if (Number(novoProduto.preco) <= 0) {
        alert("Preço deve ser maior que 0!");
        return false;
      }

      return true;
  };

  // Busca produtos na API
  const buscarProdutos = () => {
    axios.get("http://localhost:8080/produtos")
      .then(response => {
        setProdutos(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar produtos:", error);
      });
  };

  // Busca produtos ao carregar a pagina
  useEffect(() => {
    buscarProdutos();
  }, []);

  // Cadastro de Produtos
  const cadastrarProduto = (e) => {
    e.preventDefault();

    if (!validarProduto()) return;

    axios.post("http://localhost:8080/produtos", {
      nome: novoProduto.nome,
      quantidade: Number(novoProduto.quantidade),
      preco: Number(novoProduto.preco)
    })
    .then(() => {
      setNovoProduto({ nome: "", quantidade: "", preco: "" });
      buscarProdutos();
    })
    .catch(error => {
      console.error("Erro ao cadastrar produto:", error);
    });
  };

// Deleta protudos
  const deletarProduto = (id) => {
    if (!window.confirm("Tem certeza que deseja deletar?")) return;

    axios.delete(`http://localhost:8080/produtos/${id}`)
      .then(() => {
        buscarProdutos();
      })
      .catch(error => {
        console.error("Erro ao deletar produto:", error);
      });
  };

// Inicia o modo de edição de produtos
  const editarProduto = (produto) => {
      setProdutoEditando(produto);

      setNovoProduto({
        nome: produto.nome,
        quantidade: produto.quantidade,
        preco: produto.preco
      });
  };

// Atualiza o produto editado
  const atualizarProduto = (e) => {
    e.preventDefault();

    if (!validarProduto()) return;

    axios.put(
      `http://localhost:8080/produtos/${produtoEditando.id}`,
      {
        nome: novoProduto.nome,
        quantidade: Number(novoProduto.quantidade),
        preco: Number(novoProduto.preco)
      }
    )
    .then(() => {
      setNovoProduto({ nome: "", quantidade: "", preco: "" });
      setProdutoEditando(null);
      buscarProdutos();
    })
    .catch(error => {
      console.error("Erro ao atualizar produto:", error);
    });
  };

  // Tela
  return (
    <div className="container">
      <h1>Controle de Estoque</h1>

      <div className="card">
        <h2>{produtoEditando ? "Atualizar Produto" : "Cadastrar Produto"}</h2>

        <form onSubmit={produtoEditando ? atualizarProduto : cadastrarProduto} className="form">

          <input
            type="text"
            placeholder="Nome do produto"
            value={novoProduto.nome}
            onChange={(e) =>
              setNovoProduto({ ...novoProduto, nome: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Quantidade"
            value={novoProduto.quantidade}
            onChange={(e) =>
              setNovoProduto({ ...novoProduto, quantidade: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Preço"
            value={novoProduto.preco}
            onChange={(e) =>
              setNovoProduto({ ...novoProduto, preco: e.target.value })
            }
          />

          <button type="submit">
            {produtoEditando ? "Atualizar" : "Cadastrar"}
          </button>

        </form>
      </div>

      <div className="card">
        <h2>Lista de Produtos</h2>

        <ul className="lista">
          {produtos.map(produto => (
            <li key={produto.id}>
              <strong>{produto.nome}</strong>
              <span>Qtd: {produto.quantidade}</span>
              <span>
                {Number(produto.preco).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </span>

              <button onClick={() => editarProduto(produto)}>
                Editar
              </button>

              <button onClick={() => deletarProduto(produto.id)}>
                X
              </button>

            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default App;