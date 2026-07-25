// Conteúdo do diagnóstico FISIO PRO / PDN — extraído de PDN_IA.md

export const ESCALA = [
  { valor: 1, label: 'Discordo totalmente' },
  { valor: 2, label: 'Mais discordo que concordo' },
  { valor: 4, label: 'Mais concordo que discordo' },
  { valor: 5, label: 'Concordo totalmente' },
  { valor: null, label: 'Não se aplica' },
]

export const MODELO_ATUACAO_OPCOES = [
  'Profissional autônomo',
  'Profissional dentro de outra clínica',
  'Consultório próprio',
  'Clínica com equipe',
  'Atendimento domiciliar',
  'Atendimento on-line',
  'Modelo híbrido',
  'Outro',
]

export const TIPO_EQUIPE_OPCOES = [
  'Sócio',
  'Secretária ou recepcionista',
  'Equipe clínica',
  'Equipe comercial',
  'Equipe administrativa',
  'Prestadores terceirizados',
  'Nenhuma equipe no momento',
]

export const FATURAMENTO_FAIXAS = [
  'Ainda não faturo',
  'Até R$ 5 mil',
  'De R$ 5 mil a R$ 10 mil',
  'De R$ 10 mil a R$ 20 mil',
  'De R$ 20 mil a R$ 40 mil',
  'De R$ 40 mil a R$ 70 mil',
  'De R$ 70 mil a R$ 100 mil',
  'Acima de R$ 100 mil',
]

export const MARGEM_FAIXAS = [
  'Não sei',
  'O negócio apresenta prejuízo',
  'Até 10%',
  'De 11% a 20%',
  'De 21% a 30%',
  'Acima de 30%',
]

export const CAPACIDADE_FAIXAS = [
  'Menos de 25%',
  'De 25% a 49%',
  'De 50% a 69%',
  'De 70% a 89%',
  'De 90% a 100%',
  'Estou atendendo acima da minha capacidade',
  'Não sei calcular',
]

export const FASE_NEGOCIO_OPCOES = [
  'Estruturação', 'Validação', 'Crescimento', 'Organização',
  'Expansão', 'Reposicionamento', 'Estagnação', 'Crise ou retração', 'Não sei identificar',
]

// Campos abertos do cadastro (PARTE 1)
export const CADASTRO_CAMPOS = [
  { id: 'nome_completo', label: 'Nome completo', tipo: 'texto' },
  { id: 'email', label: 'E-mail', tipo: 'texto' },
  { id: 'telefone', label: 'Telefone', tipo: 'texto' },
  { id: 'cidade_estado', label: 'Cidade e estado', tipo: 'texto' },
  { id: 'formacao_profissional', label: 'Formação profissional', tipo: 'texto' },
  { id: 'especialidade', label: 'Especialidade ou principal área de atuação', tipo: 'texto' },
  { id: 'nome_negocio', label: 'Nome do negócio, clínica ou consultório', tipo: 'texto' },
  { id: 'instagram_site', label: 'Instagram ou site profissional', tipo: 'texto' },
  { id: 'tempo_atuacao', label: 'Há quanto tempo você atua na área?', tipo: 'texto' },
  { id: 'tempo_negocio', label: 'Há quanto tempo possui o negócio atual?', tipo: 'texto' },
  { id: 'modelo_atuacao', label: 'Atualmente, você trabalha principalmente como', tipo: 'multi', opcoes: MODELO_ATUACAO_OPCOES },
  { id: 'servicos_oferecidos', label: 'Quais serviços você oferece atualmente?', tipo: 'textarea' },
  { id: 'publico_principal', label: 'Quem é o seu principal público?', tipo: 'textarea' },
  { id: 'num_pessoas_equipe', label: 'Quantas pessoas trabalham no negócio, incluindo você?', tipo: 'numero' },
  { id: 'tipo_equipe', label: 'Você possui', tipo: 'multi', opcoes: TIPO_EQUIPE_OPCOES },
  { id: 'pacientes_mes_atual', label: 'Quantos pacientes ou clientes você atende, em média, por mês?', tipo: 'texto' },
  { id: 'novos_pacientes_mes', label: 'Quantos novos pacientes entram, em média, por mês?', tipo: 'texto' },
  { id: 'valor_medio_paciente', label: 'Qual é o valor médio pago por paciente ou contrato?', tipo: 'texto' },
  { id: 'faturamento_faixa', label: 'Qual é o faturamento médio mensal do negócio?', tipo: 'select', opcoes: FATURAMENTO_FAIXAS },
  { id: 'margem_lucro_faixa', label: 'Qual é aproximadamente a sua margem de lucro mensal?', tipo: 'select', opcoes: MARGEM_FAIXAS },
  { id: 'capacidade_ocupada', label: 'Quanto da sua capacidade atual de atendimento está ocupada?', tipo: 'select', opcoes: CAPACIDADE_FAIXAS },
  { id: 'fase_negocio', label: 'Em qual fase você acredita que o seu negócio está?', tipo: 'select', opcoes: FASE_NEGOCIO_OPCOES },
  { id: 'resultado_desejado', label: 'Qual é o principal resultado que você deseja alcançar com o FISIO PRO?', tipo: 'textarea' },
  { id: 'preocupacao_atual', label: 'O que mais preocupa você atualmente em relação ao negócio?', tipo: 'textarea' },
]

// PARTES 2 a 7 — as 6 áreas de maturidade
export const AREAS = [
  {
    id: 'posicionamento',
    nome: 'Posicionamento',
    afirmacoes: [
      'Sei exatamente qual perfil de paciente ou cliente desejo atrair.',
      'Consigo explicar com clareza qual problema principal meu trabalho ajuda a resolver.',
      'Tenho clareza sobre os diferenciais do meu trabalho em relação a outros profissionais ou clínicas.',
      'Minha comunicação transmite de forma coerente quem eu sou, o que faço e para quem faço.',
      'Meus serviços possuem uma proposta clara, e não são percebidos apenas como sessões ou procedimentos isolados.',
      'As pessoas compreendem o valor do meu trabalho antes de perguntar o preço.',
      'Minha imagem profissional está alinhada ao nível de serviço que desejo oferecer.',
      'Consigo dizer, em uma frase, como quero ser reconhecido no mercado.',
    ],
    perguntasAbertas: [
      'Em uma frase, como você gostaria que seu negócio fosse reconhecido?',
      'O que acredita que diferencia seu trabalho dos seus principais concorrentes?',
      'Em qual aspecto do seu posicionamento você sente mais insegurança ou falta de clareza?',
    ],
    alertas: ['Não sabe quem deseja atender', 'Não consegue explicar o diferencial', 'Compete principalmente por preço'],
  },
  {
    id: 'captacao',
    nome: 'Captação',
    afirmacoes: [
      'Meu negócio recebe novos contatos de potenciais pacientes com frequência.',
      'Conheço os canais que mais geram pacientes para o meu negócio.',
      'Tenho mais de uma fonte ativa de captação de pacientes.',
      'Minha captação não depende exclusivamente de indicações espontâneas.',
      'Produzo conteúdos, parcerias ou ações que geram interesse de forma consistente.',
      'Tenho um processo para registrar os contatos que chegam ao negócio.',
      'Sei quantos novos contatos recebo por semana ou por mês.',
      'Sei quais ações de divulgação realmente geram agendamentos.',
    ],
    perguntasAbertas: [
      'De onde vêm atualmente a maioria dos seus pacientes?',
      'Quais ações de captação você já tentou e quais resultados obteve?',
      'O que mais dificulta a chegada de novos pacientes ao seu negócio?',
    ],
    alertas: ['Depende exclusivamente de indicação', 'Não registra a origem dos pacientes', 'Não possui nenhuma ação ativa de captação'],
  },
  {
    id: 'vendas',
    nome: 'Vendas',
    afirmacoes: [
      'Existe um processo definido desde o primeiro contato até a contratação do serviço.',
      'Os novos contatos recebem resposta com rapidez.',
      'Antes de apresentar um serviço, procuro compreender a necessidade do potencial paciente.',
      'Consigo apresentar meus serviços com clareza e segurança.',
      'Consigo conversar sobre preço sem desconforto excessivo.',
      'Faço acompanhamento dos contatos que demonstraram interesse, mas ainda não compraram.',
      'Conheço minha taxa de conversão de contatos em pacientes.',
      'Registro os principais motivos pelos quais uma pessoa decide não contratar.',
    ],
    perguntasAbertas: [
      'Descreva o que acontece desde o momento em que uma pessoa entra em contato até o fechamento ou agendamento.',
      'Qual é a objeção mais frequente apresentada pelos potenciais pacientes?',
      'Em qual etapa você acredita que perde mais oportunidades?',
    ],
    alertas: ['Não realiza acompanhamento', 'Não conhece a conversão', 'Não sabe por que as pessoas não contratam'],
  },
  {
    id: 'encantamento',
    nome: 'Encantamento do Cliente',
    afirmacoes: [
      'O paciente recebe orientações claras antes do primeiro atendimento.',
      'Existe um processo de acolhimento e integração para novos pacientes.',
      'As expectativas do paciente são alinhadas desde o início.',
      'A jornada do paciente é planejada, desde o primeiro contato até o encerramento do acompanhamento.',
      'Mantemos uma comunicação cuidadosa durante todo o tratamento ou serviço.',
      'Coletamos feedbacks dos pacientes de maneira estruturada.',
      'Temos estratégias para aumentar a continuidade e a adesão ao tratamento.',
      'A experiência oferecida faz com que os pacientes indiquem espontaneamente o nosso trabalho.',
    ],
    perguntasAbertas: [
      'O que você faz atualmente para que o paciente se sinta cuidado e valorizado?',
      'Em qual momento da jornada existe maior risco de desistência, abandono ou insatisfação?',
      'Qual experiência você gostaria que todo paciente tivesse ao passar pelo seu negócio?',
    ],
    alertas: ['Não alinha expectativas', 'Não acompanha abandono', 'Não coleta feedback', 'Não possui estratégia de continuidade'],
  },
  {
    id: 'financas',
    nome: 'Finanças',
    afirmacoes: [
      'As finanças pessoais e empresariais estão completamente separadas.',
      'Registro regularmente as receitas e despesas do negócio.',
      'Sei quanto o negócio precisa faturar para pagar todos os custos.',
      'Conheço a margem de lucro dos meus principais serviços.',
      'Os preços são definidos considerando custos, capacidade, mercado e valor entregue.',
      'Faço uma projeção de fluxo de caixa para os próximos meses.',
      'Tenho metas financeiras definidas e acompanho sua evolução.',
      'Consigo tomar decisões financeiras com base em números confiáveis.',
    ],
    perguntasAbertas: [
      'Quais indicadores financeiros você acompanha atualmente?',
      'Como você define o preço dos seus serviços?',
      'Qual decisão financeira você sabe que precisa tomar, mas ainda está adiando?',
    ],
    alertas: ['Mistura finanças pessoais e empresariais', 'Não conhece custos', 'Não sabe se possui lucro', 'Define preço apenas com base na concorrência'],
  },
  {
    id: 'equipe',
    nome: 'Eu & Equipe',
    afirmacoes: [
      'Tenho clareza sobre minhas prioridades como gestor do negócio.',
      'Consigo reservar tempo para atividades estratégicas, e não apenas para os atendimentos.',
      'Minha rotina permite executar as ações necessárias para o crescimento do negócio.',
      'As funções e responsabilidades de cada pessoa da equipe estão claramente definidas.',
      'Consigo delegar atividades sem precisar refazer ou supervisionar tudo.',
      'A equipe conhece os objetivos e prioridades do negócio.',
      'Existem processos que permitem que o negócio funcione sem depender de mim em todas as decisões.',
      'Acompanho o desempenho da equipe e ofereço feedbacks regularmente.',
    ],
    perguntasAbertas: [
      'Quais atividades ainda estão excessivamente centralizadas em você?',
      'O que mais consome seu tempo e sua energia atualmente?',
      'Qual mudança na sua rotina ou na equipe teria maior impacto no negócio?',
    ],
    alertas: ['Tudo depende do proprietário', 'Não há clareza de funções', 'Não existe tempo para gestão', 'O gestor está sobrecarregado ou próximo do limite'],
  },
]

// PARTE 8 — Percepção Global
export const PERCEPCAO_GLOBAL_CAMPOS = [
  { id: 'maior_gargalo', label: 'Qual das seis áreas você considera atualmente o maior gargalo do negócio?', tipo: 'select', opcoes: [...AREAS.map(a => a.nome), 'Não consigo identificar'] },
  { id: 'area_maior_impacto', label: 'Qual área acredita que, se melhorada agora, geraria maior impacto nos resultados?', tipo: 'texto' },
  { id: 'tres_prioridades', label: 'Quais são as três principais prioridades do seu negócio para os próximos seis meses?', tipo: 'textarea' },
  { id: 'problema_urgente', label: 'Qual problema precisa ser resolvido com mais urgência?', tipo: 'textarea' },
  { id: 'sabe_mas_nao_fez', label: 'O que você já sabe que precisa fazer, mas ainda não conseguiu colocar em prática?', tipo: 'textarea' },
  { id: 'o_que_impede', label: 'O que costuma impedir você de executar seus planos?', tipo: 'textarea' },
  { id: 'disposicao_mudar', label: 'Em uma escala de 0 a 10, quanto você está disposto a mudar sua rotina, seus processos ou suas decisões para alcançar seus objetivos?', tipo: 'escala10' },
  { id: 'resultado_valeu_pena', label: 'Ao final do FISIO PRO, quais resultados concretos fariam você considerar que o mentorado valeu a pena?', tipo: 'textarea' },
]

export const MOMENTOS = [
  { id: 'entrada', label: 'Entrada' },
  { id: '90_dias', label: 'Após 90 dias' },
  { id: '180_dias', label: 'Após 180 dias' },
  { id: 'encerramento', label: 'Encerramento' },
]

export function faixaMaturidade(media) {
  if (media == null || Number.isNaN(media)) return { label: 'Sem dados', cor: '#4b5563' }
  if (media < 2.0) return { label: 'Estado crítico', cor: '#ef4444', desc: 'A área apresenta falhas estruturais e pode estar comprometendo diretamente os resultados do negócio.' }
  if (media < 3.0) return { label: 'Estrutura frágil', cor: '#f97316', desc: 'Existem algumas iniciativas, mas ainda sem consistência, processo ou previsibilidade.' }
  if (media < 3.8) return { label: 'Em desenvolvimento', cor: '#eab308', desc: 'A área já possui elementos importantes, mas ainda existem lacunas que limitam seu desempenho.' }
  if (media < 4.5) return { label: 'Estruturada', cor: '#84cc16', desc: 'Os principais processos existem e funcionam, embora ainda haja espaço para melhoria e otimização.' }
  return { label: 'Maturidade avançada', cor: '#22c55e', desc: 'A área funciona de maneira consistente, mensurável e integrada ao restante do negócio.' }
}
