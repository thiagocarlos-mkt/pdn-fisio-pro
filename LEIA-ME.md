# PDN FISIO PRO — Sistema de Diagnóstico e Mentoria

## O que já está pronto e no ar

- **Banco de dados (Supabase)** — projeto `pdn-fisio-pro`, já criado e ativo:
  - URL: `https://qluplzkpyxieclohsrih.supabase.co`
  - Tabelas: `profiles`, `convites_alunos`, `cadastros`, `diagnosticos`, `dados_mensais`
  - RLS configurado: aluno só vê seus próprios dados; gestor vê os dados dos alunos que ele criou
  - Edge Function `criar-aluno` publicada (cria login de aluno com segurança, só gestor pode chamar)
  - As chaves já estão embutidas em `src/lib/supabaseClient.js` (chave pública, segura para expor no front-end)

- **Frontend (React + Vite)** — nesta pasta, já buildado e testado (`npm run build` passou sem erros).

## Rodar localmente

```bash
npm install
npm run dev
```

## Publicar na Vercel

O projeto é um Vite/React padrão — a Vercel detecta tudo sozinha.

**Via Git (recomendado):**
1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel: **Add New → Project → Import** o repositório.
3. Framework detectado automaticamente como Vite:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Não precisa configurar variáveis de ambiente — as chaves do Supabase já estão no código (são públicas por natureza, protegidas pelo RLS no banco).
5. Deploy.

**Via CLI (sem passar pelo GitHub):**
```bash
npm i -g vercel
cd pdn-fisio-pro
vercel --prod
```

## Como usar o sistema

1. **Primeiro acesso**: crie sua conta de gestor na tela de login (aba "Sou gestor / mentor").
2. **Adicionar alunos**: no painel do gestor, cadastre manualmente (nome + e-mail) ou importe um CSV com duas colunas (nome, email) sem cabeçalho. O sistema cria o login do aluno automaticamente e mostra a senha temporária gerada — repasse para o aluno.
3. **Aluno faz login**, completa o cadastro inicial (Parte 1 do diagnóstico) e depois responde o diagnóstico de entrada (6 áreas, likert + perguntas abertas + percepção global).
4. **Relatório**: gerado automaticamente — roda da gestão (radar), maturidade por área, gargalo primário/secundário/percebido, pontos cegos.
5. **Dados mensais**: aluno registra faturamento, pacientes, tráfego etc. todo mês; o gestor acompanha o histórico e o gráfico de evolução.
6. **Reaplicação**: o diagnóstico pode ser respondido de novo nos momentos Entrada / 90 dias / 180 dias / Encerramento, para acompanhar evolução.
7. **Visão de grupo**: no painel do gestor, aba "Grupo" mostra a média de maturidade por área entre todos os alunos e um ranking geral.

## Próximos passos sugeridos

- Exportar relatório individual em PDF
- Gráfico de evolução do aluno entre os 4 momentos (linha por área)
- E-mail automático de boas-vindas com a senha temporária do aluno
