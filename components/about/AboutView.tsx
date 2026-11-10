import Link from "next/link";
import { Container } from "@/components/ui/layout";

const flows = [
  {
    href: "/grupos",
    title: "Grupos de estudo",
    text: "Divulgar um encontro ligado a uma disciplina: objetivo, dia, horário, formato e vagas. Quem se interessa deixa o primeiro nome, sem publicar contato.",
  },
  {
    href: "/quero-estudar",
    title: "Interesse em estudar",
    text: "Dizer que você quer companhia antes de existir um grupo. A disponibilidade e o ponto em que você travou ficam visíveis; o restante, não.",
  },
  {
    href: "/materiais",
    title: "Materiais autorizados",
    text: "Indicar um material de autoria própria ou com autorização de quem escreveu. O protótipo guarda a indicação, não o arquivo.",
  },
];

const outside = [
  "Login institucional e integração com o sistema acadêmico",
  "Chat, fórum ou mensagens em tempo real",
  "Aplicativo de celular nativo",
  "Banco de dados em produção e cadastro de dados pessoais",
  "Upload de PDF, slide ou foto de página",
];

export function AboutView() {
  return (
    <Container>
      <p className="text-sm font-semibold text-blue-deep">Projeto Integrador IV · Sistemas de Informação</p>
      <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-balance">
        Um MVP para testar a colaboração, não uma plataforma inteira.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        O FUMEC Conecta parte da hipótese de que estudantes da Universidade FUMEC encontram dificuldade para achar
        colegas da mesma disciplina, combinar estudo e descobrir material que possa circular. Esta versão serve para
        mostrar os três fluxos e ouvir quem topar testar. A hipótese ainda precisa ser verificada com esse público.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">O que dá para fazer</h2>
        <ul className="mt-4 grid gap-3 lg:grid-cols-3">
          {flows.map((flow) => (
            <li key={flow.href}>
              <Link href={flow.href} className="card-link">
                <span className="text-lg font-semibold">{flow.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-ink-soft">{flow.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">O que ficou de fora de propósito</h2>
          <ul className="mt-4 space-y-2 text-ink-soft">
            {outside.map((item) => (
              <li key={item} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-line">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Decisões de uso</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
            <li className="rounded-2xl bg-white px-4 py-3 ring-1 ring-line">
              <span className="block font-semibold text-ink">A disciplina é o centro.</span>
              A busca abre uma disciplina. Lá estão grupos, pessoas e materiais, em vez de três produtos separados.
            </li>
            <li className="rounded-2xl bg-white px-4 py-3 ring-1 ring-line">
              <span className="block font-semibold text-ink">Poucos dados.</span>
              Primeiro nome e curso. Sem e-mail, telefone ou matrícula. O que você cria fica no navegador.
            </li>
            <li className="rounded-2xl bg-white px-4 py-3 ring-1 ring-line">
              <span className="block font-semibold text-ink">Direito autoral na interface.</span>
              A indicação só segue com a confirmação de autoria ou autorização. Não há download de arquivo.
            </li>
            <li className="rounded-2xl bg-white px-4 py-3 ring-1 ring-line">
              <span className="block font-semibold text-ink">Cenário fictício, marcado como tal.</span>
              A faixa do topo lembra que isto não é o sistema oficial da FUMEC.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-12 rounded-3xl bg-blue-ink px-6 py-6 text-white sm:px-8">
        <h2 className="text-2xl font-semibold">Como avaliar em poucos minutos</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
          Atalho de teclado: a tecla / abre a busca de disciplinas, fora dos campos de texto.
        </p>
        <ol className="mt-4 space-y-2 text-sm leading-relaxed">
          <li>1. Busque Banco de Dados.</li>
          <li>2. Abra um grupo e manifeste interesse.</li>
          <li>3. Publique que você quer estudar.</li>
          <li>4. Indique um material de autoria própria.</li>
          <li>5. Confira Meu espaço e registre o que travou.</li>
        </ol>
        <Link href="/avaliar" className="btn btn-secondary mt-5">
          Abrir o roteiro
        </Link>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">Limites desta entrega</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Não há sincronização entre computadores. Dois estudantes no mesmo navegador compartilham Meu espaço. Os
          encontros de demonstração usam datas de novembro de 2026; quando elas passam, a agenda mostra o dia recorrente
          em vez de uma data vencida. Nenhuma opinião de voluntário deve ser tratada como validação do produto enquanto
          não houver registro real da coleta.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Felipe Rodrigues dos Santos · Universidade FUMEC · Belo Horizonte · 2026. Referências de método consideradas no
          projeto: Chesbrough (2003), Brown (2008), Ries (2011) e ISO 9241-210:2019.
        </p>
      </section>
    </Container>
  );
}
