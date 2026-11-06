# Prompt — Homepage copy, vocabulary and language publishing

Date: 2026-11-06 · Author: Miguel Silva (with Claude) · Repo: cernoflow-website · Branch: main

## Context

The homepage (`index.html`) is being repositioned around a new tagline, aligned with the CernoFlow platform vocabulary, and cleaned up for pt-PT. ES and FR stay in the code but are hidden until a native reviewer signs them off.

Decisions already taken (do not reopen):

- Tagline: **No code. No shortcuts. Governed work.** / pt-PT: **Sem código. Sem atalhos. Trabalho com regras.**
- Subhead: people, AI agents and machines working the same cases, under the same rules.
- Category name: "the governed work platform".
- Published languages: EN and PT. ES and FR remain translated in the markup but are not offered in the switcher.
- Vocabulary: "wait condition", never "gateway". A wait condition is a hook on a stage, never a stage.
- No "by construction", no "FTSE 250", no table names (`ai_action_capture`) in copy.
- pt-PT, not pt-BR. No "você"; address the reader through the verb. Anglicisms replaced where a normal Portuguese term exists.

## Scope

In scope: `index.html`, `assets/js/i18n.js`, and two new docs files.

Out of scope (do not touch): `platform.html` and `cases/mobility.html` (bundled React; separate prompt), per-language URLs and hreflang (separate decision), new audience segments, the competitor price figures, the Customers nav item, and the untracked `assets/css/` folder. Do not stage or commit `assets/css/`.

## Mandatory read steps (before any edit)

1. `git status -sb` and `git log --oneline -5`. Confirm you are on `main` with a clean tree apart from the untracked `assets/css/`. If anything else is dirty, stop and report.
2. Read `assets/js/i18n.js` in full.
3. Read `index.html` lines 1–60 (head), 240–360 (hero CSS) and 1260–2077 (body). Match elements by their current `data-en` text, never by line number.
4. Read `../cernoflow/docs/project-reference.md` vocabulary section if it exists. If any term below contradicts it, stop and report rather than guess.

## Number guards (run before editing; stop if any count differs)

Run each as `grep -o -- '<pattern>' index.html | wc -l`:

| Pattern | Expected before | Expected after |
|---|---|---|
| `data-en=”` | 1 | 0 |
| `data-pt=”` | 1 | 0 |
| `data-es=”` | 1 | 0 |
| `class="pillar"` | 4 | 0 |
| `ateway` | 14 | 0 |
| `y construction` | 6 | 0 |
| `or construção` | 4 | 0 |
| `FTSE` | 6 | 0 |
| `ai_action_capture` | 1 | 0 |
| `fr-FR` | 5 | 0 |
| `Governed%20Process%20Enquiry` | 3 | 0 |
| `encanamento` | 1 | 0 |
| `precificad` | 1 | 0 |
| `provedor` | 1 | 0 |
| `Tela de` | 1 | 0 |
| `você` / `Você` | 1 / 1 | 0 / 0 |
| `vos pedirá` | 1 | 0 |
| `se vira` | 1 | 0 |
| `Agente de Caso` | 4 | 0 |
| `tamper proof` | 2 | 0 |
| `lang-option` | 9 | 9 |

Also before: `grep -o 'class="[^"]*\bi18n\b' index.html | wc -l` → record the number N. After: N − 4 (pillars) − 1 (AI paragraph collapses from two i18n spans to one) + 1 (new subhead) = N − 4.

## Edit rules

- Surgical edits only. Each Edit must match exactly once; widen the match if not unique.
- For every changed element, update `data-en`, `data-pt`, `data-es`, `data-fr` **and** the inner text (which must equal the new `data-en`). Where `data-fr` is missing, add it.
- EN and PT texts below are final; use them verbatim. Write ES and FR yourself (es-ES, fr-FR, same register), and log each one in `docs/translation-review.md` (see Step 7).
- Use straight double quotes as attribute delimiters. Inside attribute values use curly quotes “ ” or « » only, never straight `"`. Escape `&` as `&amp;` and `<` as `&lt;` as the file already does.
- Show `git diff --stat` and the diff of each commit before committing.

## Step 1 — Fix the broken auditability paragraph

The paragraph whose `data-en` begins `Rollback never deletes.` uses curly quotes (`”`) as attribute delimiters, which breaks the language switch. Replace the delimiters on `data-en`, `data-pt` and `data-es` with straight quotes, add `data-fr`, and set:

- EN: `Rollback never deletes. It records a compensating transaction that undoes the original action while preserving the original record. The checksum chain holds. When a regulator asks “who decided this, and why?”, the platform answers without you having to assemble it from logs.`
- PT: `Reverter nunca apaga. Regista uma transação compensatória que desfaz a ação original e preserva o registo original. A cadeia de checksums mantém-se íntegra. Quando um regulador pergunta «quem decidiu isto e porquê?», a plataforma responde sem que tenha de o reconstruir a partir de logs.`

Same section, element beginning `Every action a user or AI Agent takes`: change only `tamper proof` → `tamper-proof` in EN (and the inner text).

Commit: `fix(i18n): repair quote delimiters in auditability paragraph`

## Step 2 — Publish EN and PT only

In `assets/js/i18n.js`:

- Keep `SUPPORTED = ['en', 'pt', 'es', 'fr']`.
- Add `var PUBLISHED = ['en', 'pt']; // add a language only after native review — see docs/translation-review.md`.
- `getLang()` returns the stored value only if it is in `PUBLISHED`; otherwise `DEFAULT`.
- `setLang()` ignores languages not in `PUBLISHED`.
- On `DOMContentLoaded`, before wiring listeners, remove from the DOM every `.lang-option` whose `data-lang` is not in `PUBLISHED`, and its parent `<li>`.
- Update the header comment to describe SUPPORTED vs PUBLISHED.

Do not remove the `<li>` elements from `index.html`; the script hides them, so republishing a language is a one-line change.

Commit: `feat(i18n): publish EN and PT only; keep ES and FR unpublished`

## Step 3 — Hero

3a. `<title>`: `CernoFlow — No code. No shortcuts. Governed work.`

3b. Add after `<title>`: `<meta name="description" content="CernoFlow is the governed work platform: people, AI agents and machines working the same cases, under the same rules. No code, no shortcuts." />`

3c. H1 (`data-en="Govern every transactional process your business runs."`):
- EN: `No code. No shortcuts. Governed work.`
- PT: `Sem código. Sem atalhos. Trabalho com regras.`

3d. New element immediately after the closing `</div>` of `.hero-layout`, before the `.lead-italic` paragraph:
`<p class="hero-subhead i18n" data-en="…" data-pt="…" data-es="…" data-fr="…">…</p>`
- EN: `People, AI agents and machines working the same cases, under the same rules.`
- PT: `Pessoas, agentes de IA e máquinas a trabalhar os mesmos processos, com as mesmas regras.`

Add one CSS rule to the inline `<style>` next to `.section-hero .lead-italic`: `.section-hero .hero-subhead { … }` sized between `.h-display` and `.lead-italic`, max-width 780px, margin 24px 0 16px. Reuse existing font and colour tokens only; no new colours.

3e. Lead paragraph (`data-en` begins `Approvals, onboarding, applications`):
- EN: `Approvals, applications, onboarding, exceptions — the operational work that has a beginning, a middle and an end, and that someone will one day ask you to prove. CernoFlow runs it, governs it and keeps the audit trail as it goes.`
- PT: `Aprovações, candidaturas, admissões, exceções — o trabalho operacional com princípio, meio e fim, que alguém, um dia, lhe vai pedir que prove. O CernoFlow executa-o, governa-o e mantém o trilho de auditoria à medida que avança.`

3f. Delete the whole `<div class="pillars">…</div>` (four pillars) and the now-unused `.pillars` CSS rules.

3g. Replace all three `Governed%20Process%20Enquiry` mailto subjects with `Governed%20Work%20Enquiry`.

Commit: `content: new hero tagline, subhead and lead; remove pillars`

## Step 4 — Vocabulary aligned with the platform model

4a. Platform paragraph (`data-en` begins `CernoFlow is built around a single entity model.`):
- EN: `CernoFlow is built around a single entity model. Define it once and the platform derives the forms, lists and dashboards, the audit trail, the records-management view and the mobile app. No second screen to configure. No drift between what's recorded and what's shown.`
- PT: `O CernoFlow assenta num único modelo de entidades. Defina-o uma vez e a plataforma deriva os formulários, as listas e os painéis, o trilho de auditoria, a vista de gestão de arquivo e a aplicação móvel. Sem segundos ecrãs para configurar. Sem desvios entre o que fica registado e o que é apresentado.`

4b. Concerns paragraph (`data-en` begins `Five entity-level concerns`):
- EN: `Five entity-level concerns (structure, lifecycle, views, starting points, records) and five delivery concerns (Actors, surfaces, workflows, AI Agents, connectors), wrapped in a compliance band — GDPR, eIDAS, MoReq, ISO 15489. AI participates at every layer, governed and audited.`
- PT: `Cinco eixos ao nível da entidade (estrutura, ciclo de vida, vistas, pontos de partida, arquivo) e cinco eixos de entrega (Atores, superfícies, fluxos de trabalho, Agentes de IA, conectores), envolvidos por uma banda de conformidade — RGPD, eIDAS, MoReq, ISO 15489. A IA participa em todas as camadas, governada e auditada.`

4c. Diagram labels. Keep element positions; change text only, in this order.
Entity group (currently Structure, Lifecycle, Records, Workflows, Views):
1. `Structure` / `Estrutura`
2. `Lifecycle` / `Ciclo de vida`
3. `Views` / `Vistas`
4. `Starting Points` / `Pontos de partida`
5. `Records` / `Arquivo`
Second group (currently Starting Points, Forms, Surfaces, AI Agents, Connectors):
1. `Actors` / `Atores`
2. `Surfaces` / `Superfícies`
3. `Workflows` / `Fluxos de trabalho`
4. `AI Agents` / `Agentes de IA`
5. `Connectors` / `Conectores`

4d. Lifecycle paragraph (`data-en` begins `Every entity has a lifecycle.`):
- EN: `Every entity has a lifecycle. Every transition is a contract — preconditions, Actors bound to roles, dual control where you need it, wait conditions that hold until they are met, events fired to downstream systems on success. Configure transitions in the model, not in code.`
- PT: `Cada entidade tem um ciclo de vida. Cada transição é um contrato — pré-condições, Atores associados a perfis, controlo dual onde for preciso, condições de espera que retêm até estarem cumpridas, eventos enviados a sistemas a jusante em caso de sucesso. As transições configuram-se no modelo, não em código.`

4e. Paragraph beginning `Whether it's an approval`: EN unchanged. PT:
`Seja uma aprovação, uma admissão, uma escalada de processo ou uma mudança de estado num equipamento — aplica-se o mesmo rigor de governação, e a plataforma regista quem decidiu o quê, quando e porquê. Reverter gera transações compensatórias. Nada é apagado em silêncio.`

4f. Canvas eyebrow `Lifecycle canvas · Approval entity`: EN unchanged; PT `Editor de ciclo de vida · entidade Aprovação`.

4g. Canvas stage `Gateway` → EN `In review`, PT `Em análise`.

4h. Audit trail line `stage: gateway → approved` → EN `stage: in review → approved`, PT `estado: em análise → aprovado`.

4i. `Case Agent` (audit trail) → EN unchanged, PT `Agente de Processo`.

4j. Build trace:
- Eyebrow `Studio Co-designer · build trace`: PT `Co-designer do Studio · registo de construção`.
- Quote `“Build me a supplier onboarding flow…”`: EN unchanged; PT `“Cria-me um fluxo de qualificação de fornecedores com KYC e controlo dual acima de 50 000 €.”`
- `Entity created · Supplier Onboarding (12 fields)`: PT `Entidade criada · Qualificação de Fornecedor (12 campos)`.
- `Lifecycle · 6 stages, 2 gateways, 5 transitions` → EN `Lifecycle · 6 stages, 2 wait conditions, 5 transitions`, PT `Ciclo de vida · 6 estados, 2 condições de espera, 5 transições`.
- `Translating to pt-PT, fr-FR, en-GB…` → EN `Translating to pt-PT, en-GB…`, PT `A traduzir para pt-PT, en-GB…`.

4k. AI Agents lead paragraph. It is currently a `<p class="lead-italic">` containing two `.i18n` spans around an `ai_action_capture` code element. Replace the paragraph's contents with a single span `<span class="i18n" …>…</span>`:
- EN: `AI Agents take part in your work — they are not a bolt-on assistant pane. They design entities with the implementer, assist case workers, guide external users, monitor SLAs and recommend decisions. Every action they take is captured in the audit trail, with its inputs and reasoning.`
- PT: `Os Agentes de IA participam no seu trabalho — não são um painel de assistente acrescentado. Desenham entidades com o implementador, apoiam técnicos de processo, orientam utilizadores externos, monitorizam SLAs e recomendam decisões. Cada ação que executam fica no trilho de auditoria, com os dados de entrada e o raciocínio.`

4l. Agent mode cards, PT only:
- Attended body: `O Co-designer do Studio a desenhar entidades com o implementador. O Agente de Processo a ajudar um técnico a comparar processos anteriores. Vê e aprova cada passo.`
- Delegated body: `«Faz a triagem deste lote segundo a política.» «Redige a resposta e coloca-a em fila para revisão.» Define o âmbito, o Agente atua dentro dele e a plataforma regista cada ação.`
- Autonomous title `Acts on schedule or trigger.`: PT `Atua por agendamento ou evento.`
- Autonomous body: `Um monitor de SLA que escala quando um processo estagna. Um agente de reconciliação que corre todas as noites. Ativação por Ator e por transição — as duas opções têm de estar ativas para um Agente atuar sem supervisão.`

Commit: `content: align homepage vocabulary with the platform model`

## Step 5 — Plain-language rewrites

5a. Section eyebrow `Configure once, inherit everywhere` → EN `Define once`, PT `Definir uma vez`.

5b. Field types paragraph (`data-en` begins `Field types in CernoFlow aren't scalars`):
- EN: `Every field type in CernoFlow is a complete contract. It knows how to appear on a form and in a list, how it is stored, how it is classified under GDPR, how it is sealed into the record and how it is captured on a phone. You define it once.`
- PT: `Cada tipo de campo no CernoFlow é um contrato completo. Sabe como aparece num formulário e numa lista, como é guardado, como é classificado no RGPD, como é selado no documento de arquivo e como é captado no telemóvel. Define-o uma vez.`

5c. Paragraph beginning `Add a field to an entity`:
- EN: `Add a field to an entity and it appears everywhere the entity does — forms, lists, audit views, sealed records, mobile, integrations. The Studio Co-designer can add it for you, and the change itself is recorded as a governed event.`
- PT: `Adicione um campo a uma entidade e ele aparece em todo o lado onde a entidade aparece — formulários, listas, vistas de auditoria, documentos de arquivo selados, telemóvel, integrações. O Co-designer do Studio pode adicioná-lo por si, e a própria alteração fica registada como evento governado.`

5d. Paragraph beginning `Because everything derives from the entity model`:
- EN: `Because everything derives from the entity model, there is no separate form layer, no audit configuration and no PDF template to maintain, and no separate mobile app to build. The Studio Co-designer turns a Business Analyst's description into a working model in minutes. You refine it; the platform deploys it.`
- PT: `Como tudo deriva do modelo de entidades, não há uma camada de formulários à parte, nem configuração de auditoria, nem modelos de PDF para manter, nem uma aplicação móvel para desenvolver. O Co-designer do Studio transforma a descrição de um Analista de Negócio num modelo funcional em minutos. Refina-o; a plataforma coloca-o em produção.`

5e. Paragraph beginning `A Sage or M365 implementer can stand up`:
- EN: `A Sage or M365 implementer can stand up a governed client solution in days — not the months a Pega or Appian engagement would take. The platform handles the plumbing; you keep the domain conversation with the client.`
- PT: `Um implementador Sage ou M365 pode pôr a funcionar uma solução governada para um cliente em dias — não nos meses que um projeto Pega ou Appian exigiria. A plataforma trata da parte técnica; a conversa de negócio com o cliente continua a ser sua.`

5f. Why CernoFlow:
- H2 PT: `Governação de nível empresarial, a preço de PME.` (EN unchanged)
- Paragraph beginning `The case management platforms`:
  - EN: `The case management platforms with the governance your client needs are priced for large enterprises, not for the regional manufacturer with 80 employees or the service provider with twenty. The no-code app builders that fit the budget can't defend a process to an auditor. CernoFlow is what fits.`
  - PT: `As plataformas de gestão de casos com o nível de governação de que o seu cliente precisa têm preços pensados para grandes empresas, não para o fabricante regional com 80 colaboradores ou o prestador de serviços com vinte. Os construtores no-code que cabem no orçamento não conseguem defender um processo perante um auditor. O CernoFlow é a resposta certa.`
- Column header `Enterprise case platforms`: PT `Plataformas empresariais de gestão de casos`.
- `Days, governance built in`: EN unchanged; PT `Dias, governação incluída de raiz`.
- `By construction — ISO 15489, eIDAS, MoReq` → EN `Built in — ISO 15489, eIDAS, MoReq`, PT `De raiz — ISO 15489, eIDAS, MoReq`.
- `Yes — calls Sage and M365, doesn't replace them`: PT `Sim — integra com Sage e M365, não os substitui`.

5g. Closing statement (three spans: `CernoFlow is ` / emphasised / tail):
- Emphasised: EN `the governed work platform`; PT `a plataforma de governação do trabalho`.
- Tail: EN ` — priced and timed for the businesses that need governance but can't afford the platforms built for large enterprises.`; PT ` — com preço e prazos para as organizações que precisam de governação mas não podem pagar as plataformas feitas para grandes empresas.`
- Keep the leading space on the tail and the trailing space on `CernoFlow is ` / `O CernoFlow é `.

Commit: `content: plain-language rewrite of field, deploy and pricing copy`

## Step 6 — pt-PT review fixes and the untranslated block

PT only unless stated; EN unchanged.

- Use-case card `Cross-border employee relocation` body: `Aprovação em várias etapas, assinaturas qualificadas eIDAS, registos multilingues, instruções automáticas de processamento salarial para um prestador externo francês.`
- `Employee onboarding & offboarding`: title `Admissão e saída de colaboradores`; body `Recolha de documentos, atribuição de equipamentos, pedidos de acesso, lista de verificação de saída — auditável de ponta a ponta entre RH, Informática e Financeiro.`
- `Supplier onboarding & KYC`: title `Qualificação de fornecedores e KYC`; body `Receção de candidaturas, recolha de documentos, verificação de sanções, aprovação com controlo dual, atualização dos dados mestre no ERP.`
- `Contract lifecycle management` body: `Redação, negociação, assinatura (eIDAS), alertas de renovação, documentos de arquivo selados sob MoReq — com histórico de versões preservado.`
- `Payroll adjustments & corrections` body: `Alterações a meio do ciclo, ajustes retroativos, aprovações governadas, instruções assinadas para o prestador de processamento salarial.`
- Paragraph beginning `CernoFlow is a platform you deliver on`: `O CernoFlow é uma plataforma sobre a qual entrega soluções — não um SaaS em que o cliente se inscreve e aprende sozinho. Trabalhamos com quem conhece o negócio dos seus clientes melhor do que nós alguma vez conheceremos.`
- Paragraph beginning `You deliver client solutions where the operational process`: `Entrega soluções a clientes em que o processo operacional importa tanto como o lançamento contabilístico. O CernoFlow gere o ciclo de vida do processo; o ERP da sua escolha trata da contabilidade. Não substituímos a sua competência de implementação — damos-lhe uma plataforma em que tudo o que acontece entre o pedido e a resolução é configurável, auditável e posto em produção em dias.`
- Professional services block — currently English in every language:
  - H3 EN unchanged; PT `Empresas de serviços profissionais e operadores.`
  - Body EN: replace `a governed process layer` with `a governed work layer`; otherwise unchanged.
  - Body PT: `Gere processos de conformidade, admissão de clientes ou gestão de casos em escala — para uma carteira alargada de clientes ou numa função interna regulada. O volume é real, a exposição à auditoria é real, e a resposta atual é uma mistura de Excel, email e introdução manual num sistema que nunca foi pensado para receber pedidos. O CernoFlow dá-lhe uma camada de trabalho governado: os clientes submetem através de um portal, os pedidos avançam num ciclo de vida configurável, os registos aceites chegam automaticamente ao seu sistema e cada ação fica no trilho de auditoria. Sem desenvolvimento à medida a cada alteração regulamentar.`
  - ES and FR: translate both H3 and body (they are currently English).

Commit: `content(pt): pt-PT review fixes; translate professional services block`

## Step 7 — Glossary and translation review log

7a. Create `docs/glossary.md`: a table with columns `EN | pt-PT | es-ES | fr-FR | Notes`. ES and FR cells contain `—` (to be filled by the native reviewer). Rows:

| EN | pt-PT | Notes |
|---|---|---|
| Actor | Ator | Never "Stakeholder" |
| wait condition | condição de espera | Never "gateway"; a hook on a stage, not a stage |
| lifecycle | ciclo de vida | |
| stage | estado | |
| transition | transição | |
| entity | entidade | BA term; avoid in hero copy |
| case | processo | pt-PT municipal sense of "processo" |
| case worker | técnico | |
| Record (declared) | documento de arquivo | MoReq sense |
| records management | gestão de arquivo | |
| audit trail | trilho de auditoria | |
| compensating transaction | transação compensatória | |
| rollback | reversão | |
| dual control | controlo dual | |
| Starting Point | ponto de partida | |
| surface | superfície | |
| AI Agent | Agente de IA | |
| Co-designer | Co-designer | Product name, not translated |
| My tasks | As minhas tarefas | Never "inbox" |
| Queue | Fila | |
| Claim / Release | Assumir / Libertar | Queue work |
| Assign / Reassign | Atribuir / Reatribuir | Never "allocate" |
| Owner (Responsibility) | Responsável | |
| external user | utilizador externo | |
| onboarding (HR) | admissão | |
| supplier onboarding | qualificação de fornecedores | |
| governed work (tagline) | trabalho com regras | |
| governed work platform (category) | plataforma de governação do trabalho | |

Add a one-line header: "Seed for product locale files in the cernoflow repo; keep both in step."

7b. Create `docs/translation-review.md`:
- Status line per language: `EN — published`, `pt-PT — published (reviewed by Miguel Silva)`, `es-ES — unpublished, awaiting native review`, `fr-FR — unpublished, awaiting native review`.
- How to publish a language: native reviewer signs off this log, then add the code to `PUBLISHED` in `assets/js/i18n.js`.
- A table of every ES and FR string you wrote in this prompt: `Element (data-en, first 60 chars) | es-ES | fr-FR`.

Commit: `docs: add terminology glossary and translation review log`

## Verification (before the last commit is pushed)

1. Re-run every number guard; all "after" values must match.
2. Run this check and paste its output:

```bash
python3 - <<'PY'
import re
s = open('index.html', encoding='utf-8').read()
tags = re.findall(r'<[a-zA-Z][^>]*\bi18n\b[^>]*>', s)
bad = []
for t in tags:
    for lang in ('en', 'pt', 'es', 'fr'):
        if not re.search(r'data-%s="[^"]*"' % lang, t):
            bad.append((lang, t[:120]))
print('i18n elements:', len(tags))
print('missing or malformed attributes:', len(bad))
for b in bad[:20]:
    print(b)
PY
```

Expected: zero missing or malformed attributes, except elements that had no `data-es`/`data-fr` before this prompt and were not changed by it. List those separately rather than fixing them.

3. Start `python3 -m http.server 8080` in the repo root and confirm in a browser that EN and PT render the hero, the auditability paragraph and the professional services block correctly, and that the switcher shows only EN and PT. Report any rendering problem rather than fixing layout beyond Step 3d.

## Commit plan

1. `fix(i18n): repair quote delimiters in auditability paragraph`
2. `feat(i18n): publish EN and PT only; keep ES and FR unpublished`
3. `content: new hero tagline, subhead and lead; remove pillars`
4. `content: align homepage vocabulary with the platform model`
5. `content: plain-language rewrite of field, deploy and pricing copy`
6. `content(pt): pt-PT review fixes; translate professional services block`
7. `docs: add terminology glossary and translation review log`

Also commit this prompt file with the first commit. Do not push until Miguel has reviewed the PT rendering. Report at the end: guard table, the verification output, and any element you could not match.
