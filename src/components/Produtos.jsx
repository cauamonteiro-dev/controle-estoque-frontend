import { useState, useEffect } from "react";
import axios from "axios";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    preco: "",
  });

  const buscarProdutos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/produtos");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/produtos", {
        nome: novoProduto.nome,
        preco: Number(novoProduto.preco),
      });

      setNovoProduto({ nome: "", preco: "" });
      buscarProdutos();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
    }
  };

  return (
    <div>
      <h1>Produtos</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={novoProduto.nome}
          onChange={(e) =>
            setNovoProduto({ ...novoProduto, nome: e.target.value })
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

        <button type="submit">Cadastrar</button>
      </form>

      <ul>
        {produtos.map((produto) => (
          <li key={produto.id}>
            {produto.nome} - R$ {produto.preco}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Produtos;