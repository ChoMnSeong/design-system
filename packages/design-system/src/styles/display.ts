/** Badge · Tag · Avatar · StatusIndicator · Progress · Stat (보드 4-01 ~ 4-03). */
const TONES = ['accent', 'neutral', 'success', 'warning', 'danger', 'info']
const toneVars = (sel: string) =>
    TONES.map((t) => `${sel}[data-tone="${t}"] { --_c: var(--ds-tone-${t}-text); --_cs: var(--ds-tone-${t}-solid); --_on: var(--ds-tone-${t}-on); }`).join('\n')

export const DISPLAY_CSS = `
${toneVars('[data-ds-badge]')}
${toneVars('[data-ds-tag]')}
${toneVars('[data-ds-avatar]')}
${toneVars('[data-ds-status]')}
${toneVars('[data-ds-progress]')}

[data-ds-badge] {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 22px;
    padding: 0 8px;
    box-sizing: border-box;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    border: 1px solid transparent;
}
[data-ds-badge][data-size="xs"] { height: 18px; padding: 0 6px; font-size: 11px; gap: 4px; }
[data-ds-badge][data-size="sm"] { height: 20px; padding: 0 7px; }
[data-ds-badge][data-appearance="solid"] { background: var(--_cs); color: var(--_on); }
[data-ds-badge][data-appearance="soft"] { background: color-mix(in oklab, var(--_cs) 15%, transparent); color: var(--_c); }
[data-ds-badge][data-appearance="outline"] { border-color: color-mix(in oklab, var(--_cs) 50%, transparent); color: var(--_c); }
[data-ds-badge] [data-slot="dot"] { width: 6px; height: 6px; border-radius: 50%; background: var(--_cs); }
[data-ds-badge][data-appearance="solid"] [data-slot="dot"] { background: currentColor; }
[data-ds-badge] [data-slot="icon"] { display: inline-flex; }
[data-ds-badge][data-pulse]::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    box-shadow: 0 0 0 0 color-mix(in oklab, var(--_cs) 45%, transparent);
    animation: ds-pulse 1.6s ease-out infinite;
    pointer-events: none;
}
@keyframes ds-pulse {
    0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--_cs) 45%, transparent); }
    100% { box-shadow: 0 0 0 6px color-mix(in oklab, var(--_cs) 0%, transparent); }
}

[data-ds-tag] {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 26px;
    padding: 0 10px;
    box-sizing: border-box;
    max-width: 240px;
    border-radius: var(--ds-radius-sm);
    border: 1px solid transparent;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    vertical-align: middle;
}
[data-ds-tag][data-size="sm"] { height: 22px; padding: 0 8px; gap: 4px; }
[data-ds-tag][data-appearance="solid"] { background: var(--_cs); color: var(--_on); }
[data-ds-tag][data-appearance="soft"] { background: color-mix(in oklab, var(--_cs) 13%, transparent); color: var(--_c); }
[data-ds-tag][data-appearance="outline"] { background: var(--ds-surface-card-background); border-color: color-mix(in oklab, var(--_cs) 45%, transparent); color: var(--_c); }
[data-ds-tag] [data-slot="label"] { overflow: hidden; text-overflow: ellipsis; min-width: 0; }
[data-ds-tag] [data-slot="icon"] { display: inline-flex; flex-shrink: 0; }
[data-ds-tag] [data-slot="close"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-right: -4px;
    padding: 0;
    border: none;
    border-radius: 3px;
    background: transparent;
    color: inherit;
    opacity: 0.65;
    cursor: pointer;
}
[data-ds-tag] [data-slot="close"]:hover { opacity: 1; background: color-mix(in oklab, currentColor 14%, transparent); }
[data-ds-tag][role="button"] { cursor: pointer; }
[data-ds-tag][role="button"]:hover { background: color-mix(in oklab, var(--_cs) 9%, var(--ds-surface-card-background)); }
[data-ds-tag][data-selected] { box-shadow: inset 0 0 0 1.5px var(--ds-palette-primary-500); color: var(--ds-tone-accent-text); }
[data-ds-tag]:focus-visible, [data-ds-tag] [data-slot="close"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 1px; }
[data-ds-variant="brutalism"] [data-ds-tag], [data-ds-variant="brutalism"] [data-ds-badge] { border-radius: 0; border: 2px solid var(--ds-color-foreground-primary); }

[data-ds-avatar] {
    --_s: 36px;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--_s);
    height: var(--_s);
    border-radius: 50%;
    background: color-mix(in oklab, var(--_cs) 13%, var(--ds-surface-card-background));
    color: var(--_c);
    font-size: calc(var(--_s) * 0.38);
    font-weight: 700;
    line-height: 1;
    user-select: none;
}
[data-ds-avatar][data-size="xs"] { --_s: 20px; font-size: 10px; }
[data-ds-avatar][data-size="sm"] { --_s: 28px; font-size: 12px; }
[data-ds-avatar][data-size="lg"] { --_s: 44px; }
[data-ds-avatar][data-size="xl"] { --_s: 56px; }
[data-ds-avatar][data-shape="rounded"] { border-radius: var(--ds-radius-md); }
[data-ds-avatar] > img { width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }
[data-ds-avatar] [data-slot="status"] {
    position: absolute;
    right: -1px;
    bottom: -1px;
    width: 30%;
    height: 30%;
    min-width: 8px;
    min-height: 8px;
    box-sizing: border-box;
    border-radius: 50%;
    border: 2px solid var(--ds-surface-card-background);
}
[data-ds-avatar] [data-status="online"] { background: var(--ds-palette-success-500); }
[data-ds-avatar] [data-status="away"] { background: var(--ds-palette-warning-500); }
[data-ds-avatar] [data-status="busy"] { background: var(--ds-palette-danger-600); }
[data-ds-avatar] [data-status="offline"] { background: var(--ds-palette-neutral-400); }
[data-ds-avatar-group] { display: inline-flex; align-items: center; }
[data-ds-avatar-group] > [data-ds-avatar] { box-shadow: 0 0 0 2px var(--ds-surface-card-background); }
[data-ds-avatar-group] > [data-ds-avatar] + [data-ds-avatar] { margin-left: var(--_gap, -8px); }

[data-ds-status] { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ds-color-foreground-primary); white-space: nowrap; }
[data-ds-status][data-size="sm"] { font-size: 12px; gap: 5px; }
[data-ds-status] > i { position: relative; width: 8px; height: 8px; border-radius: 50%; background: var(--_cs); flex-shrink: 0; }
[data-ds-status][data-size="sm"] > i { width: 6px; height: 6px; }
[data-ds-status][data-pulse] > i::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--_cs);
    animation: ds-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
}
@keyframes ds-ping { 75%, 100% { transform: scale(2.4); opacity: 0; } }
`.trim()

export const PROGRESS_CSS = `
[data-ds-progress] { display: flex; align-items: center; gap: 10px; min-width: 0; --_cs: var(--ds-palette-primary-600); }
[data-ds-progress] [data-slot="bar"] {
    position: relative;
    flex: 1;
    display: flex;
    gap: 2px;
    height: 8px;
    border-radius: 999px;
    background: var(--ds-color-border-subtle);
    overflow: hidden;
}
[data-ds-progress] [data-slot="bar"][data-size="xs"] { height: 3px; }
[data-ds-progress] [data-slot="bar"][data-size="sm"] { height: 4px; }
[data-ds-progress] [data-slot="bar"][data-size="lg"] { height: 12px; }
[data-ds-progress] [data-slot="fill"] {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    background: var(--_cs);
    transition: width 300ms var(--ds-motion-easing-ease-out);
}
[data-ds-progress][data-appearance="bar"] [data-slot="fill"] { border-radius: inherit; }
${['accent', 'neutral', 'success', 'warning', 'danger', 'info'].map((t) => `[data-ds-progress] [data-slot="fill"][data-tone="${t}"] { background: var(--ds-tone-${t}-solid); }`).join('\n')}
[data-ds-progress][data-indeterminate] [data-slot="fill"] { width: 35%; animation: ds-indeterminate 1.2s ease-in-out infinite; }
@keyframes ds-indeterminate { 0% { transform: translateX(-110%); } 100% { transform: translateX(310%); } }
[data-ds-progress] [data-slot="inside"] { padding-right: 6px; font-size: 10px; font-weight: 700; color: var(--_on); font-family: var(--ds-typography-font-family-mono); }
[data-ds-progress] [data-slot="end"] { flex-shrink: 0; min-width: 40px; text-align: right; font-family: var(--ds-typography-font-family-mono); font-size: 12px; font-weight: 600; color: var(--ds-color-foreground-secondary); }
[data-ds-progress] [data-slot="target"] { position: absolute; top: -3px; bottom: -3px; width: 2px; margin-left: -1px; background: var(--ds-color-foreground-primary); border-radius: 1px; }
[data-ds-progress]:has([data-slot="target"]) [data-slot="bar"] { overflow: visible; }
[data-ds-progress][data-appearance="circle"] { position: relative; display: inline-flex; justify-content: center; flex-shrink: 0; }
[data-ds-progress][data-appearance="circle"] [data-slot="track"] { stroke: var(--ds-color-border-subtle); }
[data-ds-progress][data-appearance="circle"] [data-slot="fill"] { stroke: var(--_cs); transition: stroke-dashoffset 300ms var(--ds-motion-easing-ease-out); }
[data-ds-progress][data-appearance="circle"][data-indeterminate] svg { animation: ds-spin 1s linear infinite; }
[data-ds-progress][data-appearance="circle"] [data-slot="center"] { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--ds-typography-font-family-mono); font-size: 12px; font-weight: 700; }
[data-ds-progress][data-appearance="circle"][data-size="lg"] [data-slot="center"] { font-size: 15px; }

[data-ds-stat] { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
[data-ds-stat][data-appearance="card"] {
    padding: 16px 18px;
    background: var(--ds-surface-card-background);
    border: var(--ds-surface-card-border);
    border-radius: var(--ds-surface-card-radius);
    box-shadow: var(--ds-surface-card-shadow);
    -webkit-backdrop-filter: var(--ds-surface-card-backdrop-filter);
    backdrop-filter: var(--ds-surface-card-backdrop-filter);
}
[data-ds-stat] [data-slot="head"] { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
[data-ds-stat] [data-slot="label"] { font-size: 13px; font-weight: 500; color: var(--ds-color-foreground-tertiary); }
[data-ds-stat] [data-slot="icon"] { display: inline-flex; color: var(--ds-color-foreground-tertiary); }
[data-ds-stat] [data-slot="value"] { font-family: var(--ds-typography-font-family-mono); font-size: 30px; font-weight: 600; line-height: 1.15; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; color: var(--ds-color-foreground-primary); }
[data-ds-stat][data-size="sm"] [data-slot="value"] { font-size: 22px; }
[data-ds-stat][data-size="lg"] [data-slot="value"] { font-size: 38px; }
[data-ds-stat] [data-slot="foot"] { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
[data-ds-stat] [data-slot="helper"] { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-stat] [data-slot="target"] { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--ds-color-foreground-tertiary); font-family: var(--ds-typography-font-family-mono); }
[data-ds-stat] [data-slot="target"] > [data-ds-progress] { flex: 1; }
[data-ds-stat] [data-slot="spark"] { width: 100%; height: 28px; stroke: var(--ds-palette-primary-500); fill: var(--ds-palette-primary-500); }
[data-ds-stat] [data-slot="spark"] polyline { fill: none; }
[data-ds-skeleton] {
    display: block;
    border-radius: var(--ds-radius-sm);
    background: linear-gradient(90deg, var(--ds-color-background-muted) 25%, color-mix(in oklab, var(--ds-color-background-muted) 50%, var(--ds-surface-card-background)) 50%, var(--ds-color-background-muted) 75%);
    background-size: 200% 100%;
    animation: ds-shimmer 1.4s ease-in-out infinite;
}
@keyframes ds-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`.trim()

export const TABLE_CSS = `
[data-ds-table-wrap] { min-width: 0; overflow-x: auto; }
[data-ds-table-wrap][data-variant="outlined"] {
    background: var(--ds-surface-card-background);
    border: 1px solid var(--ds-color-border-subtle);
    border-radius: var(--ds-radius-md);
}
[data-ds-table-wrap][data-variant="underline"] { border-top: 1px solid var(--ds-color-border-default); }
[data-ds-table] { --_py: 10px; --_px: 14px; width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px; color: var(--ds-color-foreground-primary); font-variant-numeric: tabular-nums; }
[data-ds-table][data-density="compact"] { --_py: 6px; --_px: 10px; font-size: 12px; }
[data-ds-table][data-density="comfortable"] { --_py: 14px; --_px: 16px; font-size: 14px; }
[data-ds-table] th {
    padding: var(--_py) var(--_px);
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: var(--ds-color-foreground-tertiary);
    background: var(--ds-color-background-muted);
    border-bottom: 1px solid var(--ds-color-border-default);
    white-space: nowrap;
}
[data-ds-table-wrap][data-variant="underline"] [data-ds-table] th,
[data-ds-table-wrap][data-variant="ghost"] [data-ds-table] th { background: transparent; }
[data-ds-table] td { padding: var(--_py) var(--_px); border-bottom: 1px solid var(--ds-color-border-subtle); }
[data-ds-table-wrap][data-variant="ghost"] [data-ds-table] td { border-bottom-color: transparent; }
[data-ds-table] tbody tr:last-child td { border-bottom: none; }
[data-ds-table] [data-align="right"] { text-align: right; }
[data-ds-table] [data-align="center"] { text-align: center; }
[data-ds-table] th [data-slot="sort"] { display: inline-flex; vertical-align: -2px; margin-left: 4px; color: var(--ds-tone-accent-text); }
[data-ds-table] th[aria-sort] { color: var(--ds-color-foreground-primary); }
[data-ds-table][data-striped] tbody tr:nth-child(even) td { background: color-mix(in oklab, var(--ds-color-background-muted) 60%, transparent); }
[data-ds-table][data-hoverable] tbody tr:hover td { background: color-mix(in oklab, var(--ds-palette-primary-500) 6%, transparent); }
[data-ds-table] tbody tr[data-selected] td { background: color-mix(in oklab, var(--ds-palette-primary-500) 10%, transparent); }
[data-ds-table][data-bordered] th + th, [data-ds-table][data-bordered] td + td { border-left: 1px solid var(--ds-color-border-subtle); }
[data-ds-table][data-sticky] thead th { position: sticky; top: 0; z-index: 1; }
[data-ds-table] tfoot td { font-weight: 600; border-top: 1px solid var(--ds-color-border-default); border-bottom: none; background: var(--ds-color-background-muted); }

[data-ds-descriptions-wrap] { min-width: 0; }
[data-ds-descriptions-wrap] [data-slot="title"] { margin-bottom: 10px; font-size: 14px; font-weight: 600; }
[data-ds-descriptions] { display: grid; grid-template-columns: repeat(var(--_cols), minmax(0, 1fr)); gap: 12px 24px; margin: 0; font-size: 14px; }
[data-ds-descriptions][data-size="sm"] { font-size: 13px; gap: 8px 20px; }
[data-ds-descriptions] [data-slot="item"] { display: grid; grid-template-columns: var(--_lw) minmax(0, 1fr); gap: 12px; min-width: 0; }
[data-ds-descriptions] dt { font-size: 13px; font-weight: 600; color: var(--ds-color-foreground-tertiary); }
[data-ds-descriptions] dd { margin: 0; color: var(--ds-color-foreground-primary); overflow-wrap: anywhere; }
[data-ds-descriptions][data-layout="vertical"] [data-slot="item"] { grid-template-columns: 1fr; gap: 4px; }
[data-ds-descriptions][data-layout="vertical"] dt { font-size: 12px; }
[data-ds-descriptions][data-bordered] { gap: 0; border: 1px solid var(--ds-color-border-default); border-radius: var(--ds-radius-md); overflow: hidden; }
[data-ds-descriptions][data-bordered] [data-slot="item"] { gap: 0; border-bottom: 1px solid var(--ds-color-border-subtle); border-right: 1px solid var(--ds-color-border-subtle); margin-right: -1px; margin-bottom: -1px; }
[data-ds-descriptions][data-bordered] dt { padding: 9px 12px; background: var(--ds-color-background-muted); border-right: 1px solid var(--ds-color-border-subtle); }
[data-ds-descriptions][data-bordered] dd { padding: 9px 12px; }

[data-ds-timeline] { display: flex; flex-direction: column; margin: 0; padding: 0; list-style: none; }
${['accent', 'neutral', 'success', 'warning', 'danger', 'info'].map((t) => `[data-ds-timeline] [data-tone="${t}"] { --_cs: var(--ds-tone-${t}-solid); }`).join('\n')}
[data-ds-timeline] [data-slot="item"] { display: grid; grid-template-columns: 52px 16px minmax(0, 1fr); gap: 10px; padding-bottom: 14px; }
[data-ds-timeline] [data-slot="item"]:last-child { padding-bottom: 0; }
[data-ds-timeline] [data-slot="time"] { font-family: var(--ds-typography-font-family-mono); font-size: 12px; color: var(--ds-color-foreground-tertiary); padding-top: 1px; }
[data-ds-timeline] [data-slot="rail"] { display: flex; flex-direction: column; align-items: center; }
[data-ds-timeline] [data-slot="rail"] i {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 10px;
    height: 10px;
    margin-top: 4px;
    border-radius: 50%;
    background: var(--_cs, var(--ds-palette-primary-600));
    color: #fff;
    flex-shrink: 0;
}
[data-ds-timeline] [data-slot="rail"] i:not(:empty) { width: 18px; height: 18px; margin-top: 0; }
[data-ds-timeline] [data-slot="rail"] s { flex: 1; width: 2px; margin-top: 4px; background: var(--ds-color-border-subtle); text-decoration: none; }
[data-ds-timeline] [data-pending] [data-slot="rail"] i { background: none; border: 2px solid var(--ds-color-border-default); box-sizing: border-box; }
[data-ds-timeline] [data-pending] [data-slot="body"] { color: var(--ds-color-foreground-tertiary); }
[data-ds-timeline] [data-slot="body"] { display: flex; flex-direction: column; gap: 2px; font-size: 13px; min-width: 0; }
[data-ds-timeline] [data-slot="body"] b { font-weight: 600; }
[data-ds-timeline] [data-slot="desc"] { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-timeline][data-mode="right"] [data-slot="item"] { grid-template-columns: minmax(0, 1fr) 16px 52px; }
[data-ds-timeline][data-mode="right"] [data-slot="time"] { order: 3; }
[data-ds-timeline][data-mode="right"] [data-slot="body"] { order: 1; text-align: right; align-items: flex-end; }
[data-ds-timeline][data-mode="right"] [data-slot="rail"] { order: 2; }
[data-ds-timeline][data-mode="alternate"] [data-slot="item"] { grid-template-columns: minmax(0, 1fr) 16px minmax(0, 1fr); }
[data-ds-timeline][data-mode="alternate"] [data-side="left"] [data-slot="time"] { order: 3; text-align: left; }
[data-ds-timeline][data-mode="alternate"] [data-side="left"] [data-slot="body"] { order: 1; text-align: right; align-items: flex-end; }
[data-ds-timeline][data-mode="alternate"] [data-side="left"] [data-slot="rail"] { order: 2; }
[data-ds-timeline][data-mode="alternate"] [data-side="right"] [data-slot="time"] { text-align: right; }
`.trim()

export const TREE_CSS = `
[data-ds-tree] { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--ds-color-foreground-primary); min-width: 0; }
[data-ds-tree] [data-slot="search"] {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 28px;
    padding: 0 10px;
    border: 1px solid var(--ds-color-border-default);
    border-radius: var(--ds-radius-sm);
    background: var(--ds-surface-card-background);
    color: var(--ds-color-foreground-tertiary);
}
[data-ds-tree] [data-slot="search"]:focus-within { border-color: var(--ds-palette-primary-500); box-shadow: 0 0 0 3px var(--ds-color-focus-ring); }
[data-ds-tree] [data-slot="search"] input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; color: var(--ds-color-foreground-primary); font: inherit; font-size: 12px; }
[data-ds-tree] [role="tree"] { display: flex; flex-direction: column; outline: none; }
[data-ds-tree] [data-slot="row"] {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    padding-right: 8px;
    box-sizing: border-box;
    border-radius: var(--ds-radius-sm);
    cursor: pointer;
    outline: none;
    flex-shrink: 0;
}
[data-ds-tree] [data-slot="row"]:hover { background: var(--ds-color-background-muted); }
[data-ds-tree] [data-slot="row"]:focus-visible { box-shadow: inset 0 0 0 2px var(--ds-palette-primary-500); }
[data-ds-tree] [data-slot="row"][data-selected] { background: color-mix(in oklab, var(--ds-palette-primary-500) 12%, transparent); color: var(--ds-tone-accent-text); font-weight: 600; }
[data-ds-tree] [data-slot="row"][aria-disabled="true"] { color: var(--ds-color-foreground-tertiary); cursor: not-allowed; }
[data-ds-tree] [data-slot="row"][data-drop="inside"] { box-shadow: inset 0 0 0 2px var(--ds-palette-primary-500); }
[data-ds-tree] [data-slot="row"][data-drop="before"]::before,
[data-ds-tree] [data-slot="row"][data-drop="after"]::after { content: ""; position: absolute; left: 0; right: 0; height: 2px; background: var(--ds-palette-primary-500); }
[data-ds-tree] [data-slot="row"][data-drop="before"]::before { top: -1px; }
[data-ds-tree] [data-slot="row"][data-drop="after"]::after { bottom: -1px; }
[data-ds-tree] [data-slot="twisty"] { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; flex-shrink: 0; color: var(--ds-color-foreground-tertiary); }
[data-ds-tree] [data-slot="twisty"] svg { transition: transform var(--ds-motion-duration-fast); }
[data-ds-tree] [data-slot="icon"] { display: inline-flex; color: var(--ds-color-foreground-tertiary); flex-shrink: 0; }
[data-ds-tree] [data-slot="label"] { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
[data-ds-tree] [data-slot="badge"] { margin-left: auto; font-size: 12px; font-family: var(--ds-typography-font-family-mono); color: var(--ds-color-foreground-tertiary); font-weight: 500; }
[data-ds-tree] [data-slot="actions"] { display: inline-flex; opacity: 0; }
[data-ds-tree] [data-slot="row"]:hover [data-slot="actions"],
[data-ds-tree] [data-slot="row"]:focus-within [data-slot="actions"],
[data-ds-tree] [data-slot="row"][data-selected] [data-slot="actions"] { opacity: 1; }
[data-ds-tree] [data-slot="empty"] { padding: 12px; font-size: 13px; color: var(--ds-color-foreground-tertiary); }
`.trim()
