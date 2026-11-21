/** DataTable (보드 4-07). 표 기본 모양은 TABLE_CSS 를 같이 쓴다. */
const TONES = ['accent', 'success', 'warning', 'danger', 'info', 'neutral']
export const DATATABLE_CSS = `
[data-ds-datatable] { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
[data-ds-datatable] > [data-slot="toolbar"] { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
[data-ds-datatable] [data-slot="title"] { display: flex; align-items: baseline; gap: 8px; }
[data-ds-datatable] [data-slot="title"] h4 { margin: 0; font-size: 16px; font-weight: 600; color: var(--ds-color-foreground-primary); }
[data-ds-datatable] [data-slot="total"] { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-datatable] [data-slot="total"] b { color: var(--ds-color-foreground-primary); font-variant-numeric: tabular-nums; }
[data-ds-datatable] [data-slot="tools"] { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
[data-ds-datatable] > [data-slot="bulk"] {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: var(--ds-radius-md);
    background: color-mix(in oklab, var(--ds-palette-primary-500) 10%, var(--ds-surface-card-background));
    color: var(--ds-tone-accent-text);
    font-size: 13px;
}
[data-ds-datatable] [data-slot="bulk"] [data-slot="divider"] { width: 1px; height: 14px; background: color-mix(in oklab, var(--ds-palette-primary-500) 35%, transparent); }
[data-ds-datatable] > [data-slot="scroll"] {
    position: relative;
    overflow: auto;
    min-width: 0;
    background: var(--ds-surface-card-background);
    border-radius: var(--ds-radius-md);
}
[data-ds-datatable] > [data-slot="scroll"][data-variant="outlined"] { border: 1px solid var(--ds-color-border-subtle); }
[data-ds-datatable] [data-ds-table] { min-width: 100%; width: max-content; }
[data-ds-datatable] [data-ds-table] th, [data-ds-datatable] [data-ds-table] td { background-clip: padding-box; }
[data-ds-datatable] [data-ds-table] th { position: relative; vertical-align: middle; }
[data-ds-datatable] [data-ds-table][data-sticky] thead th { position: sticky; top: 0; z-index: 2; }
[data-ds-datatable] [data-ds-table] thead tr + tr th { top: var(--_th1, 37px); }
[data-ds-datatable] [data-ds-table] th[data-group-header] { border-bottom: 2px solid color-mix(in oklab, var(--ds-palette-primary-500) 40%, transparent); text-align: center; }
[data-ds-datatable] [data-slot="th"] { display: inline-flex; align-items: center; gap: 4px; }
[data-ds-datatable] th[data-align="right"] [data-slot="th"] { flex-direction: row-reverse; }
[data-ds-datatable] [data-slot="sort-btn"] {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
}
[data-ds-datatable] [data-slot="sort-btn"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 2px; border-radius: 2px; }
[data-ds-datatable] [data-slot="sort"] { display: inline-flex; opacity: 0; color: var(--ds-tone-accent-text); }
[data-ds-datatable] [data-slot="sort"][data-on], [data-ds-datatable] [data-slot="sort-btn"]:hover [data-slot="sort"] { opacity: 1; }
[data-ds-datatable] [data-slot="sort"]:not([data-on]) { color: var(--ds-color-foreground-tertiary); }
[data-ds-datatable] [data-slot="filter"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    border-radius: var(--ds-radius-xs);
    background: transparent;
    color: var(--ds-color-foreground-tertiary);
    cursor: pointer;
}
[data-ds-datatable] [data-slot="filter"]:hover { background: var(--ds-color-background-muted); color: var(--ds-color-foreground-primary); }
[data-ds-datatable] [data-slot="filter"][data-active] { color: var(--ds-tone-accent-text); }
[data-ds-datatable] [data-slot="resize"] {
    position: absolute;
    top: 0;
    right: -3px;
    bottom: 0;
    width: 6px;
    cursor: col-resize;
    z-index: 4;
}
[data-ds-datatable] [data-slot="resize"]:hover { background: color-mix(in oklab, var(--ds-palette-primary-500) 50%, transparent); }
/* 고정 열은 바탕을 채워 아래 내용이 비치지 않게 */
[data-ds-datatable] td[data-pinned], [data-ds-datatable] td[data-slot="sel"], [data-ds-datatable] td[data-slot="exp"] { background: var(--ds-surface-card-background); }
[data-ds-datatable] td[data-pinned="left"] { box-shadow: inset -1px 0 0 var(--ds-color-border-subtle); }
[data-ds-datatable] td[data-pinned="right"] { box-shadow: inset 1px 0 0 var(--ds-color-border-subtle); }
[data-ds-datatable] [data-slot="sel"], [data-ds-datatable] [data-slot="exp"] { width: 40px; padding-right: 0 !important; }
[data-ds-datatable] [data-slot="exp"] { width: 32px; padding-left: 4px !important; }
[data-ds-datatable] [data-slot="exp-btn"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: none;
    border-radius: var(--ds-radius-xs);
    background: transparent;
    color: var(--ds-color-foreground-tertiary);
    cursor: pointer;
}
[data-ds-datatable] [data-slot="exp-btn"] svg { transition: transform var(--ds-motion-duration-fast); }
${TONES.map((t) => `[data-ds-datatable] tr[data-tone="${t}"] td { background: color-mix(in oklab, var(--ds-palette-${t === 'accent' ? 'primary' : t}-500) 6%, var(--ds-surface-card-background)); }`).join('\n')}
[data-ds-datatable] tr[data-selected] td { background: color-mix(in oklab, var(--ds-palette-primary-500) 10%, var(--ds-surface-card-background)); }
[data-ds-datatable] tr[data-slot="detail"] > td {
    padding: 12px 16px 14px 72px;
    background: color-mix(in oklab, var(--ds-color-background-muted) 70%, var(--ds-surface-card-background));
}
[data-ds-datatable] tr[data-slot="group"] > td {
    padding: 0 12px;
    height: 34px;
    background: var(--ds-color-background-muted);
    font-size: 12px;
}
[data-ds-datatable] [data-slot="group-toggle"] {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    border: none;
    background: none;
    color: var(--ds-color-foreground-primary);
    font: inherit;
    cursor: pointer;
}
[data-ds-datatable] [data-slot="group-toggle"] svg { transition: transform var(--ds-motion-duration-fast); }
[data-ds-datatable] [data-slot="count"] { color: var(--ds-color-foreground-tertiary); }
[data-ds-datatable] [data-slot="subtotal"] { position: sticky; left: 220px; margin-left: 20px; color: var(--ds-color-foreground-secondary); font-variant-numeric: tabular-nums; }
[data-ds-datatable] [data-slot="group-toggle"] { position: sticky; left: 12px; }
[data-ds-datatable] td[data-editable] { cursor: text; }
[data-ds-datatable] td[data-editable]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: -2px; }
[data-ds-datatable] td[data-edited] { position: relative; }
[data-ds-datatable] td[data-edited]::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    border-style: solid;
    border-width: 0 7px 7px 0;
    border-color: transparent var(--ds-palette-warning-500) transparent transparent;
}
[data-ds-datatable] td[data-slot="empty"] { padding: 32px 16px; }
[data-ds-datatable] tfoot td { position: sticky; bottom: 0; }
[data-ds-datatable] [data-slot="loading-bar"] {
    position: sticky;
    left: 0;
    bottom: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--ds-palette-primary-500), transparent);
    background-size: 50% 100%;
    background-repeat: no-repeat;
    animation: ds-loadbar 1s linear infinite;
}
@keyframes ds-loadbar { from { background-position: -50% 0; } to { background-position: 150% 0; } }
[data-ds-datatable] > [data-slot="footer"] { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 12px; color: var(--ds-color-foreground-secondary); }
[data-ds-datatable] [data-slot="footer"] b { color: var(--ds-color-foreground-primary); }
[data-ds-datatable] [data-slot="pager"] { display: flex; align-items: center; gap: 8px; }
`.trim()
