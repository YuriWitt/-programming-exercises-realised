function contarParesLetras(texto) {
    const textoSemEspacos = texto.replace(/\s+/g, '');
    
    const textoNormalizado = textoSemEspacos
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    
    const contador = {};
    let totalPares = 0;
    
    for (let i = 0; i < textoNormalizado.length - 1; i++) {
        const par = textoNormalizado.substr(i, 2);
        if (par.match(/^[a-z]{2}$/)) {
            contador[par] = (contador[par] || 0) + 1;
            totalPares++;
        }
    }
    
    return { contador, totalPares };
}

function processarTexto() {
    const texto = document.getElementById('textoInput').value;
    
    const { contador, totalPares } = contarParesLetras(texto);
    
    if (totalPares === 0) {
        document.getElementById('resultado').innerHTML = "Nenhum par de letras encontrado no texto.";
        return;
    }
    
    const paresArray = Object.entries(contador);
    paresArray.sort((a, b) => b[1] - a[1]);

    const top100 = paresArray.slice(0, 100);
    

    const resultados = top100.map(([par, count]) => {
        const percentual = (count / totalPares) * 100;
        return { par, count, percentual };
    });
    
    const totalTop100 = top100.reduce((sum, [_, count]) => sum + count, 0);
    const percentualTotalTop100 = (totalTop100 / totalPares) * 100;

    let output = `<p><strong>Total de pares:</strong> ${totalPares}</p>`;
    output += `<p><strong>Top 100 pares mais frequentes:</strong></p>`;
    output += '<ul>';
    
    resultados.forEach(({ par, count, percentual }) => {
        output += `<li>${par} "${texto}" ${count} ${percentual.toFixed(2)}%</li>`;
    });
    
    output += '</ul>';
    output += `<p>Os 100 pares representam ${percentualTotalTop100.toFixed(2)}% do total de pares.</p>`;
    
    document.getElementById('resultado').innerHTML = output;
}