# FUMEC Conecta

Protótipo navegável do MVP de colaboração acadêmica da Universidade FUMEC. O escopo é o da Atividade 03 do Projeto Integrador IV: grupos de estudo por disciplina, manifestação de interesse e indicação de materiais de autoria própria ou autorizados.

Não há login, banco de dados nem upload de arquivos. O que a pessoa publica fica no `localStorage` deste navegador.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Rotas

- `/` início, com busca de disciplina e próximos encontros
- `/disciplinas` e `/disciplinas/[slug]`
- `/grupos`, `/grupos/novo`, `/grupos/[id]`
- `/quero-estudar`, `/quero-estudar/novo`, `/quero-estudar/[id]`
- `/materiais`, `/materiais/indicar`, `/materiais/[id]`
- `/meu-espaco` o que foi feito neste navegador
- `/sobre` escopo, decisões e limites
- `/avaliar` roteiro para voluntários, sem pedir nome

A tecla `/` abre a busca de disciplinas.

## Onde está cada coisa

- `app/` rotas
- `components/` interface
- `lib/seed.ts` cenário fictício
- `lib/store.tsx` estado local do protótipo
- `lib/catalog.ts` junção do cenário com o que a pessoa criou

Disciplinas, nomes, grupos e materiais são fictícios.
