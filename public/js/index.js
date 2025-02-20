const m = document.querySelector('.main');
const url = 'http://localhost:8000/livros/';

document.querySelector('.main button').addEventListener('click', (ev) => {
  desaparecer(m);
  setTimeout(() => {
    exibirForm();
  }, 1200);
});

function exibirForm() {
  const formContainer = document.getElementById('formContainer');
  aparecer(formContainer);
  // Exibindo o container; ajuste conforme sua implementação
  formContainer.style.display = 'block';

  const form = document.getElementById('bookForm');
  const inputs = form.querySelectorAll('input[type="text"]');
  const btnSave = document.getElementById('btnSave');

  // Função que verifica se todos os inputs estão preenchidos
  function checkInputs() {
    let allFilled = true;
    inputs.forEach(input => {
      if (input.value.trim() === '') {
        allFilled = false;
      }
    });
    btnSave.disabled = !allFilled;
  }

  // Adiciona o evento de input para cada campo
  inputs.forEach(input => {
    input.addEventListener('input', checkInputs);
  });

  // Ação para o botão "Fechar"
  const btnClose = document.getElementById('btnClose');
  btnClose.addEventListener('click', () => {
    form.reset();
    btnSave.disabled = true;
    formContainer.style.display = 'none';
    aparecer(m);
    desaparecer(formContainer);
  });
}

const stars = document.querySelectorAll('#starRating .star');
let currentRating = 0;

stars.forEach(star => {
  // Evento de mouseover: destaca as estrelas até a atual
  star.addEventListener('mouseover', function () {
    const hoverValue = parseInt(this.getAttribute('data-value'));
    stars.forEach(s => {
      if (parseInt(s.getAttribute('data-value')) <= hoverValue) {
        s.classList.add('hover');
      } else {
        s.classList.remove('hover');
      }
    });
  });

  // Evento de mouseout: remove o efeito de hover e restaura a nota selecionada
  star.addEventListener('mouseout', function () {
    stars.forEach(s => s.classList.remove('hover'));
    updateStars(currentRating);
  });

  // Clique para definir a nota
  star.addEventListener('click', function () {
    currentRating = parseInt(this.getAttribute('data-value'));
    updateStars(currentRating);
    console.log('Nota definida:', currentRating);
  });
});

// Atualiza as estrelas de acordo com a nota selecionada
function updateStars(rating) {
  stars.forEach(s => {
    if (parseInt(s.getAttribute('data-value')) <= rating) {
      s.classList.add('selected');
    } else {
      s.classList.remove('selected');
    }
  });
}

function desaparecer(elemento) {
  elemento.classList.remove('appear');
  elemento.classList.add('disappear');
}

function aparecer(elemento) {
  // Corrigido: remove a classe "disappear" e adiciona "appear"
  elemento.classList.remove('disappear');
  elemento.classList.add('appear');
}

document.addEventListener('DOMContentLoaded', () => {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Supondo que data.data.attributes seja um array de livros
      const livros = data.data.attributes;
      // Ordena os livros de forma decrescente pela nota
      livros.sort((a, b) => b.nota - a.nota);
      livros.forEach(livro => {
        renderLivros(livro);
      });
    })
    .catch(error => console.error('Erro ao buscar os itens:', error));
});

function renderLivros(livro) {
  // Cria o elemento container principal e define position relative para posicionar a lixeira
  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book');
  bookDiv.style.position = 'relative';

  // Cria o botão de delete (lixeira)
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.innerHTML = '🗑️';
  deleteBtn.addEventListener('click', async function (e) {
    e.stopPropagation(); // Evita conflitos com outros eventos
    try {
      const response = await fetch(`${url}${livro.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Erro ao deletar o livro');
      }
      bookDiv.remove();
      console.log(`Livro ${livro.id} deletado com sucesso.`);
    } catch (error) {
      console.error('Erro ao deletar o livro:', error);
    }
  });
  // Insere o botão de delete no container
  bookDiv.appendChild(deleteBtn);

  // Cria o elemento <img> para a capa do livro
  const img = document.createElement('img');
  img.src = livro.imagem;
  img.alt = ''; // Ajuste o alt se necessário
  img.classList.add('b-img');

  // Cria o container para o texto e as estrelas
  const booksTxt = document.createElement('div');
  booksTxt.classList.add('books-txt');

  // Cria o título do livro
  const titulo = document.createElement('h2');
  titulo.classList.add('b-title');
  titulo.textContent = livro.titulo;

  // Cria a descrição do livro
  const descricao = document.createElement('p');
  descricao.classList.add('b-desc');
  descricao.textContent = livro.descricao;

  // Cria o container de estrelas
  const starContainer = document.createElement('div');
  starContainer.classList.add('star-rating');

  // Cria 5 estrelas, independente da nota
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.classList.add('star');
    star.setAttribute('data-value', i);
    // Define o conteúdo da estrela
    star.textContent = "★";
    // Se a nota do livro for maior ou igual ao valor da estrela, marca como selecionada
    if (i <= livro.nota) {
      star.classList.add('selected');
    }

    // Adiciona eventos de hover para as estrelas do livro
    star.addEventListener('mouseover', function () {
      const stars = starContainer.querySelectorAll('.star');
      const hoverValue = parseInt(this.getAttribute('data-value'));
      stars.forEach(s => {
        if (parseInt(s.getAttribute('data-value')) <= hoverValue) {
          s.classList.add('hover');
        } else {
          s.classList.remove('hover');
        }
      });
    });
    star.addEventListener('mouseout', function () {
      const stars = starContainer.querySelectorAll('.star');
      stars.forEach(s => s.classList.remove('hover'));
      // Restaura as estrelas de acordo com a nota do livro
      stars.forEach(s => {
        if (parseInt(s.getAttribute('data-value')) <= livro.nota) {
          s.classList.add('selected');
        } else {
          s.classList.remove('selected');
        }
      });
    });

    // Clique para atualizar a nota e enviar o PUT para o backend
    star.addEventListener('click', function () {
      const novaNota = parseInt(this.getAttribute('data-value'));
      const stars = starContainer.querySelectorAll('.star');
      // Atualiza a interface: marca as estrelas até a nova nota
      stars.forEach(s => {
        if (parseInt(s.getAttribute('data-value')) <= novaNota) {
          s.classList.add('selected');
        } else {
          s.classList.remove('selected');
        }
      });
      console.log(`Nova nota para o livro "${livro.titulo}":`, novaNota);
      
      // Atualiza a nota localmente para que os eventos de mouseout usem o valor correto
      livro.nota = novaNota;
      
      // Requisição PUT para atualizar a nota no backend
      fetch(`${url}${livro.id}?nota=${novaNota}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nota: novaNota })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao atualizar a nota');
        }
        return response.json();
      })
      .then(data => {
        alert('Nota atualizada com sucesso', data);
        // Se necessário, você pode reordenar os livros no DOM aqui.
      })
      .catch(error => {
        console.error('Erro ao atualizar a nota:', error);
      });
    });

    starContainer.appendChild(star);
  }

  // Monta a estrutura: título, descrição e estrelas
  booksTxt.appendChild(titulo);
  booksTxt.appendChild(descricao);
  booksTxt.appendChild(starContainer);

  bookDiv.appendChild(img);
  bookDiv.appendChild(booksTxt);

  // Insere o livro renderizado no container com a classe "books"
  const booksContainer = document.querySelector('.books');
  if (booksContainer) {
    booksContainer.appendChild(bookDiv);
  } else {
    console.error("Elemento com classe 'books' não encontrado.");
  }
}

document.getElementById('btnSave').addEventListener('click', (ev) => {
  ev.preventDefault();
  const resposta = criarLivro(
    document.querySelector('#nome').value,
    document.querySelector('#descricao').value,
    document.querySelector('#link').value
  );

  if (resposta == false) {
    alert('Houve um erro ao tentar criar o livro!');
  } 
});
async function criarLivro(titulo, descricao, imagem) {
  // Cria o objeto sem a propriedade 'nota'
  const livro = {
    titulo: titulo,
    descricao: descricao,
    imagem: imagem
  };

  const response = await fetch(url + 'novo/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(livro)
  });

  if (response.ok) {
    const data = await response.json();
    alert(`O livro ${data.data.attributes.titulo} foi criado com sucesso!`);
    // Atualiza o objeto com o id retornado e define a nota inicial como 0
    livro.id = data.data.attributes.id;
    livro.nota = 0;
    renderLivros(livro);
    // Reinicia o formulário e esconde o container
    document.querySelector('#bookForm').reset();
    desaparecer(document.querySelector('#formContainer'));
    aparecer(m);
    // Após o alert, recarrega a página
    window.location.reload();
  }

  console.log(response.ok);
  return response.ok;
}
