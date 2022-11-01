let modalqt;
let cart = [];
let modalKey;

let query = (e) => {return document.querySelector(e)};

let queryAll = (e) => {return document.querySelectorAll(e)};



pizzaJson.map((item, index) => {

    let body = query('.models .pizza-item').cloneNode(true);

    body.setAttribute('data-key', index);

    body.querySelector('.pizza-item--img img').src = item.img;

    body.querySelector('.pizza-item--img img').setAttribute('width', '360px')

    body.querySelector('.pizza-item--name').innerHTML = item.name;
    body.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    body.querySelector('.pizza-item--desc').innerHTML = item.description;
    

    body.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        modalqt = 1;
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        modalKey = key;

        query('.pizzaBig img').src = pizzaJson[key].img;
        query('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        query('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        query('.pizzaInfo--actualPrice').innerHTML = `R$${pizzaJson[key].price.toFixed(2)}`;
        
        query('.pizzaInfo--size.selected').classList.remove('selected');
        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeindex)=> {

            if(sizeindex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeindex];
        });

        query('.pizzaInfo--qt').innerHTML = modalqt

        query('.pizzaWindowArea').style.opacity = 0;
        query('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            query('.pizzaWindowArea').style.opacity = 1;    
        }, 20);
        
        console.log('Foi clicado!');
    });
       
    query('.pizza-area').append(body);
});


// Eventos do Modal
function closeModal() {
    query('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {    
        query('.pizzaWindowArea').style.display = 'none';   
    }, 500);  
    
}

queryAll('.pizzaInfo--cancelButton', '.pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

// botão de tamanho

queryAll('.pizzaInfo--size').forEach((size)=> {
    size.addEventListener('click', () => {
        query('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
})

// eventos dos botões de quantidade

query('.pizzaInfo--qtmais').addEventListener('click', (mais)=> {
    modalqt ++;
    query('.pizzaInfo--qt').innerHTML = modalqt;
});

query('.pizzaInfo--qtmenos').addEventListener('click', (mais)=> {
    if(modalqt > 1) {
        modalqt --;
    };
    query('.pizzaInfo--qt').innerHTML = modalqt;
});

// botão de adicionar a pizza
query('.pizzaInfo--addButton').addEventListener('click', ()=> {
    
    let size = parseInt(query('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identify = pizzaJson[modalKey].id + '@' + size;

    let keyindex = cart.findIndex((item)=> item.identify == identify);

    if(keyindex > -1) {
        cart[keyindex].qt += modalqt;
    } else {
        cart.push({
            identify,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalqt
    
        });
        console.log(size)
            
    }
    updateCart();
    closeModal();
})



query('.menu-openner').addEventListener('click', ()=> {
    if(cart.length > 0) {
        query('aside').style.left = '0vw';
    }
});

query('.menu-closer').addEventListener('click', ()=> {
    query('aside').style.left = '100vw';
})

function updateCart() {
    
    query('.cart').innerHTML = '';

    let pizzaPrice;
    let tot = 0;
    let off;
    let qtpizza = 0;

    if(cart.length > 0) {
        query('aside').classList.add('show');
        
        

        for(let i in cart) {
            
            let body = query('.cart--item').cloneNode(true);

            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            let pizzaSize;

            switch (cart[i].size) {
                case 0:
                    pizzaSize = 'P';
                    break;
                case 1:
                    pizzaSize = 'M';
                    break;
                case 2:
                    pizzaSize = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSize})`

            body.querySelector('.cart--item img').src = pizzaItem.img;
            body.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            body.querySelector('.cart--item-nome').innerHTML = pizzaName;

            body.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                cart[i].qt ++;
                updateCart();
            })

            body.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
                if(cart[i].qt > 1) {
                    cart[i].qt --;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            })

            pizzaPrice = pizzaItem.price * cart[i].qt;
            
            qtpizza += cart[i].qt;

            tot += pizzaPrice;
            

            

            query('.cart').append(body);
            
        } 

        query('.menu-openner span').innerHTML = qtpizza;

        off = 0.1 * tot;

        queryAll('.cart--totalitem.subtotal span')[1].innerHTML = `R$${(tot).toFixed(2)}`;

        queryAll('.cart--totalitem.desconto span')[1].innerHTML = `R$${(off).toFixed(2)}`;

        queryAll('.cart--totalitem.total.big span')[1].innerHTML = `R$${(tot - off).toFixed(2)}`;

    }else {
        query('aside').classList.remove('show');
        query('aside').style.left = '100vw';
    }
}