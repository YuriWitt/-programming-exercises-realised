class JogoDaVelha {
    constructor() {
        this.tabuleiro = Array(9).fill(null);
        this.jogadorAtual = 'X';
        this.jogoAcabado = false;
        this.vencedor = null;
        this.historico = { X: 0, O: 0, empate: 0 };
    }

    jogar(index) {
        if (this.jogoAcabado) {
            throw new Error('Jogo já terminado');
        }

        if (index < 0 || index > 8) {
            throw new Error('Posição inválida');
        }

        if (this.tabuleiro[index] !== null) {
            throw new Error('Posição já ocupada');
        }

        this.tabuleiro[index] = this.jogadorAtual;

        this.verificarVencedor();

        if (!this.jogoAcabado) {
            this.jogadorAtual = this.jogadorAtual === 'X' ? 'O' : 'X';
        }
    }

    verificarVencedor() {
        const combinacoesVitoria = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]             
        ];

        for (const combinacao of combinacoesVitoria) {
            const [a, b, c] = combinacao;
            if (this.tabuleiro[a] && 
                this.tabuleiro[a] === this.tabuleiro[b] && 
                this.tabuleiro[a] === this.tabuleiro[c]) {
                this.vencedor = this.tabuleiro[a];
                this.jogoAcabado = true;
                this.historico[this.vencedor]++;
                return;
            }
        }

        if (!this.tabuleiro.includes(null)) {
            this.jogoAcabado = true;
            this.vencedor = null;
            this.historico.empate++;
        }
    }

    obterVencedor() {
        return this.vencedor;
    }

    reiniciar() {
        this.tabuleiro = Array(9).fill(null);
        this.jogadorAtual = 'X';
        this.jogoAcabado = false;
        this.vencedor = null;
    }
}

const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset-btn');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const scoreDrawElement = document.getElementById('score-draw');

const jogo = new JogoDaVelha();

function updateUI() {
    cells.forEach((cell, index) => {
        const value = jogo.tabuleiro[index];
        cell.textContent = value || '';
        cell.className = value ? `cell ${value}` : 'cell';
    });

    if (jogo.jogoAcabado) {
        const vencedor = jogo.obterVencedor();
        statusElement.textContent = vencedor 
            ? `Vencedor: Jogador ${vencedor}!` 
            : 'Empate!';
    } else {
        statusElement.textContent = `Vez do jogador: ${jogo.jogadorAtual}`;
    }

    scoreXElement.textContent = jogo.historico.X;
    scoreOElement.textContent = jogo.historico.O;
    scoreDrawElement.textContent = jogo.historico.empate;
}

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (jogo.jogoAcabado) return;

        try {
            const index = parseInt(cell.getAttribute('data-index'));
            jogo.jogar(index);
            updateUI();
        } catch (error) {
            console.error(error.message);
        }
    });
});

resetButton.addEventListener('click', () => {
    jogo.reiniciar();
    updateUI();
});

updateUI();