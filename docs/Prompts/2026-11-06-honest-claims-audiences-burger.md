# Prompt — Remove unbuilt integration claims, rework pricing, audiences and use cases, burger menu icon

Date: 2026-11-06 · Author: Miguel Silva (with Claude) · Repo: cernoflow-website · Branch: main
Follows: the platform rebuild (pushed; `main` = `origin/main` at `688f9c4`).

## Why

- The site claims integrations that do not exist (Sage, Pastel, M365, ledger writeback). CernoFlow has no native integrations. Every such claim goes.
- The comparison table quotes unsourced competitor prices and offers nothing concrete for CernoFlow, under a nav item called "Pricing".
- "Who this is for" says "Implementers, not end users", which excludes municipalities — the primary market — and names Sage in a heading.
- Eight of nine use-case tiles say "Coming soon".
- The mobile menu button shows the word "Menu" on the right; it should be a burger icon left of the logo.

## Decisions (do not reopen)

- No integration claims. CernoFlow "runs alongside" an ERP and Microsoft 365; it never "calls", "posts to" or "writes back to" them.
- Vendor names (Sage, Pastel Evolution) may appear only as examples of what a client runs, never as integrations or in headings.
- No competitor prices. Nav "Pricing" becomes "Why CernoFlow". A pilot CTA is the concrete offer.
- Audiences: two organisation types (Municipalities first, then Professional services and compliance firms) and two partner types (ERP and accounting implementers, M365 and IT service providers).
- Use cases: one featured walkthrough (Mobility) plus six example tiles labelled by audience. Examples are not links and carry no "coming soon" state.
- No claims about map views or location; they are not built.

## Scope

In: `index.html`, `platform.html` (nav and the Connectors tip only), `docs/translation-review.md`.
Out: `cases/mobility.html`, `assets/css/` (do not stage).

## Mandatory read steps

1. `git status -sb`, `git log --oneline -3`. Expect `main` level with `origin/main` at `688f9c4`; only `assets/css/` and this prompt file untracked. Otherwise stop.
2. `index.html`: read the topbar (nav, `.nav-toggle` markup and CSS, light-theme overrides), section `#section-usecases` with its CSS (`.usecase`, `.usecase.active`, `.usecase.coming-soon`, `.uc-*`), section `#section-customers` with its CSS (`.audience-*`, `.ab`), section `#section-pricing` with its CSS (`.price-table`, `.pt-*`, `.diff-closer`), and the closing CTA section to see which CTA button class it uses.
3. `platform.html`: read the topbar and nav CSS, and `tips.connectors` in all four dictionaries.
4. `assets/js/nav.js` and `assets/js/i18n.js`: confirm how `.i18n` elements are translated (text content) so the burger's hidden label still switches language.

## Number guards

Before, record the counts. After, all must be 0 in `index.html` (EN, PT, ES and FR values included):

`calls Sage` · `Sage AP` · `writeback` · `land in your system` · `Coming soon` · `coming-soon` · `Indicative cost` · `€100k` · `€5–20k` · `section-pricing` · `Implementers, not end users` · `Sage and Pastel Evolution implementers` · `Live case study`

After, 0 in `platform.html`: `out of the box` · `section-pricing`

## Edit rules

- Every new or changed visible string gets `data-en`, `data-pt`, `data-es`, `data-fr`, and inner text equal to `data-en`. EN and PT below are final. Write ES (es-ES) and FR (fr-FR) yourself and log every one in `docs/translation-review.md` under "Claims, audiences and use cases (2026-11-06)".
- Straight double-quote delimiters; « » or “ ” inside values; escape `&` as `&amp;`.
- Surgical edits; each must match once.

## Step 1 — Burger icon (both pages)

1a. In `index.html` and `platform.html`, move the `.nav-toggle` button out of `.topbar-right` and make it the first child of `.topbar-left`, immediately before the logo link, so it sits left of the CernoFlow wordmark. Replace its content with:

```html
<button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false">
  <span class="nav-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span>
  <span class="sr-only i18n" data-en="Menu" data-pt="Menu" data-es="Menú" data-fr="Menu">Menu</span>
</button>
```

1b. CSS, both pages:
- `.sr-only` (add only if not already defined): standard visually-hidden pattern.
- `.nav-toggle`: square, same height as `.lang-toggle`, icon centred, no border or background at rest (icon only), a subtle background on hover and focus, visible focus ring; 12px gap to the logo. Hidden above 880px as now, and the logo position above 880px must not change.
- The nav panel still opens under the topbar, now aligned to the left edge with the 16px gutter.
- `.nav-toggle-icon`: 18×14px, three bars 2px tall, `currentColor`, rounded ends, evenly spaced.
- `.nav-toggle[aria-expanded="true"] .nav-toggle-icon`: top bar rotates +45°, bottom bar −45°, both meeting at the centre; middle bar fades out. 180ms ease.
- `@media (prefers-reduced-motion: reduce)`: no transition.

1c. Confirm `nav.js` already toggles `aria-expanded`; if not, make it.

Commit: `feat(nav): burger icon for the mobile menu`

## Step 2 — Remove unbuilt integration claims

2a. `index.html`, `#section-customers`, the professional services block: handled in Step 4 (the whole block is replaced).

2b. `index.html`, use-case tiles mentioning `Sage AP` and `writeback`: handled in Step 5 (tiles replaced).

2c. `index.html`, comparison table last row (label `Fits a Sage or M365 implementer`): replace the four cells:

| Cell | EN | PT |
|---|---|---|
| Row label | Works with what you already run | Funciona com o que já utiliza |
| Enterprise case platforms | Usually replaces it | Normalmente substitui-o |
| No-code app builders | keep EN; PT keep | keep |
| CernoFlow (keep `<strong>`) | Yes — runs alongside your ERP and Microsoft 365, not instead of them | Sim — funciona ao lado do seu ERP e do Microsoft 365, sem os substituir |

2d. `platform.html`, `tips.connectors.body`:
- EN: `Where the platform meets the rest of your systems. CernoFlow runs alongside your ERP and Microsoft 365 rather than replacing them; automation tools such as Power Automate and n8n carry data in and events out.`
- PT: `Onde a plataforma se liga aos restantes sistemas. O CernoFlow funciona ao lado do seu ERP e do Microsoft 365, sem os substituir; ferramentas de automatização como o Power Automate e o n8n trazem os dados e levam os eventos.`

Commit: `content: remove integration claims that are not built`

## Step 3 — Why CernoFlow (was Pricing)

3a. Rename the section id `section-pricing` → `section-why`, and update both nav links (`index.html` `href="#section-why"`, `platform.html` `href="./index.html#section-why"`). Nav label:
- EN `Why CernoFlow` · PT `Porquê o CernoFlow` · ES `Por qué CernoFlow` · FR `Pourquoi CernoFlow`.
Update the section comment (`Differentiation (price-led)` → `Differentiation`).

3b. Delete the whole `Indicative cost` row: its row label and its three cells (including the `price-figure` / `price-sub` spans). Remove `.price-figure` / `.price-sub` CSS if nothing else uses them. Check the grid still has 4 columns per row and the `row-bottom` class stays on the last row.

3c. Header cell `Built for SME implementers` (inside `.pt-cell.us`, keep `<strong>`):
- EN `Built for SMEs, municipalities and their partners` · PT `Pensado para PME, autarquias e os seus parceiros`.

3d. After the `.diff-closer` paragraph, add a pilot CTA using the same button class as the closing CTA section's primary button:
- Text EN `Talk to us about a pilot` · PT `Fale connosco sobre um projeto-piloto`, followed by the same arrow markup the closing CTA uses.
- `href="mailto:sales@cernoflow.com?subject=Pilot%20Enquiry"`.

Commit: `content: drop price figures, rename Pricing to Why CernoFlow, add pilot CTA`

## Step 4 — Who this is for

Replace the content of `#section-customers .audience-copy` (keep the kicker and keep `.editorial-graphic` untouched).

4a. H2:
- EN `For organisations that have to prove their work — and the partners who serve them.`
- PT `Para quem tem de comprovar o seu trabalho — e para os parceiros que o servem.`

4b. Lead (`.lead-italic`):
- EN `CernoFlow runs the processes that someone, one day, will ask you to justify. Whether you run it yourselves or through a partner, the governance is the same.`
- PT `O CernoFlow conduz os processos que alguém, um dia, lhe vai pedir que justifique. Quer o utilize diretamente, quer através de um parceiro, a governação é a mesma.`

4c. Inside `.audience-blocks`, two groups. Each group starts with a small label (`<p class="ab-group i18n">`, styled like `.kicker` but smaller, with 32px top margin on the second group), followed by two `.ab` blocks in the existing markup pattern (h3.h-eyebrow, p, link-secondary CTA).

Group label 1: EN `Organisations` · PT `Organizações`

Block 1 — CTA `Talk to us` / `Fale connosco`, `mailto:sales@cernoflow.com?subject=Municipal%20Enquiry`
- H3 EN `Municipalities.` · PT `Autarquias.`
- EN: `Licensing, works, citizen requests, complaints: hundreds of processes run against strict rules and records requirements. CernoFlow lets your own analysts model them without code, with the audit trail and records declaration built in, designed for MoReq and DGLAB requirements. Built on twenty years of municipal process automation.`
- PT: `Licenciamentos, obras, pedidos de munícipes, reclamações: centenas de processos tratados com regras rigorosas e exigências de gestão documental. Com o CernoFlow, os próprios técnicos modelam esses processos sem código, com o registo de auditoria e a declaração de documentos de arquivo incluídos de raiz, pensados para os requisitos do MoReq e da DGLAB. Construído a partir de vinte anos de automatização de processos municipais.`

Block 2 — CTA `Talk to us` / `Fale connosco`, `mailto:sales@cernoflow.com?subject=Governed%20Work%20Enquiry`
- H3 EN `Professional services and compliance firms.` · PT `Empresas de serviços profissionais e de conformidade.`
- EN: `Accounting firms, payroll bureaux, compliance consultancies: you run onboarding, compliance or case work at volume, across many clients or inside a regulated function. Today it's a mix of Excel, email and manual re-keying into a system that was never designed for intake. With CernoFlow, clients submit through a portal, each submission moves through a configurable lifecycle, and every action is in the audit trail. No custom development each time the regulations change.`
- PT: `Gabinetes de contabilidade, empresas de processamento salarial, consultoras de conformidade: tratam processos de integração de clientes, conformidade ou gestão de casos em grande volume, para muitos clientes ou numa função interna regulada. Hoje, isso é uma mistura de Excel, email e introdução manual de dados num sistema que nunca foi pensado para receber pedidos. Com o CernoFlow, os clientes submetem os pedidos num portal, cada pedido avança num ciclo de vida configurável e cada ação fica no registo de auditoria. Sem desenvolvimento à medida a cada alteração regulamentar.`

Group label 2: EN `Partners` · PT `Parceiros`

Block 3 — CTA `Talk to us about partnership` / keep its existing PT, `mailto:sales@cernoflow.com?subject=Partnership%20Enquiry%20%E2%80%94%20ERP`
- H3 EN `ERP and accounting implementers.` · PT `Implementadores de ERP e contabilidade.`
- EN: `You deliver client solutions where the operational process matters as much as the posting — whether your client runs Sage, Pastel Evolution or another ledger. CernoFlow runs the process from request to resolution; the ledger stays the system of record for the accounting. We don't replace your implementation skills — we give you a platform where that work is configurable, auditable and live in days.`
- PT: `Entrega soluções em que o processo operacional importa tanto como o lançamento contabilístico — quer o cliente utilize Sage, Pastel Evolution ou outro ERP. O CernoFlow conduz o processo do pedido à resolução; o ERP continua a ser o sistema de referência da contabilidade. Não substituímos a sua competência de implementação — damos-lhe uma plataforma em que esse trabalho é configurável, auditável e fica em produção em dias.`

Block 4 — CTA `Talk to us about partnership` / keep its existing PT, `mailto:sales@cernoflow.com?subject=Partnership%20Enquiry%20%E2%80%94%20M365`
- H3 EN `M365 and IT service providers.` · PT `Prestadores de serviços M365 e de TI.`
- EN: `You serve SME clients who can't justify enterprise platforms but still answer to regulators and auditors. CernoFlow lets you deliver governed processes — onboarding, case management, asset maintenance, contracts — without enterprise pricing or enterprise timelines.`
- PT: `Serve clientes PME que não justificam plataformas empresariais, mas que continuam a responder perante reguladores e auditores. O CernoFlow permite-lhe entregar processos com regras — integração de colaboradores, gestão de casos, manutenção de ativos, contratos — sem os preços nem os prazos das grandes plataformas.`

Check the section's layout still holds at desktop, at 980px and at 390px with four blocks and two group labels.

Commit: `content: who this is for — organisations and partners, municipalities first`

## Step 5 — Use cases

5a. Lead paragraph (`data-en` begins `People, things, money, documents`): change only its last sentence.
- EN: `People, things, money, documents — if it has a beginning, a middle, and an end, and someone might one day ask you to prove what happened, it belongs on CernoFlow. A few examples of what organisations and their partners can build.`
- PT: `Pessoas, bens, dinheiro, documentos — se tem princípio, meio e fim, e alguém lhe pode um dia pedir que prove o que aconteceu, tem lugar no CernoFlow. Alguns exemplos do que as organizações e os seus parceiros podem construir.`

5b. Featured walkthrough: keep the Mobility `<a class="usecase active">` tile and its link. Add class `featured`; it spans the full grid width at desktop (`grid-column: 1 / -1`) with a two-column inner layout (text left, the existing link right) above 980px, and stacks below. Change its tag `Live case study` to EN `Walkthrough` · PT `Demonstração`.

5c. Delete all eight `usecase coming-soon` tiles. Add six example tiles after the featured one, each:

```html
<div class="usecase example">
  <p class="uc-category i18n" …>…</p>
  <h4 class="i18n" …>…</h4>
  <p class="i18n" …>…</p>
</div>
```

No `href`, no `uc-tag`, no `uc-link`. CSS: `.usecase.example` at normal emphasis (not the dimmed coming-soon style), no hover lift, default cursor. Remove `.usecase.coming-soon` CSS. Grid: 3 columns above 980px, 2 between 640 and 980px, 1 below.

| # | Category EN / PT | Title EN / PT | Body EN / PT |
|---|---|---|---|
| 1 | Municipalities · Licensing / Autarquias · Licenciamento | Permits, licences &amp; applications / Licenciamentos, autorizações e candidaturas | Intake, assessment, exception handling, approval above set limits and signed decisions — defensible to the regulator. / Receção, avaliação, tratamento de exceções, aprovação acima de limites definidos e decisões assinadas — defensáveis perante o regulador. |
| 2 | Municipalities · Citizen service / Autarquias · Atendimento | Citizen requests &amp; complaints / Pedidos e reclamações de munícipes | Request intake, triage, hand-offs between departments, SLAs and recorded decisions, with the citizen kept informed through the portal. / Receção de pedidos, triagem, encaminhamento entre serviços, SLAs e registo das decisões, com o munícipe informado através do portal. |
| 3 | Compliance firms · Onboarding / Conformidade · Integração de clientes | Client onboarding &amp; KYC / Integração de clientes e KYC | Application intake, document collection, sanctions screening and dual-control approval, all on the audit trail. / Receção de candidaturas, recolha de documentos, verificação de sanções e aprovação com dupla validação, tudo no registo de auditoria. |
| 4 | Finance · Procurement / Finanças · Compras | Procurement exception approvals / Aprovação de exceções nas compras | Out-of-policy spend, approval above set limits with dual control, and an exception log the auditor can read. / Despesa fora da política, aprovação acima de limites definidos com dupla validação e um registo de exceções que o auditor consegue ler. |
| 5 | People · HR and IT / Pessoas · RH e TI | Employee onboarding &amp; offboarding / Integração e saída de colaboradores | Document collection, equipment provisioning, access requests, exit checklist — auditable end to end across HR, IT and Finance. / Recolha de documentos, atribuição de equipamentos, pedidos de acesso, lista de verificação de saída — auditável de ponta a ponta entre RH, TI e Financeiro. |
| 6 | Operations · Assets / Operações · Ativos | Asset &amp; property maintenance / Manutenção de ativos e imóveis | Inspections, service intervals, condition reports and repairs, with a full history for every asset. / Inspeções, intervalos de manutenção, relatórios de estado e reparações, com o histórico completo de cada ativo. |

Commit: `content: use cases as audience-labelled examples; feature the walkthrough`

## Verification

1. Number guards: every "after" count is 0.
2. Homepage i18n attribute check: 0 malformed. PT banned-term scan from `2026-11-06-pt-pt-pass.md`: all 0.
3. Serve locally (free port; not 8080). In EN and PT, check and report pass/fail:
   - 390×844, both pages: burger visible left of the logo; opens the nav, turns into an X, closes on tap, Escape, outside tap and link tap; language menu and nav never open together; light theme correct; reduced motion has no animation.
   - 1440×900 homepage: nav shows "Why CernoFlow" / "Porquê o CernoFlow" and scrolls to the section; table has no price row and four aligned columns; pilot CTA visible; Who this is for shows two labelled groups of two; use cases show the featured walkthrough full width and six tiles in a 3×2 grid, none clickable.
   - 980px and 390px homepage: Who this is for and use cases stack cleanly, no horizontal scroll.
   - Platform page: nav link goes to `index.html#section-why`; Connectors tip shows the new text.
4. Console: no errors on either page.
5. `git status -sb`: only `assets/css/` untracked.

## Commit plan

1. `feat(nav): burger icon for the mobile menu` (include this prompt file)
2. `content: remove integration claims that are not built`
3. `content: drop price figures, rename Pricing to Why CernoFlow, add pilot CTA`
4. `content: who this is for — organisations and partners, municipalities first`
5. `content: use cases as audience-labelled examples; feature the walkthrough`

Then `git push origin main` only if every verification line passed; otherwise stop and report. Report the guard table, the verification results, and every ES/FR string you wrote.
