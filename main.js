// Metodo para navegação das paginas
function navega(destino) {
  let telas = document.getElementsByClassName('tela');
  Array.from(telas).forEach((element) => {
    element.classList.remove('show');
    element.classList.add('collapse');
  });
  document.getElementById(destino).classList.remove('collapse');
  document.getElementById(destino).classList.add('show');
}

// Carregando todas as publis
async function carregarDados() {
  try {
    // Fazendo a requisição para carregar o arquivo JSON
    const resposta = await axios.get('dados.json'); // Caminho para o arquivo JSON
    const dadosPublicacoes = resposta.data;

    // Referência para o elemento da lista
    const cardsPublicaoes = document.getElementById('publicacoes');

    // Limpando a div antes de adicionar os novos itens
    cardsPublicaoes.innerHTML = '';

    // Exibindo os cards na tela
    dadosPublicacoes.forEach((publi) => {
      // Todas as publicações
      const card = document.createElement('div');
      card.classList.add('col', 'border', 'border-succes', 'm-2', 'border-3');
      card.innerHTML = `
        <!-- Card1 -->
        <div class="card border border-danger m-2 border-2">
          <!-- Superior -->
          <div class="d-flex flex-row justify-content-between border border-dark m-2 border-1">
            <div class="p-2 border border-dark m-2 border-1">
              <img src="${publi.foto}" alt="Perfil" style="width: 24px; border-radius: 50%;" />
              <span class="username" style="font-size: small;">${publi.nome}</span>
            </div>
            <div class="p-2 border
            border-dark m-2 border-1">
              <p>Tempo de Exposição: ${publi.lote.tempo}</p>
            </div>
          </div>
          <!-- Meio -->
          <div class="border border-dark m-2 border-1">
            <img src="${publi.lote.fotoProduto}" alt="" style="width: 100%; height: 150px;" />
          </div>
          <!-- Inferior -->
          <div class="d-flex flex-column mt-1 border border-dark m-2 border-1">
            <div class="d-flex flex-row justify-content-around px-2 border border-dark m-2 border-1">
              <div class="border border-dark m-2 border-1"><i>icon likes</i></div>
              <div class="border border-dark m-2 border-1">
                <button type="button" onclick="carregarPubli(${publi.id})">
                  Participar
                </button>
              </div>
              <div class="border border-dark m-2 border-1"><i>icon comp</i></div>
            </div>
            <div class="px-3 border border-dark m-2 border-1">
              <p>${publi.lote.descricao} </br>
                 ${publi.lote.postadoHa}
              </p>
            </div>
          </div>
        </div>
      `;
      cardsPublicaoes.appendChild(card);
    });
  } catch (erro) {
    console.error('Erro ao carregar os dados:', erro);
  }
}

// Carregando a publi
async function carregarPubli(dados) {
  try {
    navega('publicacao');

    const resposta = await axios.get('dados.json');

    const dadosPublicacoes = resposta.data;

    const publiSelecionada = document.getElementById('publiSelecionada');

    publiSelecionada.innerHTML = '';

    dadosPublicacoes.forEach((publi) => {
      if (publi.id === dados) {
        // Exibindo a publicação selecionada
        const publiSele = document.createElement('div');
        publiSele.classList.add(
          'd-flex',
          'flex-column',
          'border',
          'border-primary',
          'border-5',
          'justify-content-center'
        );
        publiSele.innerHTML = ` 
          <!-- Superior -->
          <div class="border border-secondary m-2 border-4">
            <!-- Imagem -->
            <div class="border border-succes m-2 border-3">
              <!-- Carousel - Fotos -->
              <img src="${
                publi.lote.fotoProduto
              }" alt="" style="width: 100%; height: 250px;" > 
            </div>
          </div>
          <!-- Meio -->
          <div class="border border-secondary m-2 border-4">
            <!-- Descrição do pedido -->
            <div class="border border-succes m-2 border-3">
              <h2>${publi.lote.titulo}</h2>
              <p>
                ${publi.lote.sobre}
              </p>
            </div>
          </div>
          <!-- Inferior -->
          <div class="border border-secondary m-2 border-4">
            <div class="border border-succes m-2 border-3">
              <!-- Seleção de itens -->
              <div id="produtos" class="border border-danger m-2 border-2">
                <!-- Iterando sobre os produtos -->
                ${publi.lote.produto
                  .map(
                    (produto) => `
                <div class="d-flex flex-row border-dark m-2 border-1">
                  <div class="border border-dark m-2 border-1">
                    <p>${produto.nomeAlimento} (un) <span style="font-weight: bold;">R$ ${produto.preco} | ${produto.quantidade} disponíveis</span></p>
                  </div>
                  <div class="d-flex align-items-center border border-dark m-2 border-1">
                    <div class="d-flex flex-row border border-dark m-2 border-1">
                      <button><i class=""></i></button>
                      <span>1</span>
                      <button><i class=""></i></button>
                    </div>
                  </div> 
                </div>`
                  )
                  .join('')}   
              </div>            
              <!-- Botão de Adicionar ao Carrinho -->
              <div class="d-flex justify-content-end border border-danger m-2 border-2">
                <button>Adicionar R$ ${calcularTotal(
                  publi.lote.produto
                )}</button>
              </div>
            </div>
          </div>
        `;
        publiSelecionada.appendChild(publiSele);
        carregarProdutos(publi.id);
      } else {
        console.log('Publicação não encontrada');
      }
    });
  } catch (erro) {
    console.error('Erro ao carregar a publicação:', erro);
  }
}

// Função para calcular o valor total com base nos produtos
function calcularTotal(produtos) {
  let total = 0;
  produtos.forEach((produto) => {
    total += parseFloat(produto.preco) * 1; // Se estiver escolhendo 1 unidade de cada produto
  });
  return total.toFixed(2);
}

// Chama a função ao carregar a página
window.onload = carregarDados;

//Registra o serviceWorker da aplicação para cache de recursos offline
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}

//Verifica se o app pode ser instalado e mostra o botão
var pedidoInstalacao;
// window.addEventListener('beforeinstallprompt', function (installPrompt) {
//   if (installPrompt) {
//     $('#installAppBt').show();
//     pedidoInstalacao = installPrompt;
//   }
// });

//Inicia a instalação do app
function installApp() {
  pedidoInstalacao.prompt();
}
