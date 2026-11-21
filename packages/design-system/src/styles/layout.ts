/** Card · KpiCard · StatusCard (보드 6-01, 6-02). */
const TONES = ['accent', 'neutral', 'success', 'warning', 'danger', 'info']
export const CARD_CSS = `
${TONES.map((t) => `[data-ds-card][data-tone="${t}"] { --_c: var(--ds-tone-${t}-text); --_cs: var(--ds-tone-${t}-solid); }`).join('\n')}
[data-ds-card] {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
    box-sizing: border-box;
    color: var(--ds-surface-card-color);
    background: var(--ds-surface-card-background);
    -webkit-backdrop-filter: var(--ds-surface-card-backdrop-filter);
    backdrop-filter: var(--ds-surface-card-backdrop-filter);
    border: var(--ds-surface-card-border);
    border-radius: var(--ds-surface-card-radius);
    box-shadow: var(--ds-surface-card-shadow);
    transition: box-shadow var(--ds-motion-duration-fast), border-color var(--ds-motion-duration-fast), background var(--ds-motion-duration-fast), transform var(--ds-motion-duration-fast);
}
[data-ds-card][data-density="compact"] { gap: 8px; }
[data-ds-card][data-surface="panel"] { background: var(--ds-surface-panel-background); border: var(--ds-surface-panel-border); border-radius: var(--ds-surface-panel-radius); box-shadow: none; }
[data-ds-card][data-surface="overlay"] { background: var(--ds-surface-overlay-background); border: var(--ds-surface-overlay-border); border-radius: var(--ds-surface-overlay-radius); box-shadow: var(--ds-surface-overlay-shadow); }
[data-ds-card][data-variant="underline"] { background: transparent; border: none; border-bottom: 1px solid var(--ds-color-border-default); border-radius: 0; box-shadow: none; }
[data-ds-card][data-variant="filled"] { background: var(--ds-surface-inset-background); border-color: transparent; box-shadow: none; }
[data-ds-card][data-variant="ghost"] { background: transparent; border-color: transparent; box-shadow: none; }
[data-ds-card][data-accent="top"] { border-top: 3px solid var(--_cs); }
[data-ds-card][data-accent="left"] { box-shadow: inset 3px 0 0 var(--_cs), var(--ds-surface-card-shadow); }
[data-ds-card][data-interactive] { cursor: pointer; }
[data-ds-card][data-interactive]:hover { background: color-mix(in oklab, var(--ds-color-background-muted) 60%, var(--ds-surface-card-background)); border-color: var(--ds-color-border-default); }
[data-ds-card][data-interactive]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 2px; }
[data-ds-card][data-selected] { outline: 2px solid var(--ds-palette-primary-500); outline-offset: -2px; box-shadow: 0 0 0 4px var(--ds-color-focus-ring); }
[data-ds-card][data-disabled] { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
[data-ds-card] [data-slot="loading"] { display: flex; flex-direction: column; gap: 8px; }
[data-ds-card-header] { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
[data-ds-card-header] [data-slot="main"] { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
[data-ds-card-header] [data-slot="extra"] { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-card-header] [data-slot="actions"] { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
[data-ds-card-header] [data-slot="toggle"] {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
}
[data-ds-card-header] [data-slot="toggle"] > svg { flex-shrink: 0; color: var(--ds-color-foreground-tertiary); transition: transform var(--ds-motion-duration-fast); }
[data-ds-card-header] [data-slot="toggle"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 2px; border-radius: 4px; }
[data-ds-card-title] { margin: 0; font-size: 15px; font-weight: 600; line-height: 1.4; color: var(--ds-color-foreground-primary); }
[data-ds-card-description] { margin: 0; font-size: 13px; line-height: 1.5; color: var(--ds-color-foreground-tertiary); }
[data-ds-card-body] { font-size: 14px; line-height: 1.6; color: var(--ds-color-foreground-secondary); }
[data-ds-card-footer] { display: flex; justify-content: flex-end; gap: 6px; padding-top: 12px; border-top: 1px solid var(--ds-color-border-subtle); }
[data-ds-card-section] { padding-top: 12px; border-top: 1px solid var(--ds-color-border-subtle); }
[data-ds-card-media] { margin: 0; overflow: hidden; }
[data-ds-card]:not([data-flush]) > [data-ds-card-media]:first-child { margin: calc(-1 * var(--ds-spacing-5)) calc(-1 * var(--ds-spacing-5)) 0; border-radius: inherit; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
[data-ds-card][data-flush] > :not([data-ds-card-media]) { padding-left: 16px; padding-right: 16px; }
[data-ds-card][data-flush] > :last-child:not([data-ds-card-media]) { padding-bottom: 14px; }

[data-ds-kpi] { gap: 10px; }
[data-ds-kpi] [data-slot="head"] { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
[data-ds-kpi] [data-slot="label"] { font-size: 13px; font-weight: 500; color: var(--ds-color-foreground-secondary); }
[data-ds-kpi] [data-slot="value"] { display: flex; align-items: baseline; gap: 6px; }
[data-ds-kpi] [data-slot="value"] b { font-size: 30px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.1; font-variant-numeric: tabular-nums; color: var(--ds-color-foreground-primary); }
[data-ds-kpi] [data-slot="unit"] { font-size: 13px; color: var(--ds-color-foreground-tertiary); }
[data-ds-kpi] [data-ds-progress] [data-slot="bar"] { overflow: visible; }
[data-ds-kpi] [data-slot="meta"] { display: flex; justify-content: space-between; font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-kpi] [data-slot="meta"] b { font-weight: 600; font-variant-numeric: tabular-nums; }
${TONES.map((t) => `[data-ds-kpi] [data-slot="meta"] b[data-tone="${t}"], [data-ds-status-card] b[data-tone="${t}"] { color: var(--ds-tone-${t}-text); }`).join('\n')}

[data-ds-status-card] { gap: 10px; }
${['success', 'warning', 'danger'].map((t) => `[data-ds-status-card][data-status-tone="${t}"] { background: color-mix(in oklab, var(--ds-tone-${t}-solid) ${t === 'success' ? 0 : 6}%, var(--ds-surface-card-background)); border-color: color-mix(in oklab, var(--ds-tone-${t}-solid) ${t === 'success' ? 0 : 40}%, var(--ds-color-border-subtle)); }`).join('\n')}
[data-ds-status-card] [data-slot="head"] { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
[data-ds-status-card] h4 { margin: 0; font-size: 15px; font-weight: 600; }
[data-ds-status-card] [data-slot="metrics"] { display: grid; gap: 8px; padding: 10px 0; border-top: 1px solid var(--ds-color-border-subtle); border-bottom: 1px solid var(--ds-color-border-subtle); }
[data-ds-status-card] [data-slot="metrics"] > span { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
[data-ds-status-card] [data-slot="metrics"] small { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-status-card] [data-slot="metrics"] b { font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; }
[data-ds-status-card] [data-slot="foot"] { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-status-card] [data-slot="foot"] > span:first-child { flex: 1; min-width: 0; }
[data-ds-status-card] [data-slot="actions"] { display: inline-flex; gap: 4px; }
`.trim()

/** Box · Stack · Grid · Divider · ScrollArea (보드 6-03) */
export const PRIMITIVE_CSS = `
[data-ds-stack-divider] { flex-shrink: 0; align-self: stretch; background: var(--ds-color-border-subtle); }
[data-ds-stack-divider][data-dir="row"] { width: 1px; }
[data-ds-stack-divider][data-dir="column"] { height: 1px; }

[data-ds-divider] { --_lc: var(--ds-color-border-subtle); flex-shrink: 0; }
${['accent', 'success', 'warning', 'danger', 'info', 'neutral'].map((t) => `[data-ds-divider][data-tone="${t}"] { --_lc: color-mix(in oklab, var(--ds-tone-${t}-solid) 55%, transparent); color: var(--ds-tone-${t}-text); }`).join('\n')}
[data-ds-divider][data-orientation="horizontal"] { height: 0; border-top: 1px solid var(--_lc); }
[data-ds-divider][data-orientation="vertical"] { width: 0; align-self: stretch; border-left: 1px solid var(--_lc); }
[data-ds-divider][data-dashed] { border-style: dashed; }
[data-ds-divider][data-inset][data-orientation="horizontal"] { margin-left: 12px; margin-right: 12px; }
[data-ds-divider][data-inset][data-orientation="vertical"] { margin-left: 8px; margin-right: 8px; }
[data-ds-divider][data-label-position] { display: flex; align-items: center; gap: 12px; height: auto; border: none; font-size: 12px; font-weight: 600; color: var(--ds-color-foreground-tertiary); }
[data-ds-divider][data-label-position]::before, [data-ds-divider][data-label-position]::after { content: ""; flex: 1; border-top: 1px solid var(--_lc); }
[data-ds-divider][data-dashed][data-label-position]::before, [data-ds-divider][data-dashed][data-label-position]::after { border-top-style: dashed; }
[data-ds-divider][data-label-position="start"]::before { flex: 0 0 16px; }
[data-ds-divider][data-label-position="end"]::after { flex: 0 0 16px; }

[data-ds-scroll-area] { position: relative; outline: none; overflow: auto; }
[data-ds-scroll-area]:focus-visible { box-shadow: inset 0 0 0 2px var(--ds-palette-primary-500); }
[data-ds-scroll-area][data-direction="vertical"] { overflow-x: hidden; }
[data-ds-scroll-area][data-direction="horizontal"] { overflow-y: hidden; }
[data-ds-scroll-area][data-scrollbar="always"] { scrollbar-gutter: stable; }
[data-ds-scroll-area][data-scrollbar="always"]::-webkit-scrollbar-thumb { background: var(--ds-color-border-strong) !important; }
[data-ds-scroll-area][data-scrollbar="hover"] { scrollbar-color: transparent transparent; }
[data-ds-scroll-area][data-scrollbar="hover"]:hover { scrollbar-color: var(--ds-color-border-strong) transparent; }
[data-ds-scroll-area][data-scrollbar="hover"]::-webkit-scrollbar-thumb { background: transparent !important; }
[data-ds-scroll-area][data-scrollbar="hover"]:hover::-webkit-scrollbar-thumb { background: var(--ds-color-border-strong) !important; }
[data-ds-scroll-area][data-shadow-top] { box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, 0.12); }
[data-ds-scroll-area][data-shadow-bottom] { box-shadow: inset 0 -10px 8px -8px rgba(0, 0, 0, 0.12); }
[data-ds-scroll-area][data-shadow-top][data-shadow-bottom] { box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, 0.12), inset 0 -10px 8px -8px rgba(0, 0, 0, 0.12); }
[data-ds-scroll-area][data-shadow-right] { box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, 0.12); }
[data-ds-scroll-area][data-shadow-left] { box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, 0.12); }
[data-ds-scroll-area][data-shadow-left][data-shadow-right] { box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, 0.12), inset -10px 0 8px -8px rgba(0, 0, 0, 0.12); }
`.trim()

/** Tabs · Accordion (보드 6-04) */
export const TABS_CSS = `
[data-ds-tabs] { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
[data-ds-tabs][data-orientation="vertical"] { flex-direction: row; gap: 20px; }
[data-ds-tablist] { display: flex; align-items: center; gap: 4px; min-width: 0; }
[data-ds-tabs][data-overflow="scroll"] > [data-ds-tablist] { overflow-x: auto; scrollbar-width: none; }
[data-ds-tablist] > [role="tab"], [data-ds-tablist] > [data-slot="more"] {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    height: 38px;
    padding: 0 12px;
    border: none;
    background: none;
    color: var(--ds-color-foreground-tertiary);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: color var(--ds-motion-duration-fast), background var(--ds-motion-duration-fast), border-color var(--ds-motion-duration-fast);
}
[data-ds-tablist][data-size="sm"] > [role="tab"] { height: 30px; padding: 0 10px; font-size: 12px; }
[data-ds-tablist][data-size="lg"] > [role="tab"] { height: 44px; padding: 0 16px; font-size: 15px; }
[data-ds-tablist] > [role="tab"]:hover:not(:disabled) { color: var(--ds-color-foreground-primary); }
[data-ds-tablist] > [role="tab"][aria-selected="true"] { color: var(--ds-color-foreground-primary); font-weight: 600; }
[data-ds-tablist] > [role="tab"]:disabled { opacity: 0.4; cursor: not-allowed; }
[data-ds-tablist] > [role="tab"]:focus-visible, [data-ds-tablist] > [data-slot="more"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: -2px; border-radius: var(--ds-radius-sm); }
[data-ds-tablist] [data-slot="icon"] { display: inline-flex; }
[data-ds-tablist] [data-slot="close"] { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; margin-right: -4px; border-radius: 3px; opacity: 0.6; }
[data-ds-tablist] [data-slot="close"]:hover { opacity: 1; background: color-mix(in oklab, currentColor 12%, transparent); }
/* underline */
[data-ds-tablist][data-appearance="underline"] { border-bottom: 1px solid var(--ds-color-border-default); }
[data-ds-tablist][data-appearance="underline"] > [role="tab"] { border-bottom: 2px solid transparent; margin-bottom: -1px; }
[data-ds-tablist][data-appearance="underline"] > [role="tab"][aria-selected="true"] { border-bottom-color: var(--ds-palette-primary-600); }
/* pill */
[data-ds-tablist][data-appearance="pill"] > [role="tab"] { height: 32px; padding: 0 14px; border-radius: 999px; }
[data-ds-tablist][data-appearance="pill"] > [role="tab"]:hover:not(:disabled):not([aria-selected="true"]) { background: var(--ds-color-background-muted); }
[data-ds-tablist][data-appearance="pill"] > [role="tab"][aria-selected="true"] { background: var(--ds-color-accent-background); color: var(--ds-color-accent-color); box-shadow: var(--ds-color-accent-shadow); }
/* enclosed (문서 탭) */
[data-ds-tablist][data-appearance="enclosed"] { gap: 0; border-bottom: 1px solid var(--ds-color-border-default); }
[data-ds-tablist][data-appearance="enclosed"] > [role="tab"] { border: 1px solid var(--ds-color-border-default); border-bottom: none; margin-right: -1px; border-radius: var(--ds-radius-sm) var(--ds-radius-sm) 0 0; background: var(--ds-color-background-muted); }
[data-ds-tablist][data-appearance="enclosed"] > [role="tab"][aria-selected="true"] { background: var(--ds-surface-card-background); height: 39px; margin-bottom: -1px; z-index: 1; }
/* segmented */
[data-ds-tablist][data-appearance="segmented"] { display: inline-flex; align-self: flex-start; gap: 2px; padding: 3px; background: color-mix(in oklab, var(--ds-color-foreground-primary) 7%, var(--ds-surface-card-background)); border: 1px solid color-mix(in oklab, var(--ds-color-foreground-primary) 6%, transparent); border-radius: var(--ds-radius-lg); }
[data-ds-tablist][data-appearance="segmented"] > [role="tab"] { height: 28px; padding: 0 14px; border-radius: var(--ds-radius-md); }
[data-ds-tablist][data-appearance="segmented"] > [role="tab"][aria-selected="true"] { background: var(--ds-surface-card-background); box-shadow: 0 1px 3px rgba(26, 24, 29, 0.14), 0 0 0 1px color-mix(in oklab, var(--ds-color-foreground-primary) 8%, transparent); }
/* vertical */
[data-ds-tabs][data-orientation="vertical"] > [data-ds-tablist] { flex-direction: column; align-items: stretch; gap: 2px; width: 180px; flex-shrink: 0; border-bottom: none; border-left: 1px solid var(--ds-color-border-default); }
[data-ds-tabs][data-orientation="vertical"] > [data-ds-tablist] > [role="tab"] { justify-content: flex-start; height: 34px; border-bottom: none; margin: 0 0 0 -1px; border-left: 2px solid transparent; border-radius: 0; }
[data-ds-tabs][data-orientation="vertical"] > [data-ds-tablist] > [role="tab"][aria-selected="true"] { border-left-color: var(--ds-palette-primary-600); color: var(--ds-tone-accent-text); background: color-mix(in oklab, var(--ds-palette-primary-500) 8%, transparent); }
[data-ds-tabpanel] { outline: none; min-width: 0; flex: 1; }
[data-ds-tabpanel]:focus-visible { box-shadow: 0 0 0 2px var(--ds-color-focus-ring); border-radius: var(--ds-radius-sm); }
[data-ds-tablist] > [data-slot="more"] { margin-left: auto; width: 36px; justify-content: center; padding: 0; }

[data-ds-accordion] { display: flex; flex-direction: column; }
[data-ds-accordion-item] { border-bottom: 1px solid var(--ds-color-border-subtle); }
[data-ds-accordion] [data-slot="heading"] { margin: 0; font: inherit; }
[data-ds-accordion] [data-slot="trigger"] {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 44px;
    padding: 0 4px;
    border: none;
    background: none;
    color: var(--ds-color-foreground-primary);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
}
[data-ds-accordion][data-density="compact"] [data-slot="trigger"] { height: 36px; font-size: 13px; }
[data-ds-accordion][data-density="comfortable"] [data-slot="trigger"] { height: 52px; font-size: 15px; }
[data-ds-accordion] [data-slot="trigger"]:disabled { color: var(--ds-color-foreground-tertiary); cursor: not-allowed; }
[data-ds-accordion] [data-slot="trigger"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: -2px; border-radius: var(--ds-radius-sm); }
[data-ds-accordion] [data-slot="title"] { min-width: 0; }
[data-ds-accordion] [data-slot="icon"] { display: inline-flex; color: var(--ds-color-foreground-tertiary); }
[data-ds-accordion] [data-slot="extra"] { display: inline-flex; font-weight: 500; }
[data-ds-accordion] [data-slot="chevron"] { margin-left: auto; flex-shrink: 0; color: var(--ds-color-foreground-tertiary); transition: transform var(--ds-motion-duration-fast); }
[data-ds-accordion-item][data-open] [data-slot="chevron"] { transform: rotate(180deg); }
[data-ds-accordion] [data-slot="panel"] { padding: 0 4px 14px; font-size: 13px; line-height: 1.6; color: var(--ds-color-foreground-secondary); }
[data-ds-accordion][data-appearance="separated"] { gap: 8px; }
[data-ds-accordion][data-appearance="separated"] [data-ds-accordion-item] { padding: 0 12px; border: var(--ds-surface-card-border); border-radius: var(--ds-radius-md); background: var(--ds-surface-card-background); box-shadow: var(--ds-surface-card-shadow); }
[data-ds-accordion][data-appearance="flush"] [data-ds-accordion-item] { border-bottom: none; }
[data-ds-accordion][data-appearance="flush"] [data-slot="trigger"], [data-ds-accordion][data-appearance="flush"] [data-slot="panel"] { padding-left: 0; padding-right: 0; }
`.trim()

/** AppShell · PageHeader · FilterBar · Splitter (보드 6-05) */
export const SHELL_CSS = `
[data-ds-app-shell] {
    display: grid;
    grid-template-columns: var(--_sw) minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr) auto;
    grid-template-areas: "header header" "sidebar main" "footer footer";
    height: 100%;
    min-height: 0;
    background: var(--ds-surface-page-background);
    color: var(--ds-color-foreground-primary);
    transition: grid-template-columns var(--ds-motion-duration-normal, 200ms) var(--ds-motion-easing-ease-out);
}
[data-ds-app-shell] > [data-slot="header"] { grid-area: header; display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 16px; background: var(--ds-surface-panel-background); -webkit-backdrop-filter: var(--ds-surface-panel-backdrop-filter); backdrop-filter: var(--ds-surface-panel-backdrop-filter); border-bottom: 1px solid var(--ds-color-border-default); }
[data-ds-app-shell] > [data-slot="sidebar"] { grid-area: sidebar; position: relative; display: flex; flex-direction: column; min-height: 0; overflow: hidden; background: var(--ds-surface-panel-background); border-right: 1px solid var(--ds-color-border-default); }
[data-ds-app-shell] [data-slot="sidebar-body"] { flex: 1; min-height: 0; overflow-y: auto; padding: 8px; }
[data-ds-app-shell] [data-slot="collapse"] {
    display: flex; align-items: center; justify-content: center;
    height: 36px; border: none; border-top: 1px solid var(--ds-color-border-subtle);
    background: transparent; color: var(--ds-color-foreground-tertiary); cursor: pointer;
}
[data-ds-app-shell] [data-slot="collapse"]:hover { color: var(--ds-color-foreground-primary); background: var(--ds-color-background-muted); }
[data-ds-app-shell] [data-slot="collapse"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: -2px; }
[data-ds-app-shell] > [data-slot="main"] { grid-area: main; min-width: 0; min-height: 0; overflow: auto; padding: 20px 24px; }
[data-ds-app-shell] > [data-slot="footer"] { grid-area: footer; display: flex; align-items: center; gap: 14px; height: 28px; padding: 0 12px; font-size: 12px; color: var(--ds-color-foreground-tertiary); background: var(--ds-color-background-muted); border-top: 1px solid var(--ds-color-border-default); }
[data-ds-app-shell][data-kiosk] { grid-template-columns: minmax(0, 1fr); grid-template-areas: "main" "footer"; grid-template-rows: minmax(0, 1fr) auto; font-size: 18px; }
[data-ds-app-shell][data-kiosk] > [data-slot="main"] { padding: 24px 32px; }
[data-ds-app-shell][data-kiosk] > [data-slot="footer"] { height: 36px; font-size: 14px; }

[data-ds-page-header] { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
[data-ds-page-header] [data-slot="breadcrumb"] { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-page-header] [data-slot="row"] { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
[data-ds-page-header] [data-slot="title-wrap"] { display: flex; align-items: center; gap: 8px; min-width: 0; }
[data-ds-page-header] h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.3; color: var(--ds-color-foreground-primary); }
[data-ds-page-header] [data-slot="actions"] { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
[data-ds-page-header] [data-slot="description"] { margin: 0; font-size: 13px; color: var(--ds-color-foreground-secondary); }
[data-ds-page-header] [data-slot="meta"] { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-page-header] [data-slot="tabs"] { margin-top: 6px; }

[data-ds-filter-bar] {
    display: flex; flex-direction: column; gap: 12px;
    padding: 14px 16px;
    background: var(--ds-surface-card-background);
    border: var(--ds-surface-card-border);
    border-radius: var(--ds-surface-card-radius);
    box-shadow: var(--ds-surface-card-shadow);
}
[data-ds-filter-bar] [data-slot="fields"] { display: grid; gap: 10px 12px; align-items: end; }
[data-ds-filter-bar] [data-slot="fields"] > [data-ds-form-field] { gap: 4px; }
[data-ds-filter-bar] [data-slot="bar"] { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
[data-ds-filter-bar] [data-slot="chips"] { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-filter-bar] [data-slot="buttons"] { display: flex; gap: 6px; margin-left: auto; }

[data-ds-splitter] { display: flex; min-width: 0; min-height: 0; height: 100%; }
[data-ds-splitter][data-direction="vertical"] { flex-direction: column; }
[data-ds-splitter] > [data-slot="pane"] { min-width: 0; min-height: 0; overflow: auto; flex-shrink: 0; transition: flex-basis 160ms var(--ds-motion-easing-ease-out); }
[data-ds-splitter] > [data-slot="pane"][data-fill] { flex: 1 1 0; }
[data-ds-splitter] > [data-slot="handle"] { position: relative; display: flex; align-items: center; justify-content: center; flex: 0 0 8px; cursor: col-resize; outline: none; touch-action: none; }
[data-ds-splitter][data-direction="vertical"] > [data-slot="handle"] { cursor: row-resize; }
[data-ds-splitter] > [data-slot="handle"] > span { width: 2px; height: 28px; border-radius: 2px; background: var(--ds-color-border-strong); transition: background var(--ds-motion-duration-fast); }
[data-ds-splitter][data-direction="vertical"] > [data-slot="handle"] > span { width: 28px; height: 2px; }
[data-ds-splitter] > [data-slot="handle"]:hover > span, [data-ds-splitter] > [data-slot="handle"]:focus-visible > span { background: var(--ds-palette-primary-500); }
[data-ds-splitter] > [data-slot="handle"]:focus-visible { box-shadow: inset 0 0 0 2px var(--ds-color-focus-ring); border-radius: 4px; }
`.trim()

/** NavigationMenu · Breadcrumb · Pagination · Stepper (보드 7-01 ~ 7-03) */
export const NAV_CSS = `
[data-ds-nav] { display: flex; flex-direction: column; gap: 6px; font-size: 13px; min-width: 0; }
[data-ds-nav] ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
[data-ds-nav] [data-slot="search"] { display: flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border-radius: var(--ds-radius-sm); background: var(--ds-surface-inset-background); color: var(--ds-color-foreground-tertiary); }
[data-ds-nav] [data-slot="search"]:focus-within { box-shadow: 0 0 0 2px var(--ds-palette-primary-500); }
[data-ds-nav] [data-slot="search"] input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font: inherit; font-size: 12px; color: var(--ds-color-foreground-primary); }
[data-ds-nav] [data-slot="group"] { padding: 10px 10px 4px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--ds-color-foreground-tertiary); }
[data-ds-nav] [data-slot="item"] {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 34px;
    padding: 0 10px 0 calc(10px + var(--_d, 0) * 26px);
    box-sizing: border-box;
    border: none;
    border-radius: var(--ds-radius-sm);
    background: transparent;
    color: var(--ds-color-foreground-secondary);
    font: inherit;
    font-weight: 500;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
}
[data-ds-nav] ul[data-depth="1"] [data-slot="item"], [data-ds-nav] ul[data-depth="2"] [data-slot="item"] { height: 30px; font-size: 12px; }
[data-ds-nav][data-density="compact"] [data-slot="item"] { height: 26px; font-size: 12px; }
[data-ds-nav][data-density="comfortable"] [data-slot="item"] { height: 40px; font-size: 14px; }
[data-ds-nav] [data-slot="item"]:hover:not(:disabled):not([aria-disabled="true"]) { background: var(--ds-color-background-muted); color: var(--ds-color-foreground-primary); }
[data-ds-nav] [data-slot="item"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: -2px; }
[data-ds-nav] [data-slot="item"][data-active], [data-ds-nav] [data-slot="item"][data-active-within] {
    background: color-mix(in oklab, var(--ds-palette-primary-500) 12%, transparent);
    color: var(--ds-tone-accent-text);
    font-weight: 600;
}
[data-ds-nav] ul[data-depth="1"] [data-slot="item"][data-active] { background: transparent; }
[data-ds-nav] [data-slot="item"]:disabled, [data-ds-nav] [data-slot="item"][aria-disabled="true"] { color: var(--ds-color-foreground-tertiary); cursor: not-allowed; }
[data-ds-nav] [data-slot="icon"] { display: inline-flex; flex-shrink: 0; }
[data-ds-nav] [data-slot="label"] { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
[data-ds-nav] [data-slot="badge"] { margin-left: auto; }
[data-ds-nav] [data-slot="chevron"] { flex-shrink: 0; color: var(--ds-color-foreground-tertiary); transition: transform var(--ds-motion-duration-fast); }
[data-ds-nav] [data-slot="empty"] { padding: 10px; font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-nav][data-collapsed] ul { align-items: center; }
[data-ds-nav][data-collapsed] [data-slot="item"] { position: relative; width: 40px; justify-content: center; padding: 0; }
[data-ds-nav][data-collapsed] [data-slot="dot"] { position: absolute; top: 5px; right: 7px; width: 7px; height: 7px; border-radius: 50%; background: var(--ds-palette-danger-600); }
[data-ds-nav][data-orientation="horizontal"] ul { flex-direction: row; align-items: center; overflow: hidden; }
[data-ds-nav][data-orientation="horizontal"] li { flex-shrink: 0; }
[data-ds-nav][data-orientation="horizontal"] [data-slot="item"] { width: auto; height: 34px; padding: 0 12px; }
[data-ds-nav][data-orientation="horizontal"] [data-slot="more-li"] { margin-left: auto; }

[data-ds-breadcrumb] ol { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; font-size: 13px; color: var(--ds-color-foreground-tertiary); }
[data-ds-breadcrumb][data-size="sm"] ol { font-size: 12px; gap: 6px; }
[data-ds-breadcrumb] li { display: inline-flex; align-items: center; }
[data-ds-breadcrumb] [data-slot="sep"] { color: var(--ds-color-border-strong); }
[data-ds-breadcrumb] [data-slot="link"], [data-ds-breadcrumb] [data-slot="more"], [data-ds-breadcrumb] [data-slot="current-menu"] {
    display: inline-flex; align-items: center; gap: 4px; padding: 2px 4px; margin: -2px -4px;
    border: none; border-radius: var(--ds-radius-xs); background: none; color: inherit; font: inherit; text-decoration: none; cursor: pointer;
}
[data-ds-breadcrumb] [data-slot="link"]:hover, [data-ds-breadcrumb] [data-slot="more"]:hover { color: var(--ds-color-foreground-primary); background: var(--ds-color-background-muted); }
[data-ds-breadcrumb] [data-slot="current"], [data-ds-breadcrumb] [data-slot="current-menu"] { display: inline-flex; align-items: center; gap: 4px; color: var(--ds-color-foreground-primary); font-weight: 600; }
[data-ds-breadcrumb] [data-slot="icon"] { display: inline-flex; }
[data-ds-breadcrumb] :focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 1px; }

[data-ds-pagination] { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 13px; color: var(--ds-color-foreground-secondary); }
[data-ds-pagination] [data-slot="total"] b { color: var(--ds-color-foreground-primary); font-variant-numeric: tabular-nums; }
[data-ds-pagination] [data-slot="pages"] { display: flex; align-items: center; gap: 4px; }
[data-ds-pagination] [data-slot="btn"] {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 32px; height: 32px; padding: 0 6px; box-sizing: border-box;
    border: 1px solid transparent; border-radius: var(--ds-radius-sm);
    background: transparent; color: var(--ds-color-foreground-secondary);
    font: inherit; font-weight: 500; font-variant-numeric: tabular-nums; cursor: pointer;
}
[data-ds-pagination][data-size="sm"] [data-slot="btn"] { min-width: 26px; height: 26px; font-size: 12px; }
[data-ds-pagination][data-variant="outlined"] [data-slot="btn"] { border-color: var(--ds-color-border-default); background: var(--ds-surface-card-background); }
[data-ds-pagination] [data-slot="btn"]:hover:not(:disabled):not([aria-current]) { background: var(--ds-color-background-muted); color: var(--ds-color-foreground-primary); }
[data-ds-pagination] [data-slot="btn"]:disabled { opacity: 0.4; cursor: not-allowed; }
[data-ds-pagination] [data-slot="btn"][aria-current="page"] { background: var(--ds-color-accent-background); color: var(--ds-color-accent-color); border-color: transparent; font-weight: 700; box-shadow: var(--ds-color-accent-shadow); }
[data-ds-pagination] [data-slot="btn"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 1px; }
[data-ds-pagination] [data-slot="gap"] { padding: 0 4px; color: var(--ds-color-foreground-tertiary); }
[data-ds-pagination] [data-slot="simple"] { padding: 0 8px; font-family: var(--ds-typography-font-family-mono); font-size: 12px; }
[data-ds-pagination] [data-slot="jumper"] label { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; }
[data-ds-pagination] [data-slot="jumper"] input { width: 48px; height: 28px; box-sizing: border-box; text-align: center; border: 1px solid var(--ds-color-border-default); border-radius: var(--ds-radius-sm); background: var(--ds-surface-card-background); color: var(--ds-color-foreground-primary); font-family: var(--ds-typography-font-family-mono); font-size: 12px; }
[data-ds-pagination] [data-slot="jumper"] input:focus { outline: none; border-color: var(--ds-palette-primary-500); box-shadow: 0 0 0 3px var(--ds-color-focus-ring); }

[data-ds-stepper] { --_m: 28px; display: flex; align-items: flex-start; margin: 0; padding: 0; list-style: none; }
[data-ds-stepper][data-size="sm"] { --_m: 22px; }
[data-ds-stepper][data-appearance="dot"] { --_m: 12px; }
[data-ds-stepper] > li { position: relative; flex: 1; min-width: 0; }
[data-ds-stepper][data-orientation="horizontal"] > li:not(:last-child)::before {
    content: ""; position: absolute; top: calc(var(--_m) / 2 - 1px); left: calc(var(--_m) + 6px); right: 6px; height: 2px; background: var(--ds-color-border-default);
}
[data-ds-stepper][data-appearance="dot"][data-orientation="horizontal"] > li:not(:last-child)::before { top: 13px; left: 18px; }
[data-ds-stepper] > li[data-status="finish"]:not(:last-child)::before { background: var(--ds-palette-primary-600); }
[data-ds-stepper] [data-slot="step"] {
    position: relative; z-index: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 6px;
    padding: 0; border: none; background: none; color: inherit; font: inherit; text-align: left;
}
[data-ds-stepper] button[data-slot="step"] { cursor: pointer; }
[data-ds-stepper] button[data-slot="step"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 4px; border-radius: 4px; }
[data-ds-stepper] [data-slot="marker"] {
    display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
    width: var(--_m); height: var(--_m); box-sizing: border-box; border-radius: 50%;
    border: 2px solid var(--ds-color-border-default); background: var(--ds-surface-card-background);
    color: var(--ds-color-foreground-tertiary); font-size: 12px; font-weight: 700;
}
[data-ds-stepper][data-appearance="dot"] [data-slot="marker"] { margin: 8px 0; }
[data-ds-stepper] [data-status="finish"] [data-slot="marker"] { background: var(--ds-palette-primary-600); border-color: var(--ds-palette-primary-600); color: #fff; }
[data-ds-stepper] [data-status="process"] [data-slot="marker"] { border-color: var(--ds-palette-primary-600); color: var(--ds-tone-accent-text); box-shadow: 0 0 0 4px var(--ds-color-focus-ring); }
[data-ds-stepper] [data-status="error"] [data-slot="marker"] { background: var(--ds-palette-danger-600); border-color: var(--ds-palette-danger-600); color: #fff; }
[data-ds-stepper] [data-status="skip"] [data-slot="marker"] { border-style: dashed; }
[data-ds-stepper] [data-slot="text"] { display: flex; flex-direction: column; gap: 2px; padding-right: 8px; }
[data-ds-stepper] [data-slot="label"] { font-size: 13px; font-weight: 600; color: var(--ds-color-foreground-primary); }
[data-ds-stepper][data-size="sm"] [data-slot="label"] { font-size: 12px; }
[data-ds-stepper] [data-status="wait"] [data-slot="label"], [data-ds-stepper] [data-status="skip"] [data-slot="label"] { color: var(--ds-color-foreground-tertiary); }
[data-ds-stepper] [data-status="process"] [data-slot="label"] { color: var(--ds-tone-accent-text); }
[data-ds-stepper] [data-slot="desc"] { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-stepper] [data-status="error"] [data-slot="desc"] { color: var(--ds-tone-danger-text); }
[data-ds-stepper][data-orientation="vertical"] { flex-direction: column; }
[data-ds-stepper][data-orientation="vertical"] > li { padding-bottom: 16px; }
[data-ds-stepper][data-orientation="vertical"] > li:last-child { padding-bottom: 0; }
[data-ds-stepper][data-orientation="vertical"] [data-slot="step"] { flex-direction: row; gap: 10px; }
[data-ds-stepper][data-orientation="vertical"] > li:not(:last-child)::before {
    content: ""; position: absolute; left: calc(var(--_m) / 2 - 1px); top: calc(var(--_m) + 2px); bottom: 2px; width: 2px; background: var(--ds-color-border-default);
}
[data-ds-stepper][data-orientation="vertical"] > li[data-status="finish"]:not(:last-child)::before { background: var(--ds-palette-primary-600); }
`.trim()

/** 대시보드 카드 · DashboardGrid (보드 9-01 ~ 9-03) */
export const DASH_CSS = `
[data-ds-card][data-surface="inverse"] { background: var(--ds-color-foreground-primary); color: var(--ds-color-background-muted); border-color: transparent; }
[data-ds-mode="dark"] [data-ds-card][data-surface="inverse"] { background: color-mix(in oklab, var(--ds-color-foreground-primary) 14%, var(--ds-surface-card-background)); color: var(--ds-color-foreground-primary); }
[data-ds-card][data-surface="inverse"] [data-ds-card-eyebrow], [data-ds-card][data-surface="inverse"] [data-ds-card-metric] span { color: color-mix(in oklab, currentColor 70%, transparent); }
[data-ds-card][data-surface="tinted"] { background: color-mix(in oklab, var(--_cs, var(--ds-palette-primary-500)) 9%, var(--ds-surface-card-background)); border-color: color-mix(in oklab, var(--_cs, var(--ds-palette-primary-500)) 30%, transparent); }
[data-ds-card][data-surface="nested"] { background: var(--ds-color-background-muted); box-shadow: none; }
[data-ds-card][data-surface="nested"] > [data-ds-card] { box-shadow: var(--ds-shadow-xs); }
[data-ds-card][data-surface="media"] { position: relative; isolation: isolate; overflow: hidden; color: #fff; border-color: transparent; background: #222 var(--_img) var(--_pos) / cover no-repeat; }
[data-ds-card][data-surface="media"]::before { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0, var(--_scrim))); }
[data-ds-card][data-surface="media"] [data-ds-card-eyebrow], [data-ds-card][data-surface="media"] [data-ds-card-metric] span { color: rgba(255,255,255,0.82); }
[data-ds-card][data-surface="glass"] { position: relative; isolation: isolate; overflow: hidden; background: rgba(255,255,255,0.42); border: 1px solid rgba(255,255,255,0.6); -webkit-backdrop-filter: blur(var(--_blur, 14px)) saturate(160%); backdrop-filter: blur(var(--_blur, 14px)) saturate(160%); }
[data-ds-mode="dark"] [data-ds-card][data-surface="glass"] { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
[data-ds-card] [data-slot="glass-backdrop"] { position: absolute; inset: 0; z-index: -1; filter: blur(var(--_blur, 14px)); transform: scale(1.1); }
[data-ds-card][data-density="touch"] [data-ds-card-actions] [data-ds-button] { min-width: 44px; height: 44px; }

[data-ds-card-eyebrow] { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--ds-color-foreground-tertiary); }
[data-ds-card-eyebrow] > span { display: inline-flex; }
[data-ds-card-actions] { position: absolute; top: calc(var(--_pad, 20px) - 6px); right: calc(var(--_pad, 20px) - 6px); display: flex; gap: 2px; }
[data-ds-card-metric] { display: flex; align-items: baseline; gap: 6px; }
[data-ds-card-metric] b { font-size: 32px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.1; font-variant-numeric: tabular-nums; }
[data-ds-card-metric][data-size="sm"] b { font-size: 24px; }
[data-ds-card-metric][data-size="lg"] b { font-size: 40px; }
[data-ds-card-metric] span { font-size: 13px; color: var(--ds-color-foreground-tertiary); }
[data-ds-card-delta] { display: flex; align-items: center; gap: 8px; font-size: 12px; }
[data-ds-card-delta] [data-slot="cmp"] { color: var(--ds-color-foreground-tertiary); }
[data-ds-card-visual] { min-height: 0; }
[data-ds-card-visual][data-bleed="x"], [data-ds-card-visual][data-bleed="all"] { margin-left: calc(-1 * var(--_pad, 20px)); margin-right: calc(-1 * var(--_pad, 20px)); }
[data-ds-card-visual][data-bleed="bottom"], [data-ds-card-visual][data-bleed="all"] { margin-bottom: calc(-1 * var(--_pad, 20px)); border-radius: 0 0 inherit inherit; overflow: hidden; }
[data-ds-card-note] { display: flex; align-items: center; gap: 6px; margin-top: auto; padding-top: 10px; border-top: 1px solid var(--ds-color-border-subtle); font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-card-note] [data-slot="text"] { flex: 1; min-width: 0; }
[data-ds-dashboard-grid] [data-ds-dashboard-item] > [data-ds-card] { height: 100%; }
[data-ds-dashboard-grid][data-editable] [data-ds-dashboard-item] { cursor: grab; outline: 1px dashed var(--ds-color-border-strong); outline-offset: 2px; border-radius: var(--ds-radius-lg); }
[data-ds-dashboard-grid] [data-ds-dashboard-item][data-dragging] { opacity: 0.5; }
[data-ds-dashboard-grid] [data-slot="resize"] { position: absolute; right: 2px; bottom: 2px; width: 14px; height: 14px; cursor: nwse-resize; border-right: 3px solid var(--ds-palette-primary-500); border-bottom: 3px solid var(--ds-palette-primary-500); border-radius: 0 0 4px 0; z-index: 2; }
[data-ds-dashboard-grid] [data-slot="resize"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 2px; }
`.trim()

/** 테마 프리셋 · Liquid Glass (보드 9-11, 9-16) */
export const PRESET_CSS = `
[data-ds-preset] [data-ds-card-metric] b, [data-ds-preset] [data-ds-kpi] [data-slot="value"] b, [data-ds-preset] [data-ds-page-header] h1 { font-family: var(--ds-font-display, inherit); }
[data-ds-preset="editorial"] [data-ds-card-eyebrow] { text-transform: uppercase; letter-spacing: 0.08em; }
[data-ds-preset="neon"] [data-ds-card-metric] b { color: var(--ds-tone-accent-text); }

[data-ds-liquid] {
    position: relative;
    isolation: isolate;
    border-radius: var(--_r);
    overflow: hidden;
    color: var(--ds-color-foreground-primary);
    -webkit-backdrop-filter: blur(12px) saturate(170%);
    backdrop-filter: blur(12px) saturate(170%);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.55), inset 0 -1px 0 rgba(0,0,0,.08), 0 10px 30px rgba(20,20,40,.18);
    border: 1px solid rgba(255,255,255,.45);
    background: rgba(255,255,255,.14);
}
@supports (backdrop-filter: url(#a)) {
    [data-ds-liquid] { -webkit-backdrop-filter: var(--_filter) saturate(170%); backdrop-filter: var(--_filter) saturate(170%); }
}
[data-ds-liquid]::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; background: linear-gradient(180deg, rgba(255,255,255,.28), rgba(255,255,255,0) 40%); }
[data-ds-liquid][data-legibility="auto"] { background: rgba(20,20,30,.16); color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.35); }
[data-ds-liquid][data-legibility="dark"] { background: rgba(10,10,20,.38); color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.4); }
[data-ds-liquid][data-legibility="light"] { background: rgba(255,255,255,.55); }
[data-ds-liquid] [data-slot="content"] { position: relative; z-index: 1; padding: 16px 18px; }
@media (prefers-reduced-transparency: reduce) {
    [data-ds-liquid] { -webkit-backdrop-filter: none; backdrop-filter: none; background: var(--ds-surface-card-background); color: var(--ds-color-foreground-primary); text-shadow: none; }
}
/* A · 바쁜 배경 위 컨트롤 판 (흰 42% + 흐림 10px), 글이 많은 메뉴는 72% */
[data-ds-variant="glassmorphism"][data-ds-glass-backdrop="image"] [data-ds-toolbar],
[data-ds-variant="glassmorphism"][data-ds-glass-backdrop="image"] [data-ds-segmented] { background: rgba(255,255,255,.42); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
[data-ds-variant="glassmorphism"][data-ds-glass-backdrop="image"] [data-ds-menu] { background: rgba(255,255,255,.72); }
`.trim()
