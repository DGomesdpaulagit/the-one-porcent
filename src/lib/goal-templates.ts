export type GoalStepDraft = {
  kind: "milestone" | "practice";
  title: string;
  description: string;
};

type Template = {
  keywords: string[];
  steps: GoalStepDraft[];
};

const CAPITAO_TEMPLATE: Template = {
  keywords: ["capitao", "capita", "lider", "braçadeira", "bracadeira"],
  steps: [
    {
      kind: "milestone",
      title: "Observe antes de agir",
      description:
        "Nas próximas semanas, preste atenção em como o capitão atual (ou os jogadores mais respeitados) se comportam nos momentos difíceis do jogo. Não precisa fazer nada ainda — só observar já é o primeiro passo.",
    },
    {
      kind: "milestone",
      title: "Comece pequeno, nos treinos",
      description:
        "Seja o primeiro a chegar perto de um companheiro que errou e dizer algo curto e direto. Não precisa ser grande coisa — uma frase de apoio já conta. Repita isso sempre que a oportunidade aparecer.",
    },
    {
      kind: "milestone",
      title: "Converse com o técnico",
      description:
        "Numa conversa natural, pergunte o que ele espera de um capitão no time. Isso mostra interesse genuíno sem parecer forçado ou apressado.",
    },
    {
      kind: "milestone",
      title: "Aumente a comunicação em campo",
      description:
        "Nos jogos, comece a se comunicar mais durante a partida — orientar posicionamento, avisar sobre marcação — mesmo sem ser capitão ainda. Isso é liderança de ação, não de cargo.",
    },
    {
      kind: "milestone",
      title: "Deixe a braçadeira vir",
      description:
        "Depois de algumas semanas fazendo isso naturalmente, você já vai ser visto como uma liderança informal. É nesse momento que a braçadeira costuma vir — como consequência, não como ponto de partida.",
    },
    {
      kind: "practice",
      title: "Quando o time sofrer um gol",
      description:
        "Seja um dos primeiros a levantar o grupo, não a criticar quem errou. O foco vai pro próximo lance, não pro que já passou.",
    },
    {
      kind: "practice",
      title: "Quando fizer (ou o time fizer) um gol",
      description:
        "Comemore de verdade, mas logo depois já puxe o foco de volta pro jogo. Um capitão não se perde na comemoração.",
    },
    {
      kind: "practice",
      title: "Nos dias de coletivo",
      description:
        "Escolha pelo menos um companheiro que parece estar mal e puxe uma conversa curta, incentivando. Não precisa ser todo dia com todo mundo — constância importa mais que quantidade.",
    },
    {
      kind: "practice",
      title: "Nos treinos sem coletivo",
      description:
        "A mesma ideia se aplica, adaptada: um elogio genuíno, uma palavra de apoio a quem está treinando pesado.",
    },
    {
      kind: "practice",
      title: "Depois de um erro seu",
      description:
        "Seja o primeiro a pedir a bola de novo. Isso mostra ao grupo que ninguém precisa se esconder depois de errar.",
    },
  ],
};

const COBRADOR_TEMPLATE: Template = {
  keywords: [
    "cobrador",
    "escanteio",
    "falta",
    "penalti",
    "pênalti",
    "bola parada",
  ],
  steps: [
    {
      kind: "milestone",
      title: "Peça um tempo separado de treino",
      description:
        "Converse com o técnico e peça 10-15 minutos, antes ou depois do treino normal, só pra treinar cobranças de falta e escanteio.",
    },
    {
      kind: "milestone",
      title: "Defina seu ritual de cobrança",
      description:
        "Use a técnica de respiração e visualização (vista na lição de bola parada do curso) e repita sempre o mesmo ritual antes de bater — mesmo no treino.",
    },
    {
      kind: "milestone",
      title: "Registre sua evolução por 2 semanas",
      description:
        "Anote quantas cobranças de 10 entram onde você mirou. Isso te dá dado real sobre sua evolução, não achismo.",
    },
    {
      kind: "milestone",
      title: "Peça uma chance",
      description:
        "Depois de treinar com consistência, peça pro técnico uma oportunidade em um coletivo ou amistoso.",
    },
    {
      kind: "milestone",
      title: "Assuma o posto",
      description:
        'Depois de mostrar consistência, peça diretamente: "posso ser o cobrador titular?". Você já fez o trabalho — agora é só pedir o reconhecimento.',
    },
    {
      kind: "practice",
      title: "Antes de cada cobrança",
      description: "Respiração box + visualização, sempre — em treino ou jogo.",
    },
    {
      kind: "practice",
      title: "Depois de errar uma cobrança",
      description:
        "Não se cobre demais. Revise o que aconteceu, ajuste, e siga pra próxima — errar faz parte de quem cobra.",
    },
    {
      kind: "practice",
      title: "Toda semana",
      description:
        "Repita o treino de cobranças, mesmo sem ninguém pedir. Consistência é o que separa quem cobra bem de quem cobra às vezes.",
    },
  ],
};

const GENERIC_TEMPLATE: Template = {
  keywords: [],
  steps: [
    {
      kind: "milestone",
      title: "Escreva por que essa meta importa",
      description:
        "Em poucas frases, registre por que essa meta importa pra você. Releia sempre que a vontade de continuar cair.",
    },
    {
      kind: "milestone",
      title: "Comece pequeno",
      description:
        "Escolha uma ação bem pequena, que você consegue fazer nesta semana, em direção a essa meta.",
    },
    {
      kind: "milestone",
      title: "Aumente o desafio aos poucos",
      description:
        "Depois de 2 semanas praticando essa ação pequena, aumente um pouco o nível de exigência.",
    },
    {
      kind: "milestone",
      title: "Diga em voz alta",
      description:
        "Converse com alguém de confiança (técnico, companheiro, familiar) sobre essa meta. Dizer em voz alta cria compromisso.",
    },
    {
      kind: "milestone",
      title: "Revise o progresso",
      description:
        "A cada poucas semanas, olhe pra trás e ajuste o plano se precisar. Metas reais mudam de forma no caminho.",
    },
    {
      kind: "practice",
      title: "Depois de cada treino ou jogo",
      description:
        "Uma frase rápida sobre o que você fez hoje que te aproximou dessa meta — mesmo que pequeno.",
    },
    {
      kind: "practice",
      title: "Nos dias difíceis",
      description: "Releia por que essa meta importa pra você (primeiro passo).",
    },
  ],
};

const TEMPLATES = [CAPITAO_TEMPLATE, COBRADOR_TEMPLATE];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function matchGoalTemplate(goalText: string): GoalStepDraft[] {
  const normalized = normalize(goalText);
  for (const template of TEMPLATES) {
    if (template.keywords.some((kw) => normalized.includes(normalize(kw)))) {
      return template.steps;
    }
  }
  return GENERIC_TEMPLATE.steps;
}
