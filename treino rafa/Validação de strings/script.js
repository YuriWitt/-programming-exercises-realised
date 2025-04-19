function validarString(s) {
    if (/\d/.test(s)) {
        return false;
    }
    
    const pares = { ')': '(', ']': '[', '}': '{' };
    const pilha = [];
    
    for (const char of s) {
        if (char === '(' || char === '[' || char === '{') {
            pilha.push(char);
        } else if (char in pares) {
            if (pilha.length === 0 || pilha[pilha.length - 1] !== pares[char]) {
                return false;
            }
            pilha.pop();
        }
    }
    
    return pilha.length === 0;
}

console.log(validarString("[ (abc) ]"));         
console.log(validarString("[{)x}]"));           
