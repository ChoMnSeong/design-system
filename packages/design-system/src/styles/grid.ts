/** DataGrid. */
const TONES = ['accent', 'success', 'warning', 'danger', 'info', 'neutral']
export const GRID_CSS = `
[data-ds-grid] { display: flex; flex-direction: column; gap: 8px; min-width: 0; font-size: 13px; color: var(--ds-color-foreground-primary); }
[data-ds-grid] > [data-slot="top"] { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
[data-ds-grid] > [data-slot="top"] > [data-slot="spacer"] { flex: 1; }
[data-ds-grid] [data-slot="group-panel"] {
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap; min-height: 34px; padding: 4px 10px;
    border: 1px dashed var(--ds-color-border-subtle); border-radius: var(--ds-radius-md); color: var(--ds-color-foreground-tertiary); font-size: 12px;
}
[data-ds-grid] [data-slot="group-panel"][data-over] { border-color: var(--ds-palette-primary-500); background: color-mix(in oklab, var(--ds-palette-primary-500) 6%, transparent); }
[data-ds-grid] [data-slot="chip"] {
    display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 4px 0 8px; border-radius: 999px;
    background: color-mix(in oklab, var(--ds-palette-primary-500) 12%, var(--ds-surface-card-background)); color: var(--ds-tone-accent-text); font-weight: 500;
}
[data-ds-grid] [data-slot="chip"] button { all: unset; cursor: pointer; width: 16px; height: 16px; display: grid; place-items: center; border-radius: 999px; }
[data-ds-grid] [data-slot="chip"] button:hover { background: color-mix(in oklab, currentColor 15%, transparent); }
[data-ds-grid] > [data-slot="body"] { display: flex; min-height: 0; border: 1px solid var(--ds-color-border-subtle); border-radius: var(--ds-radius-md); overflow: hidden; background: var(--ds-surface-card-background); }
[data-ds-grid] [data-slot="scroll"] { position: relative; flex: 1; overflow: auto; min-width: 0; outline: none; }
[data-ds-grid] table { border-collapse: separate; border-spacing: 0; table-layout: fixed; width: max-content; min-width: 100%; }
[data-ds-grid] th, [data-ds-grid] td {
    height: var(--_rh, 36px); padding: 0 10px; border-bottom: 1px solid var(--ds-color-border-subtle); border-right: 1px solid color-mix(in oklab, var(--ds-color-border-subtle) 60%, transparent);
    background: var(--ds-surface-card-background); background-clip: padding-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; font-variant-numeric: tabular-nums; box-sizing: border-box;
}
[data-ds-grid] thead th { position: sticky; z-index: 3; background: var(--ds-color-background-muted); font-weight: 600; font-size: 12px; color: var(--ds-color-foreground-secondary); user-select: none; }
[data-ds-grid] thead th[data-group] { text-align: center; border-bottom: 2px solid color-mix(in oklab, var(--ds-palette-primary-500) 40%, transparent); }
[data-ds-grid] thead tr[data-floating] th { font-weight: 400; padding: 3px 6px; }
[data-ds-grid] thead tr[data-floating] input { width: 100%; height: 24px; box-sizing: border-box; border: 1px solid var(--ds-color-border-subtle); border-radius: var(--ds-radius-xs); padding: 0 6px; font: inherit; font-size: 12px; background: var(--ds-surface-card-background); color: inherit; }
[data-ds-grid] [data-pin] { position: sticky; z-index: 1; }
[data-ds-grid] thead [data-pin] { z-index: 4; }
[data-ds-grid] [data-pin-edge="left"] { box-shadow: 4px 0 6px -4px rgb(0 0 0 / .18); }
[data-ds-grid] [data-pin-edge="right"] { box-shadow: -4px 0 6px -4px rgb(0 0 0 / .18); }
[data-ds-grid] [data-slot="th"] { display: flex; align-items: center; gap: 4px; }
[data-ds-grid] [data-slot="th"] > span:first-child { overflow: hidden; text-overflow: ellipsis; }
[data-ds-grid] th[data-sortable] { cursor: pointer; }
[data-ds-grid] th[data-sortable]:hover { color: var(--ds-color-foreground-primary); }
[data-ds-grid] [data-slot="sort"] { display: inline-flex; align-items: center; gap: 1px; color: var(--ds-tone-accent-text); font-size: 11px; }
[data-ds-grid] [data-slot="sort"] sub { font-size: 9px; }
[data-ds-grid] [data-slot="col-menu"] { all: unset; margin-left: auto; width: 20px; height: 20px; display: grid; place-items: center; border-radius: var(--ds-radius-xs); opacity: 0; cursor: pointer; }
[data-ds-grid] th:hover [data-slot="col-menu"], [data-ds-grid] [data-slot="col-menu"][aria-expanded="true"] { opacity: 1; }
[data-ds-grid] [data-slot="col-menu"]:hover { background: color-mix(in oklab, currentColor 12%, transparent); }
[data-ds-grid] [data-slot="filtered"] { width: 6px; height: 6px; border-radius: 999px; background: var(--ds-palette-primary-500); }
[data-ds-grid] [data-slot="resize"] { position: absolute; top: 0; right: -3px; width: 7px; height: 100%; cursor: col-resize; z-index: 5; }
[data-ds-grid] [data-slot="resize"]:hover { background: color-mix(in oklab, var(--ds-palette-primary-500) 40%, transparent); }
[data-ds-grid] tbody tr:hover td { background: color-mix(in oklab, var(--ds-color-background-muted) 70%, var(--ds-surface-card-background)); }
[data-ds-grid] td[data-align="right"], [data-ds-grid] th[data-align="right"] { text-align: right; }
[data-ds-grid] th[data-align="right"] [data-slot="th"] { flex-direction: row-reverse; }
[data-ds-grid] th[data-align="right"] [data-slot="col-menu"] { margin-left: 0; margin-right: auto; }
[data-ds-grid] td[data-align="center"] { text-align: center; }
[data-ds-grid] td[data-selected] { background: color-mix(in oklab, var(--ds-palette-primary-500) 12%, var(--ds-surface-card-background)) !important; }
[data-ds-grid] td[data-focus] { box-shadow: inset 0 0 0 2px var(--ds-palette-primary-500); }
[data-ds-grid] td[data-dirty] { background-image: linear-gradient(135deg, var(--ds-palette-warning-500) 6px, transparent 6px); }
[data-ds-grid] td[data-invalid] { box-shadow: inset 0 0 0 2px var(--ds-palette-danger-500); }
[data-ds-grid] td[data-editable] { cursor: cell; }
[data-ds-grid] td[data-editing] { padding: 0; }
[data-ds-grid] td[data-editing] input, [data-ds-grid] td[data-editing] select { width: 100%; height: 100%; box-sizing: border-box; border: 0; outline: 2px solid var(--ds-palette-primary-500); outline-offset: -2px; padding: 0 9px; font: inherit; background: var(--ds-surface-card-background); color: inherit; text-align: inherit; }
[data-ds-grid] [data-slot="fill"] { position: absolute; right: -1px; bottom: -1px; width: 7px; height: 7px; background: var(--ds-palette-primary-500); border: 1px solid var(--ds-surface-card-background); cursor: crosshair; }
[data-ds-grid] td:has([data-slot="fill"]) { overflow: visible; position: relative; }
[data-ds-grid] tr[data-kind="group"] td { font-weight: 600; background: color-mix(in oklab, var(--ds-color-background-muted) 60%, var(--ds-surface-card-background)); }
[data-ds-grid] [data-slot="toggle"] { all: unset; cursor: pointer; width: 18px; height: 18px; display: inline-grid; place-items: center; margin-right: 4px; border-radius: var(--ds-radius-xs); vertical-align: middle; transition: transform var(--ds-motion-duration-fast, 120ms); }
[data-ds-grid] [data-slot="toggle"][aria-expanded="true"] { transform: rotate(90deg); }
[data-ds-grid] [data-slot="toggle"]:hover { background: color-mix(in oklab, currentColor 12%, transparent); }
[data-ds-grid] [data-slot="count"] { margin-left: 6px; font-weight: 400; color: var(--ds-color-foreground-tertiary); }
[data-ds-grid] tr[data-kind="detail"] > td { padding: 12px 16px 12px 40px; white-space: normal; background: var(--ds-color-background-muted); }
[data-ds-grid] tfoot td { position: sticky; bottom: 0; z-index: 2; font-weight: 600; background: var(--ds-color-background-muted); border-top: 1px solid var(--ds-color-border-subtle); }
[data-ds-grid] [data-slot="side"] { width: 220px; flex: none; border-left: 1px solid var(--ds-color-border-subtle); display: flex; flex-direction: column; overflow: auto; }
[data-ds-grid] [data-slot="side-tabs"] { display: flex; border-bottom: 1px solid var(--ds-color-border-subtle); }
[data-ds-grid] [data-slot="side-tabs"] button { all: unset; flex: 1; text-align: center; padding: 8px 0; cursor: pointer; font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-grid] [data-slot="side-tabs"] button[aria-selected="true"] { color: var(--ds-tone-accent-text); box-shadow: inset 0 -2px var(--ds-palette-primary-500); font-weight: 600; }
[data-ds-grid] [data-slot="side-body"] { padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
[data-ds-grid] [data-slot="side-body"] label { display: flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer; }
[data-ds-grid] [data-slot="side-body"] h5 { margin: 6px 0 0; font-size: 11px; font-weight: 600; color: var(--ds-color-foreground-tertiary); text-transform: uppercase; letter-spacing: .04em; }
[data-ds-grid] [data-slot="status"] { display: flex; gap: 16px; align-items: center; padding: 6px 12px; border: 1px solid var(--ds-color-border-subtle); border-radius: var(--ds-radius-md); font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-grid] [data-slot="status"] b { color: var(--ds-color-foreground-primary); font-variant-numeric: tabular-nums; font-weight: 600; margin-left: 4px; }
[data-ds-grid] [data-slot="status"] [data-slot="spacer"] { flex: 1; }
[data-ds-grid] [data-slot="overlay"] { position: absolute; inset: 0; display: grid; place-items: center; z-index: 6; background: color-mix(in oklab, var(--ds-surface-card-background) 70%, transparent); }
[data-ds-grid] [data-slot="state"] { padding: 48px 16px; text-align: center; color: var(--ds-color-foreground-tertiary); white-space: normal; }
[data-ds-grid] [data-slot="state"][data-tone="danger"] { color: var(--ds-tone-danger-text); }
[data-ds-grid] [data-slot="bar"] { display: flex; align-items: center; gap: 6px; }
[data-ds-grid] [data-slot="bar"] > i { flex: 1; min-width: 24px; height: 6px; border-radius: 999px; background: var(--ds-color-background-muted); overflow: hidden; }
[data-ds-grid] [data-slot="bar"] > i > i { display: block; height: 100%; border-radius: inherit; background: var(--_tone, var(--ds-palette-primary-500)); }
[data-ds-grid] [data-slot="bar"] > span { flex: none; min-width: 40px; text-align: right; }
[data-ds-grid] [data-slot="delta"][data-good] { color: var(--ds-tone-success-text); }
[data-ds-grid] [data-slot="delta"][data-bad] { color: var(--ds-tone-danger-text); }
[data-ds-grid] [data-slot="adv"] { display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; border: 1px solid var(--ds-color-border-subtle); border-radius: var(--ds-radius-md); }
[data-ds-grid] [data-slot="adv"] > div { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
[data-ds-grid] [data-slot="adv"] select, [data-ds-grid] [data-slot="adv"] input { height: 28px; border: 1px solid var(--ds-color-border-subtle); border-radius: var(--ds-radius-xs); padding: 0 6px; font: inherit; font-size: 12px; background: var(--ds-surface-card-background); color: inherit; }
[data-ds-grid] [data-slot="error-tip"] { position: absolute; z-index: 7; padding: 4px 8px; border-radius: var(--ds-radius-xs); background: var(--ds-palette-danger-500); color: #fff; font-size: 11px; pointer-events: none; }
${TONES.map((t) => `[data-ds-grid] td[data-tone="${t}"] { background: color-mix(in oklab, var(--ds-tone-${t}-text) 12%, var(--ds-surface-card-background)); color: var(--ds-tone-${t}-text); }`).join('\n')}
`
