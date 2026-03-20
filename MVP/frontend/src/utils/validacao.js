const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'tooShort',
    'patternMismatch',
    'customError'
];

const mensagensDeErro = {
    nome: {
        valueMissing: 'O campo de nome não pode estar vazio.',
    },
    email: {
        valueMissing: 'O campo de email não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido. Ex: seu.email@dcx.ufpb.br'
    },
    curso: {
        valueMissing: 'Por favor, selecione um curso.',
    },
    matricula: {
        valueMissing: 'A matrícula não pode estar vazia.',
        patternMismatch: 'A matrícula deve conter apenas números.'
    },
    senha: {
        valueMissing: 'O campo de senha não pode estar vazio.',
        tooShort: 'A senha deve ter pelo menos 6 caracteres.'
    },
    confirmarSenha: {
        valueMissing: 'Você precisa confirmar sua senha.',
        customError: 'As senhas não coincidem.'
    }
};

export function obterMensagemErro(name, validityState) {
    let mensagem = '';

    tiposDeErro.forEach(erro => {
        if (validityState[erro]) {
            mensagem = mensagensDeErro[name]?.[erro] || 'Campo preenchido incorretamente.';
        }
    });

    return mensagem;
}