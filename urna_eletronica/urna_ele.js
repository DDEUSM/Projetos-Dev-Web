
let slc = (element)=> {return document.querySelector(element)};
let slcAll = (element)=>{return document.querySelectorAll(element)};
let div_digitos = '';
let digitos = '';
let voto;
let votos = [];
let etapa = 0;
let block = false;

slcAll('.teclado button').forEach((element) => {
    element.addEventListener('click', ()=> {
        if(digitos.length < candidatos[etapa].digitos){
            digitos += element.getAttribute('data-key');
            let digito = element.getAttribute('data-key');
            slc('.info-de-tecla').style.display = 'block';
            
            atualizaTela(digito);
        };
    });
});

function preparaTela(){
    div_digitos = '';
    for(let i=0; i<candidatos[etapa].digitos; i++){
        if(i==0){
            div_digitos += '<div class="pisca"></div>';
        }else {
            div_digitos += '<div></div>';
        }
    }
    slc('.voto-branco').style.display = 'none';
    slc('.voto-nulo').style.display = 'none';
    slc('.painel-info').style.display = 'flex';
    slc('.title').innerHTML = 'SEU VOTO PARA';
    slc('.cargo-eletivo').innerHTML = candidatos[etapa].título;
    slc('.nome-candidato').innerHTML = '';
    slc('.partido-candidato').innerHTML = '';
    slc('.candidato img').src = '';
    slc('.vice-candidato img').src = '';
    slc('.nome-vice').innerHTML = '';
    slcAll('.cargo-politico').forEach((element)=> element.innerHTML = '');
    slc('.numeros-digitados').innerHTML = div_digitos;
};

function atualizaTela(dg) {
    let div_digit = slcAll('.numeros-digitados div')[digitos.length - 1]
    div_digit.classList.remove('pisca');
    div_digit.innerHTML = dg;
    if(div_digit.nextElementSibling){
        div_digit.nextElementSibling.classList.add('pisca');
    }
    candidatos[etapa].todos.map((politico)=>{
        if(politico.numero == digitos){
            voto = politico;
            slc('.nome-candidato').innerHTML = `NOME: ${politico.nome}`;
            slc('.partido-candidato').innerHTML = `PARTIDO: ${politico.partido}`;
            slc('.candidato img').src = politico.img;
            let cargos = slcAll('.cargo-politico');
            if("vice" in politico) {
                cargos[0].innerHTML = candidatos[etapa].título;
                cargos[1].innerHTML = 'Vice-Presidente';
                slc('.vice-candidato img').src = politico.vice.img;
                slc('.nome-vice').innerHTML = `VICE-CANDIDATO: ${politico.vice.nome}`;
            } else {
                cargos[0].innerHTML = candidatos[etapa].título;
            };
            
        };
        if(digitos.length == candidatos[etapa].digitos){
            if(voto == null) {
                voto = 'voto nulo';
                slc('.voto-nulo').style.display = 'flex';
            };
        }
    });
};

slcAll('.buttons-de-finalizar div').forEach((element)=> {
    element.addEventListener('click', ()=> {
        if(votos.length < candidatos.length){
            if(element.getAttribute('class') == 'btn corrige'){
                digitos = '';
                voto = null;
                preparaTela()
            }

            if(element.getAttribute('class') == 'btn branco'){
                voto = 'Voto em Branco';
                slc('.painel-info').style.display = 'none';
                
                slc('.voto-branco').style.display = 'flex';                
            }
            if(digitos.length == candidatos[etapa].digitos || voto == 'Voto em Branco') {                
                if(element.getAttribute('class') == 'btn confirma'){
                    votos.push(voto);
                    voto = null;
                    digitos = '';
                    if(votos.length == 2){
                        block = true;
                    }                    
                    if(block == false) {
                        etapa ++;
                        preparaTela();                        
                    }else {
                        slc('.painel-info').style.display = 'none';
                        slc('.info-de-tecla').style.display = 'none';
                        slc('.fim').classList.add('pisca');
                        slc('.fim').style.display = 'flex';
                        
                    }
                }
            }
        }
    })
});
preparaTela();