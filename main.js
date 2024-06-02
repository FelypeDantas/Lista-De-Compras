let listaDeCompras = [];
let itemAEditar;

const form = document.getElementById("form-itens");
const itensInput = document.getElementById("receber-item");
const ulItens = document.getElementById("lista-de-itens");
const ulItensComprados = document.getElementById("itens-comprados");
const listaRecuperada = localStorage.getItem('listaDeCompras')

function atualizaLocalStorage(){
    localStorage.setItem('listaDeCompras', JSON.stringify(listaDeCompras))
}

if(listaRecuperada){
    listaDeCompras = JSON.parse(listaRecuperada);
    mostrarItem();
} else {
    listaDeCompras = [];
}

form.addEventListener("submit" , function(evento) {
    evento.preventDefault();
    salvarItem();
    mostrarItem();
    itensInput.focus();
});

function salvarItem(){
    const comprasItem = itensInput.value;

    
    const checarDuplicado = listaDeCompras.some((elemento) => elemento.valor.toUpperCase() === comprasItem.toUpperCase());

    if(checarDuplicado){
        alert("Item já existe");
    } else {

        listaDeCompras.push({
            valor: comprasItem,
            checar: false
        })

        itensInput.value = '';
    }
}

function mostrarItem(){
    ulItens.innerHTML = ``;
    ulItensComprados.innerHTML = ``;
    listaDeCompras.forEach((elemento, index) => {
        if(elemento.checar){
            ulItensComprados.innerHTML += `
                <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                    <div>
                        <input type="checkbox" checked class="is-clickable" />  
                        <span class="itens-comprados is-size-5">${elemento.valor}</span>
                    </div>
                    <div>
                        <i class="fa-solid fa-trash is-clickable deletar"></i>
                    </div>
                </li>
            `
        } else {
                    ulItens.innerHTML += `
                <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                    <div>
                        <input type="checkbox" class="is-clickable" />
                        <input type="text" class="is-size-5" value="${elemento.valor}" ${index !== Number(itemAEditar) ? "disabled " : ""}></input>
                    </div>
                    <div>
                    ${index === Number(itemAEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>':
                    '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
                        <i class="fa-solid fa-trash is-clickable deletar"></i>
                    </div>
                </li>`
         }
    })

    const inputsCheck = document.querySelectorAll('input[type="checkbox"]');

    inputsCheck.forEach(i => {
        i.addEventListener('click', (evento) => {
           const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
           listaDeCompras[valorDoElemento].checar = evento.target.checked
           mostrarItem();
        })
    })

    const deletar = document.querySelectorAll('.deletar');

    deletar.forEach(i => {
        i.addEventListener('click', (evento) => {
           const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
           listaDeCompras.splice(valorDoElemento, 1);
           mostrarItem();
        })
    })

    const editarItens = document.querySelectorAll(".editar");

    editarItens.forEach(i => {
        i.addEventListener('click', (evento) => {
           itemAEditar= evento.target.parentElement.parentElement.getAttribute('data-value');
           mostrarItem();
        })
    });

    atualizaLocalStorage();
}

function salvarEdicao(){
    const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`)
    //console.log(itemEditado.value);
    listaDeCompras[itemAEditar].valor = itemEditado.value;
    itemAEditar = -1;
    mostrarItem();
}