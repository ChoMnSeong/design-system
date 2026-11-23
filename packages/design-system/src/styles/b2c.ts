/** B2C 커머스 부품: 사이트 틀 · 배너 · 상품 표시 · 구매 입력 · 모바일. */
const FG = 'var(--ds-color-foreground-primary)'
const FG2 = 'var(--ds-color-foreground-secondary)'
const FG3 = 'var(--ds-color-foreground-tertiary)'
const BD = 'var(--ds-color-border-subtle)'
const BG = 'var(--ds-surface-card-background)'
const MUTED = 'var(--ds-color-background-muted)'
const ACC = 'var(--ds-palette-primary-500)'
export const B2C_CSS = `
/* 큰 제목 · 화면 폭 · 섹션 여백 */
[data-ds-display] { margin: 0; color: ${FG}; font-family: var(--ds-typography-font-family-display, inherit); text-wrap: balance; }
${['lg', 'md', 'sm'].map((s) => `[data-ds-display][data-size="${s}"] { font-size: clamp(32px, calc(var(--ds-typography-role-hero-${s}-font-size, 48px) * .55 + 2vw), var(--ds-typography-role-hero-${s}-font-size)); font-weight: var(--ds-typography-role-hero-${s}-font-weight); line-height: var(--ds-typography-role-hero-${s}-line-height); letter-spacing: var(--ds-typography-role-hero-${s}-letter-spacing); }`).join('\n')}
[data-ds-container] { width: 100%; margin-inline: auto; box-sizing: border-box; padding-inline: 16px; }
@media (min-width: 768px) { [data-ds-container] { padding-inline: 32px; } }
@media (min-width: 1280px) { [data-ds-container] { padding-inline: 40px; } }
[data-ds-container][data-size="sm"] { max-width: 768px; }
[data-ds-container][data-size="md"] { max-width: 1024px; }
[data-ds-container][data-size="lg"] { max-width: 1280px; }
[data-ds-container][data-padding="none"] { padding-inline: 0; }
[data-ds-section] { padding-block: 80px; }
[data-ds-section][data-spacing="sm"] { padding-block: 48px; }
[data-ds-section][data-spacing="lg"] { padding-block: 120px; }
[data-ds-section][data-spacing="none"] { padding-block: 0; }
@media (max-width: 767px) { [data-ds-section] { padding-block: 56px; } [data-ds-section][data-spacing="sm"] { padding-block: 32px; } [data-ds-section][data-spacing="lg"] { padding-block: 80px; } }
[data-ds-section][data-tone="muted"] { background: ${MUTED}; }
[data-ds-section][data-tone="inverse"] { background: ${FG}; color: ${BG}; }

/* 사이트 머리말 · 큰 메뉴 · 꼬리말 · 공지 띠 */
[data-ds-announce] { display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 36px; padding: 0 44px; position: relative; background: ${FG}; color: ${BG}; font-size: 13px; }
[data-ds-announce] a { color: inherit; }
[data-ds-announce] > button { all: unset; position: absolute; right: 0; top: 50%; translate: 0 -50%; width: 44px; height: 44px; display: grid; place-items: center; cursor: pointer; }
[data-ds-announce] > button::before { content: ''; grid-area: 1 / 1; width: 28px; height: 28px; border-radius: 999px; transition: background .15s; }
[data-ds-announce] > button > svg { grid-area: 1 / 1; }
[data-ds-announce] > button:hover::before { background: color-mix(in oklab, currentColor 15%, transparent); }
[data-ds-announce] > button:focus-visible::before { outline: 2px solid currentColor; }
[data-ds-site-header] { position: relative; z-index: 30; background: ${BG}; color: ${FG}; border-bottom: 1px solid ${BD}; transition: background .2s, color .2s, border-color .2s; }
[data-ds-site-header][data-sticky] { position: sticky; top: 0; }
[data-ds-site-header][data-transparent] { background: transparent; color: #fff; border-color: transparent; }
[data-ds-site-header][data-transparent][data-overlay] { position: absolute; inset-inline: 0; top: 0; }
[data-ds-site-header] [data-slot="row1"] { display: flex; align-items: center; gap: 24px; height: 68px; }
[data-ds-site-header] [data-slot="logo"] { font-weight: 800; font-size: 20px; letter-spacing: -.02em; flex: none; color: inherit; text-decoration: none; }
[data-ds-site-header] [data-slot="search"] { flex: 1; max-width: 480px; }
[data-ds-site-header] [data-slot="actions"] { margin-left: auto; display: flex; align-items: center; gap: 4px; }
[data-ds-site-header] [data-slot="action"] { all: unset; position: relative; min-width: 44px; height: 44px; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; cursor: pointer; border-radius: var(--ds-radius-md); font-size: 12px; color: inherit; }
[data-ds-site-header] [data-slot="action"]:hover { background: color-mix(in oklab, currentColor 8%, transparent); }
[data-ds-site-header] [data-slot="action"]:focus-visible { outline: 2px solid ${ACC}; }
[data-ds-site-header] [data-slot="action"] [data-slot="badge"] { position: absolute; top: 2px; right: 4px; min-width: 16px; height: 16px; padding: 0 4px; box-sizing: border-box; border-radius: 999px; background: var(--ds-palette-danger-600); color: #fff; font-size: 10px; font-weight: 700; display: grid; place-items: center; }
[data-ds-site-header] [data-slot="row2"] { height: 48px; overflow: hidden; transition: height .2s, opacity .2s; }
[data-ds-site-header][data-row-hidden] [data-slot="row2"] { height: 0; opacity: 0; }
[data-ds-site-header] [data-slot="nav"] { display: flex; align-items: center; gap: 4px; height: 48px; overflow-x: auto; scrollbar-width: none; }
[data-ds-site-header] [data-slot="nav"] > * { all: unset; flex: none; padding: 0 12px; height: 48px; display: inline-flex; align-items: center; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: inset 0 -2px transparent; }
[data-ds-site-header] [data-slot="nav"] > *:hover, [data-ds-site-header] [data-slot="nav"] > [aria-current], [data-ds-site-header] [data-slot="nav"] > [aria-expanded="true"] { box-shadow: inset 0 -2px currentColor; }
[data-ds-site-header] [data-slot="nav"] > [data-highlight] { color: var(--ds-tone-danger-text); }
[data-ds-site-header] [data-slot="mobile"] { all: unset; display: none; width: 44px; height: 44px; place-items: center; cursor: pointer; border-radius: var(--ds-radius-md); }
@media (max-width: 767px) {
    [data-ds-site-header] [data-slot="row1"] { height: 56px; gap: 4px; }
    [data-ds-site-header] [data-slot="search"], [data-ds-site-header] [data-slot="action"] > span:not([data-slot="badge"]) { display: none; }
    [data-ds-site-header] [data-slot="mobile"] { display: inline-grid; }
    [data-ds-site-header] [data-slot="logo"] { margin-inline: auto; }
    [data-ds-site-header] [data-slot="actions"] { margin-left: 0; }
    [data-ds-site-header] [data-slot="row2"], [data-ds-site-header] [data-slot="nav"], [data-ds-site-header] [data-slot="nav"] > * { height: 44px; }
}
[data-ds-mega] { position: absolute; inset-inline: 0; top: 100%; background: ${BG}; color: ${FG}; border-bottom: 1px solid ${BD}; box-shadow: 0 16px 32px -16px rgb(0 0 0 / .2); z-index: 40; }
[data-ds-mega] > div { display: grid; grid-template-columns: 180px 1fr auto; gap: 32px; padding-block: 24px; }
[data-ds-mega] [data-slot="cats"] { display: flex; flex-direction: column; border-right: 1px solid ${BD}; padding-right: 16px; }
[data-ds-mega] [data-slot="cats"] button { all: unset; padding: 8px 10px; border-radius: var(--ds-radius-sm, 6px); cursor: pointer; font-size: 14px; }
[data-ds-mega] [data-slot="cats"] button[aria-selected="true"], [data-ds-mega] [data-slot="cats"] button:hover { background: ${MUTED}; font-weight: 600; }
[data-ds-mega] [data-slot="cols"] { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 24px; align-content: start; }
[data-ds-mega] h6 { margin: 0 0 10px; font-size: 13px; font-weight: 700; }
[data-ds-mega] ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
[data-ds-mega] ul a { color: ${FG2}; text-decoration: none; font-size: 13px; display: inline-flex; gap: 6px; align-items: center; }
[data-ds-mega] ul a:hover { color: ${FG}; text-decoration: underline; }
[data-ds-mega] [data-slot="promo"] { width: 240px; }
[data-ds-site-footer] { background: ${MUTED}; color: ${FG2}; font-size: 13px; }
[data-ds-site-footer] [data-slot="benefits"] { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; padding-block: 24px; border-bottom: 1px solid ${BD}; }
[data-ds-site-footer] [data-slot="benefit"] { display: flex; gap: 12px; align-items: center; }
[data-ds-site-footer] [data-slot="benefit"] > span:first-child { width: 40px; height: 40px; border-radius: 999px; background: ${BG}; display: grid; place-items: center; color: ${FG}; flex: none; }
[data-ds-site-footer] [data-slot="benefit"] b { display: block; color: ${FG}; font-size: 14px; }
[data-ds-site-footer] [data-slot="main"] { display: grid; grid-template-columns: minmax(220px, 1.2fr) repeat(auto-fit, minmax(140px, 1fr)); gap: 32px; padding-block: 40px; }
[data-ds-site-footer] [data-slot="support"] strong { display: block; font-size: 24px; color: ${FG}; margin: 6px 0; letter-spacing: -.01em; }
[data-ds-site-footer] h6 { margin: 0 0 12px; font-size: 13px; color: ${FG}; }
[data-ds-site-footer] ul { list-style: none; margin: -7px 0; padding: 0; display: flex; flex-direction: column; }
[data-ds-site-footer] ul a { display: inline-flex; align-items: center; min-height: 30px; }
[data-ds-site-footer] a { color: inherit; text-decoration: none; }
[data-ds-site-footer] a:hover { color: ${FG}; text-decoration: underline; }
[data-ds-site-footer] [data-slot="legal"] { border-top: 1px solid ${BD}; padding-block: 20px; font-size: 12px; color: ${FG3}; }
[data-ds-site-footer] [data-slot="legal"] summary { cursor: pointer; color: ${FG2}; }
[data-ds-site-footer] [data-slot="legal"] dl { display: grid; grid-template-columns: max-content 1fr; gap: 4px 12px; margin: 10px 0 0; }
[data-ds-site-footer] [data-slot="legal"] dd { margin: 0; }

/* 큰 배너 · 슬라이드 · 가로 줄 */
[data-ds-hero] { position: relative; overflow: hidden; border-radius: var(--_r, 0); color: ${FG}; }
[data-ds-hero][data-layout="overlay"], [data-ds-hero][data-layout="center"] { min-height: var(--_h, 520px); display: flex; color: #fff; }
[data-ds-hero] [data-slot="media"] { position: absolute; inset: 0; }
[data-ds-hero] [data-slot="media"] > img, [data-ds-hero] [data-slot="media"] > video { width: 100%; height: 100%; object-fit: cover; display: block; }
[data-ds-hero] [data-slot="scrim"] { position: absolute; inset: 0; background: linear-gradient(to top, rgb(0 0 0 / var(--_scrim, .7)) 0%, rgb(0 0 0 / calc(var(--_scrim, .7) * .4)) 40%, transparent 70%); }
[data-ds-hero][data-layout="center"] [data-slot="scrim"] { background: rgb(0 0 0 / calc(var(--_scrim, .7) * .6)); }
[data-ds-hero] [data-slot="body"] { position: relative; align-self: flex-end; padding: clamp(24px, 5vw, 64px); max-width: 720px; display: flex; flex-direction: column; gap: 14px; }
[data-ds-hero][data-layout="center"] [data-slot="body"] { align-self: center; margin-inline: auto; text-align: center; align-items: center; }
[data-ds-hero] [data-slot="eyebrow"] { font-size: 13px; font-weight: 700; letter-spacing: .12em; opacity: .85; }
[data-ds-hero] [data-slot="desc"] { margin: 0; font-size: clamp(15px, 1.4vw, 18px); opacity: .9; }
[data-ds-hero] [data-slot="actions"] { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
[data-ds-hero][data-layout="split"] { display: grid; grid-template-columns: 1fr 1fr; min-height: var(--_h, 360px); background: ${MUTED}; }
[data-ds-hero][data-layout="split"] [data-slot="media"] { position: relative; }
[data-ds-hero][data-layout="split"] [data-slot="body"] { align-self: center; }
@media (max-width: 767px) { [data-ds-hero][data-layout="split"] { grid-template-columns: 1fr; } [data-ds-hero][data-layout="split"] [data-slot="media"] { aspect-ratio: 16/10; } }
[data-ds-carousel] { position: relative; }
[data-ds-carousel] [data-slot="viewport"] { overflow: hidden; border-radius: var(--_r, 0); }
[data-ds-carousel] [data-slot="track"] { display: flex; gap: var(--_gap, 0px); transition: transform .45s cubic-bezier(.2,.7,.2,1); }
[data-ds-carousel] [data-slot="slide"] { flex: none; width: calc((100% - var(--_gap, 0px) * (var(--_pv) - 1)) / var(--_pv)); }
[data-ds-carousel] [data-slot="arrow"] { all: unset; position: absolute; top: calc(50% - var(--_ind, 0px)); translate: 0 -50%; width: 44px; height: 44px; border-radius: 999px; background: ${BG}; color: ${FG}; display: grid; place-items: center; cursor: pointer; box-shadow: 0 2px 10px rgb(0 0 0 / .15); z-index: 2; }
[data-ds-carousel] [data-slot="arrow"][data-dir="prev"] { left: 12px; }
[data-ds-carousel] [data-slot="arrow"][data-dir="next"] { right: 12px; }
[data-ds-carousel] [data-slot="arrow"]:disabled { opacity: .35; cursor: default; }
[data-ds-carousel] [data-slot="arrow"]:focus-visible { outline: 2px solid ${ACC}; }
[data-ds-carousel] [data-slot="dots"] { position: relative; z-index: 3; display: flex; justify-content: center; margin-top: 4px; }
/* 보이는 점 8, 누르는 영역 24×32 */
[data-ds-carousel] [data-slot="dots"] button { all: unset; min-width: 24px; height: 32px; display: grid; place-items: center; cursor: pointer; }
[data-ds-carousel] [data-slot="dots"] button::before { content: ''; width: 8px; height: 8px; border-radius: 999px; background: color-mix(in oklab, ${FG} 25%, transparent); transition: width .2s; }
[data-ds-carousel] [data-slot="dots"] button[aria-current="true"]::before { width: 22px; background: ${FG}; }
[data-ds-carousel] [data-slot="dots"] button:focus-visible::before { outline: 2px solid ${ACC}; outline-offset: 2px; }
[data-ds-carousel] [data-slot="count"] { position: absolute; right: 12px; bottom: 12px; z-index: 2; height: 32px; padding: 0 12px 0 0; border-radius: 999px; background: rgb(0 0 0 / .55); color: #fff; font-size: 12px; font-variant-numeric: tabular-nums; display: inline-flex; gap: 2px; align-items: center; }
[data-ds-carousel] [data-slot="count"]:not(:has(button)) { padding-left: 12px; }
[data-ds-carousel] [data-slot="count"] button { all: unset; cursor: pointer; width: 32px; height: 32px; border-radius: 999px; display: grid; place-items: center; }
[data-ds-carousel] [data-slot="count"] button:focus-visible { outline: 2px solid #fff; outline-offset: -2px; }
[data-ds-carousel] [data-slot="thumbs"] { display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; }
[data-ds-carousel] [data-slot="thumbs"] button { all: unset; width: 64px; height: 64px; flex: none; border-radius: var(--ds-radius-sm, 6px); overflow: hidden; cursor: pointer; opacity: .55; outline: 2px solid transparent; outline-offset: -2px; }
[data-ds-carousel] [data-slot="thumbs"] button[aria-current="true"] { opacity: 1; outline-color: ${FG}; }
[data-ds-carousel] [data-slot="thumbs"] img { width: 100%; height: 100%; object-fit: cover; }
[data-ds-rail] { display: flex; flex-direction: column; gap: 14px; }
[data-ds-rail] [data-slot="head"] { display: flex; align-items: flex-end; gap: 12px; }
[data-ds-rail] [data-slot="head"] h3 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -.02em; color: ${FG}; }
[data-ds-rail] [data-slot="head"] p { margin: 2px 0 0; font-size: 13px; color: ${FG3}; }
[data-ds-rail] [data-slot="head"] [data-slot="action"] { margin-left: auto; display: flex; gap: 2px; align-items: center; }
[data-ds-rail] [data-slot="head"] [data-slot="action"] > :not([data-slot="nav"]) { min-height: 44px; display: inline-flex; align-items: center; }
/* 화살표: 보이는 원 32, 누르는 영역 44. 손으로 넘기는 작은 화면에서는 숨긴다 */
[data-ds-rail] [data-slot="nav"] { all: unset; width: 44px; height: 44px; display: grid; place-items: center; cursor: pointer; color: ${FG}; }
[data-ds-rail] [data-slot="nav"]::before { content: ''; grid-area: 1 / 1; width: 32px; height: 32px; border-radius: 999px; border: 1px solid ${BD}; box-sizing: border-box; transition: background .15s; }
[data-ds-rail] [data-slot="nav"] > svg { grid-area: 1 / 1; }
[data-ds-rail] [data-slot="nav"]:hover::before { background: ${MUTED}; }
[data-ds-rail] [data-slot="nav"]:focus-visible::before { outline: 2px solid ${ACC}; outline-offset: 1px; }
@media (max-width: 767px) { [data-ds-rail] [data-slot="nav"] { display: none; } }
[data-ds-rail] [data-slot="track"] { display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - var(--_gap) * (var(--_pv) - 1 + var(--_peek))) / (var(--_pv) + var(--_peek))); gap: var(--_gap); overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; overscroll-behavior-x: contain; }
[data-ds-rail] [data-slot="track"]::-webkit-scrollbar { display: none; }
[data-ds-rail] [data-slot="track"] > * { scroll-snap-align: var(--_snap, start); min-width: 0; }

/* 비율 고정 이미지 · 가격 · 별점 · 순위 · 이어보기 */
[data-ds-media] { position: relative; overflow: hidden; aspect-ratio: var(--_ratio, 1); border-radius: var(--_r, var(--ds-radius-md)); background: ${MUTED}; }
[data-ds-media] > img, [data-ds-media] > video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: var(--_fit, cover); transition: opacity .3s; }
[data-ds-media] > img[data-loading] { opacity: 0; }
[data-ds-media] [data-slot="ph"] { position: absolute; inset: 0; background-size: cover; background-position: center; filter: blur(14px); transform: scale(1.1); }
[data-ds-media][data-placeholder="color"] [data-slot="ph"] { filter: none; transform: none; }
[data-ds-media] [data-slot="overlay"] { position: absolute; inset: 0; pointer-events: none; }
[data-ds-media] [data-slot="caption"] { position: absolute; inset-inline: 0; bottom: 0; padding: 32px 14px 12px; color: #fff; font-size: 13px; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: linear-gradient(to top, rgb(0 0 0 / .55), transparent); }
[data-ds-media] [data-slot="overlay"] > * { pointer-events: auto; }
[data-ds-price] { display: inline-flex; flex-direction: column; gap: 2px; font-variant-numeric: tabular-nums; color: ${FG}; }
[data-ds-price] [data-slot="list"] { font-size: max(.8125em, 13px); font-weight: 400; color: ${FG3}; text-decoration: line-through; }
[data-ds-price][data-layout="inline"] { display: flex; width: 100%; container-type: inline-size; }
[data-ds-price][data-layout="inline"] [data-slot="row"] { flex-wrap: nowrap; white-space: nowrap; }
[data-ds-price][data-layout="inline"] [data-slot="list"] { margin-left: 2px; }
/* 좁은 카드에서는 정가를 빼고 할인율 · 판매가만 (줄바꿈으로 카드 높이가 흔들리지 않게) */
@container (max-width: 168px) { [data-ds-price][data-layout="inline"] [data-slot="list"] { display: none; } }
[data-ds-price] [data-slot="list"][data-placeholder] { visibility: hidden; }
[data-ds-price] [data-slot="row"] { display: inline-flex; align-items: baseline; gap: 6px; flex-wrap: wrap; }
[data-ds-price][data-layout="inline"] [data-slot="row"] { display: flex; }
[data-ds-price] [data-slot="rate"] { color: var(--ds-tone-danger-text); font-weight: 700; }
[data-ds-price] [data-slot="value"] { font-weight: 700; letter-spacing: -.01em; }
[data-ds-price] [data-slot="value"] small { font-size: max(.75em, 12px); font-weight: 600; margin-left: 1px; }
[data-ds-price] [data-slot="coupon"] { font-size: max(.8em, 12px); color: var(--ds-tone-accent-text); font-weight: 600; }
[data-ds-price] [data-slot="unit"] { font-size: max(.75em, 12px); color: ${FG3}; }
[data-ds-price][data-size="sm"] { font-size: 16px; } [data-ds-price][data-size="md"] { font-size: 18px; } [data-ds-price][data-size="lg"] { font-size: 26px; }
[data-ds-price][data-sold-out] [data-slot="value"] { color: ${FG3}; }
[data-ds-price] [data-slot="soldout"] { font-size: max(.75em, 12px); font-weight: 700; color: ${FG3}; padding: 1px 6px; border: 1px solid ${BD}; border-radius: 4px; }
[data-ds-rating-display] { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: ${FG2}; font-variant-numeric: tabular-nums; }
[data-ds-rating-display] [data-slot="stars"] { position: relative; display: inline-block; letter-spacing: 1px; color: color-mix(in oklab, ${FG} 18%, transparent); line-height: 1; }
[data-ds-rating-display] [data-slot="stars"] > span { position: absolute; inset: 0; overflow: hidden; color: var(--ds-palette-warning-500); white-space: nowrap; }
[data-ds-rating-display] b { color: ${FG}; }
[data-ds-rating-display][data-layout="summary"] { display: grid; grid-template-columns: auto 1fr; gap: 24px; align-items: center; }
[data-ds-rating-display] [data-slot="big"] { display: flex; flex-direction: column; align-items: center; gap: 4px; }
[data-ds-rating-display] [data-slot="big"] strong { font-size: 40px; font-weight: 800; color: ${FG}; letter-spacing: -.02em; line-height: 1; }
[data-ds-rating-display] [data-slot="dist"] { display: flex; flex-direction: column; gap: 4px; min-width: 180px; }
[data-ds-rating-display] [data-slot="dist"] > div { display: grid; grid-template-columns: 28px 1fr 36px; gap: 8px; align-items: center; font-size: 12px; }
[data-ds-rating-display] [data-slot="dist"] i { height: 6px; border-radius: 999px; background: ${MUTED}; overflow: hidden; }
[data-ds-rating-display] [data-slot="dist"] i > i { display: block; height: 100%; background: var(--ds-palette-warning-500); }
[data-ds-rank] { font-weight: 900; font-style: italic; font-size: var(--_s, 64px); line-height: .8; letter-spacing: -.06em; color: transparent; -webkit-text-stroke: 2px ${FG}; font-variant-numeric: tabular-nums; }
[data-ds-rank][data-appearance="solid"] { color: ${FG}; -webkit-text-stroke: 0; }
[data-ds-rank][data-appearance="badge"] { font-style: normal; font-size: 13px; -webkit-text-stroke: 0; color: #fff; background: ${FG}; min-width: 24px; height: 24px; display: inline-grid; place-items: center; border-radius: 6px; letter-spacing: 0; line-height: 1; }
[data-ds-watch] { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: ${FG3}; }
[data-ds-watch] [data-slot="bar"] { height: 3px; background: color-mix(in oklab, ${FG} 18%, transparent); border-radius: 999px; overflow: hidden; }
[data-ds-watch] [data-slot="bar"] > i { display: block; height: 100%; background: var(--ds-palette-danger-500); }
[data-ds-watch][data-overlay] { position: absolute; inset-inline: 0; bottom: 0; }
[data-ds-watch][data-overlay] [data-slot="bar"] { border-radius: 0; height: 4px; }

/* 수량 · 옵션 · 검색창 */
[data-ds-qty] { display: inline-flex; align-items: center; border: 1px solid ${BD}; border-radius: var(--ds-radius-md); background: ${BG}; height: 40px; }
[data-ds-qty][data-size="sm"] { height: 32px; }
[data-ds-qty] button { all: unset; width: 40px; height: 100%; display: grid; place-items: center; cursor: pointer; color: ${FG}; }
[data-ds-qty][data-size="sm"] button { width: 32px; }
[data-ds-qty] button:disabled { color: color-mix(in oklab, ${FG} 25%, transparent); cursor: not-allowed; }
[data-ds-qty] button:focus-visible { outline: 2px solid ${ACC}; outline-offset: -2px; border-radius: var(--ds-radius-md); }
[data-ds-qty] input { width: 40px; border: 0; text-align: center; font: inherit; font-weight: 600; font-variant-numeric: tabular-nums; background: transparent; color: ${FG}; -moz-appearance: textfield; }
[data-ds-qty] input::-webkit-inner-spin-button { display: none; }
[data-ds-option-picker] { display: block; border: 0; padding: 0; margin: 0; min-width: 0; }
[data-ds-option-picker] legend { padding: 0; font-size: 13px; color: ${FG2}; margin-bottom: 10px; }
[data-ds-option-picker] legend b { color: ${FG}; margin-left: 6px; }
[data-ds-option-picker] [data-slot="list"] { display: flex; flex-wrap: wrap; gap: 8px; }
[data-ds-option-picker] [data-slot="opt"] { all: unset; position: relative; box-sizing: border-box; cursor: pointer; font-size: 13px; color: ${FG}; }
[data-ds-option-picker][data-type="chip"] [data-slot="opt"] { min-width: 52px; height: 40px; padding: 0 12px; display: inline-grid; place-items: center; border: 1px solid ${BD}; border-radius: var(--ds-radius-md); background: ${BG}; }
[data-ds-option-picker][data-type="chip"] [data-slot="opt"][aria-checked="true"] { border-color: ${FG}; box-shadow: inset 0 0 0 1px ${FG}; font-weight: 700; }
[data-ds-option-picker][data-type="swatch"] [data-slot="opt"] { width: 36px; height: 36px; border-radius: 999px; padding: 3px; box-shadow: inset 0 0 0 1px ${BD}; }
[data-ds-option-picker][data-type="swatch"] [data-slot="opt"] > i { display: block; width: 100%; height: 100%; border-radius: inherit; box-shadow: inset 0 0 0 1px rgb(0 0 0 / .08); }
[data-ds-option-picker][data-type="swatch"] [data-slot="opt"][aria-checked="true"] { box-shadow: inset 0 0 0 2px ${FG}; }
[data-ds-option-picker] [data-slot="opt"]:focus-visible { outline: 2px solid ${ACC}; outline-offset: 2px; }
[data-ds-option-picker] [data-slot="opt"][aria-disabled="true"] { cursor: not-allowed; color: ${FG3}; background-image: linear-gradient(to top right, transparent calc(50% - .5px), color-mix(in oklab, ${FG} 35%, transparent) 50%, transparent calc(50% + .5px)); }
[data-ds-option-picker][data-type="swatch"] [data-slot="opt"][aria-disabled="true"] > i { opacity: .4; }
[data-ds-option-picker] [data-slot="low"] { position: absolute; top: 3px; right: 3px; width: 6px; height: 6px; border-radius: 999px; background: var(--ds-palette-danger-500); }
[data-ds-option-picker][data-type="swatch"] [data-slot="low"] { top: 0; right: 0; }
[data-ds-option-picker] [data-slot="hint"] { margin-top: 8px; font-size: 12px; color: var(--ds-tone-danger-text); }
[data-ds-search] { position: relative; }
[data-ds-search] [data-slot="box"] { display: flex; align-items: center; gap: 8px; height: 44px; padding: 0 6px 0 14px; border-radius: 999px; background: ${MUTED}; border: 1px solid transparent; color: ${FG}; }
[data-ds-search] [data-slot="box"]:focus-within { border-color: ${FG}; background: ${BG}; }
[data-ds-search] input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font: inherit; font-size: 14px; color: inherit; }
[data-ds-search] input::-webkit-search-cancel-button { display: none; }
[data-ds-search] [data-slot="box"] button { all: unset; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 999px; cursor: pointer; color: ${FG2}; }
[data-ds-search] [data-slot="box"] button:hover { background: color-mix(in oklab, currentColor 10%, transparent); }
[data-ds-search] [data-slot="panel"] { position: absolute; inset-inline: 0; top: calc(100% + 6px); z-index: 50; background: ${BG}; color: ${FG}; border: 1px solid ${BD}; border-radius: var(--ds-radius-lg, 12px); box-shadow: 0 12px 32px -8px rgb(0 0 0 / .18); padding: 8px; max-height: 420px; overflow: auto; }
[data-ds-search] [data-slot="panel"] h6 { margin: 8px 8px 6px; font-size: 12px; color: ${FG3}; font-weight: 600; display: flex; justify-content: space-between; }
[data-ds-search] [data-slot="panel"] h6 button { all: unset; cursor: pointer; font-weight: 400; }
[data-ds-search] [data-slot="chips"] { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 8px 8px; }
[data-ds-search] [data-slot="chips"] > span { display: inline-flex; align-items: center; gap: 2px; height: 30px; padding: 0 4px 0 12px; border: 1px solid ${BD}; border-radius: 999px; font-size: 13px; }
[data-ds-search] [data-slot="chips"] > span button { all: unset; cursor: pointer; }
[data-ds-search] [data-slot="chips"] > span > button:last-child { width: 20px; height: 20px; display: grid; place-items: center; border-radius: 999px; color: ${FG3}; }
[data-ds-search] [role="option"] { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--ds-radius-md); cursor: pointer; font-size: 14px; }
[data-ds-search] [role="option"][aria-selected="true"], [data-ds-search] [role="option"]:hover { background: ${MUTED}; }
[data-ds-search] [role="option"] [data-slot="rank"] { width: 16px; font-weight: 800; color: var(--ds-tone-accent-text); font-variant-numeric: tabular-nums; }
[data-ds-search] mark { background: none; color: var(--ds-tone-accent-text); font-weight: 700; }

/* 영상 재생기 · 하단 시트 · 하단 탭 */
[data-ds-video] { container-type: inline-size; width: 100%; position: relative; background: #000; color: #fff; aspect-ratio: 16/9; overflow: hidden; border-radius: var(--_r, var(--ds-radius-md)); font-size: 13px; }
[data-ds-video] video { width: 100%; height: 100%; display: block; object-fit: contain; }
[data-ds-video] [data-slot="ui"] { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; transition: opacity .25s; background: linear-gradient(to top, rgb(0 0 0 / .75), transparent 38%); }
[data-ds-video][data-idle] [data-slot="ui"] { opacity: 0; cursor: none; }
[data-ds-video] [data-slot="title"] { position: absolute; top: 0; inset-inline: 0; padding: 16px 20px 40px; background: linear-gradient(rgb(0 0 0 / .6), transparent); font-size: 15px; font-weight: 600; }
[data-ds-video] [data-slot="title"] small { display: block; font-size: 12px; font-weight: 400; opacity: .8; }
[data-ds-video] [data-slot="seek"] { margin: 0 16px; height: 16px; display: flex; align-items: center; cursor: pointer; }
[data-ds-video] [data-slot="seek"] > div { position: relative; flex: 1; height: 4px; background: rgb(255 255 255 / .3); border-radius: 999px; transition: height .15s; }
[data-ds-video] [data-slot="seek"]:hover > div { height: 6px; }
[data-ds-video] [data-slot="seek"] i { position: absolute; inset-block: 0; left: 0; border-radius: inherit; }
[data-ds-video] [data-slot="seek"] i[data-buf] { background: rgb(255 255 255 / .45); }
[data-ds-video] [data-slot="seek"] i[data-played] { background: var(--ds-palette-danger-500); }
[data-ds-video] [data-slot="seek"] i[data-played]::after { content: ''; position: absolute; right: -6px; top: 50%; translate: 0 -50%; width: 12px; height: 12px; border-radius: 999px; background: var(--ds-palette-danger-500); }
[data-ds-video] [data-slot="bar"] { display: flex; align-items: center; gap: 4px; padding: 4px 10px 10px; }
[data-ds-video] [data-slot="bar"] button { all: unset; flex: none; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 999px; cursor: pointer; }
[data-ds-video] [data-slot="bar"] button:hover { background: rgb(255 255 255 / .15); }
[data-ds-video] button:focus-visible { outline: 2px solid #fff; }
[data-ds-video] [data-slot="time"] { font-variant-numeric: tabular-nums; margin-left: 6px; white-space: nowrap; }
@container (max-width: 480px) {
    [data-ds-video] [data-slot="volume"] { display: none; }
    [data-ds-video] [data-slot="bar"] { gap: 0; padding: 2px 4px 6px; }
    [data-ds-video] [data-slot="title"] { padding: 12px 14px 32px; font-size: 14px; }
    [data-ds-video] [data-slot="skip"], [data-ds-video] [data-slot="next"] { right: 12px; bottom: 64px; padding: 8px 12px; }
    [data-ds-video] [data-slot="center"] { width: 56px; height: 56px; }
}
[data-ds-video] [data-slot="volume"] { width: 72px; accent-color: #fff; }
[data-ds-video] [data-slot="skip"] { all: unset; position: absolute; right: 20px; bottom: 84px; padding: 10px 16px; border: 1px solid rgb(255 255 255 / .6); background: rgb(0 0 0 / .55); border-radius: var(--ds-radius-md); font-weight: 600; cursor: pointer; }
[data-ds-video] [data-slot="skip"]:hover { background: rgb(255 255 255 / .15); }
[data-ds-video] [data-slot="next"] { position: absolute; right: 20px; bottom: 84px; display: flex; gap: 10px; align-items: center; padding: 10px 14px; background: rgb(0 0 0 / .7); border-radius: var(--ds-radius-md); }
[data-ds-video] [data-slot="settings"] { position: absolute; right: 12px; bottom: 64px; min-width: 220px; background: rgb(28 28 28 / .94); border-radius: var(--ds-radius-md); padding: 6px; }
[data-ds-video] [data-slot="settings"] > div { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 6px 10px; }
[data-ds-video] [data-slot="settings"] select { background: transparent; color: #fff; border: 1px solid rgb(255 255 255 / .3); border-radius: 4px; font: inherit; padding: 2px 4px; }
[data-ds-video] [data-slot="settings"] option { color: #000; }
[data-ds-video] [data-slot="center"] { position: absolute; z-index: 1; inset: 0; margin: auto; width: 72px; height: 72px; border-radius: 999px; background: rgb(0 0 0 / .55); display: grid; place-items: center; border: 0; color: #fff; cursor: pointer; }
[data-ds-sheet-backdrop] { position: fixed; inset: 0; z-index: 1000; background: rgb(0 0 0 / .45); animation: ds-fade .2s; }
[data-ds-sheet] { position: fixed; inset-inline: 0; bottom: 0; z-index: 1001; max-width: 640px; margin-inline: auto; background: ${BG}; color: ${FG}; border-radius: 20px 20px 0 0; box-shadow: 0 -8px 32px rgb(0 0 0 / .18); display: flex; flex-direction: column; transition: height .28s cubic-bezier(.2,.8,.2,1); padding-bottom: env(safe-area-inset-bottom); touch-action: none; }
[data-ds-sheet][data-dragging] { transition: none; }
[data-ds-sheet] [data-slot="grip"] { flex: none; height: 28px; display: grid; place-items: center; cursor: grab; }
[data-ds-sheet] [data-slot="grip"]::before { content: ''; width: 40px; height: 4px; border-radius: 999px; background: color-mix(in oklab, ${FG} 25%, transparent); }
[data-ds-sheet] [data-slot="head"] { padding: 0 20px 8px; font-size: 16px; font-weight: 700; }
[data-ds-sheet] [data-slot="content"] { flex: 1; overflow: auto; padding: 0 20px 16px; touch-action: pan-y; }
[data-ds-sheet] [data-slot="footer"] { flex: none; padding: 12px 20px; border-top: 1px solid ${BD}; display: flex; gap: 8px; align-items: center; }
[data-ds-sheet][data-inline] { position: absolute; }
@keyframes ds-fade { from { opacity: 0 } }
[data-ds-tabbar] { position: fixed; inset-inline: 0; bottom: 0; z-index: 900; display: grid; grid-template-columns: repeat(var(--_n), 1fr); background: color-mix(in oklab, ${BG} 92%, transparent); backdrop-filter: blur(12px); border-top: 1px solid ${BD}; padding-bottom: 0; }
[data-ds-tabbar][data-safe-area] { padding-bottom: max(env(safe-area-inset-bottom), 0px); }
[data-ds-tabbar][data-inline] { position: relative; }
[data-ds-tabbar] > * { all: unset; position: relative; height: 56px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; font-size: 12px; color: ${FG3}; cursor: pointer; -webkit-tap-highlight-color: transparent; }
[data-ds-tabbar] > [aria-current="page"] { color: ${FG}; font-weight: 700; }
[data-ds-tabbar] > *:focus-visible { outline: 2px solid ${ACC}; outline-offset: -4px; border-radius: 8px; }
[data-ds-tabbar] [data-slot="badge"] { position: absolute; top: 6px; left: calc(50% + 6px); min-width: 16px; height: 16px; padding: 0 4px; box-sizing: border-box; border-radius: 999px; background: var(--ds-palette-danger-600); color: #fff; font-size: 10px; font-weight: 700; display: grid; place-items: center; }
`
