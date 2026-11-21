/** 차트 공통 (보드 8-01 ~ 8-09) */
export const CHART_CSS = `
[data-ds-chart] { display: flex; flex-direction: column; gap: 8px; min-width: 0; width: 100%; font-variant-numeric: tabular-nums; }
[data-ds-chart][data-empty] { align-items: center; justify-content: center; font-size: 13px; color: var(--ds-color-foreground-tertiary); border: 1px dashed var(--ds-color-border-default); border-radius: var(--ds-radius-md); }
[data-ds-chart] svg { display: block; overflow: visible; }
[data-ds-chart] [data-slot="grid"] { stroke: var(--ds-color-border-subtle); }
[data-ds-chart] [data-slot="axis"] { stroke: var(--ds-color-border-default); }
[data-ds-chart] [data-slot="zero"] { stroke: var(--ds-color-foreground-tertiary); stroke-width: 1; }
[data-ds-chart] [data-slot="tick"] { font-size: 12px; fill: var(--ds-color-foreground-tertiary); font-family: var(--ds-typography-font-family-mono); }
[data-ds-chart] [data-slot="value"] { font-size: 11px; font-weight: 600; fill: var(--ds-color-foreground-secondary); font-family: var(--ds-typography-font-family-mono); }
[data-ds-chart] [data-slot="ref-label"], [data-ds-chart] [data-slot="band-label"] { font-size: 12px; font-weight: 600; }
[data-ds-chart] [data-slot="hover-band"] { fill: var(--ds-color-foreground-primary); opacity: 0.04; pointer-events: none; }
[data-ds-chart] [data-slot="bar"] { transition: opacity var(--ds-motion-duration-fast); }
[data-ds-chart] [data-slot="legend"] { display: flex; flex-wrap: wrap; gap: 4px 12px; }
[data-ds-chart] [data-slot="legend-item"] {
    display: inline-flex; align-items: center; gap: 6px; padding: 2px 4px;
    border: none; border-radius: var(--ds-radius-xs); background: none;
    color: var(--ds-color-foreground-secondary); font: inherit; font-size: 12px; cursor: pointer;
}
[data-ds-chart] [data-slot="legend-item"][aria-pressed="false"] { opacity: 0.45; text-decoration: line-through; }
[data-ds-chart] [data-slot="legend-item"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); }
[data-ds-chart] [data-slot="swatch"] { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
[data-ds-chart] [data-slot="swatch"][data-type="line"] { height: 3px; border-radius: 2px; }
[data-ds-chart] [data-slot="tooltip"] {
    position: absolute; z-index: 2; display: flex; flex-direction: column; gap: 3px;
    min-width: 120px; padding: 8px 10px; pointer-events: none;
    border-radius: var(--ds-radius-md); background: var(--ds-surface-overlay-background); border: var(--ds-surface-overlay-border);
    box-shadow: var(--ds-surface-overlay-shadow); font-size: 12px; color: var(--ds-color-foreground-primary);
    -webkit-backdrop-filter: var(--ds-surface-overlay-backdrop-filter); backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
}
[data-ds-chart] [data-slot="tooltip"] b { font-weight: 600; margin-bottom: 2px; }
[data-ds-chart] [data-slot="tooltip"] span { display: flex; align-items: center; gap: 6px; color: var(--ds-color-foreground-secondary); }
[data-ds-chart] [data-slot="tooltip"] i { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
[data-ds-chart] [data-slot="tooltip"] em { margin-left: auto; padding-left: 12px; font-style: normal; font-weight: 600; color: var(--ds-color-foreground-primary); font-family: var(--ds-typography-font-family-mono); }
[data-ds-chart] [data-slot="brush"] { position: relative; height: 28px; margin: 0 16px 0 48px; border-radius: var(--ds-radius-sm); background: var(--ds-color-background-muted); }
[data-ds-chart] [data-slot="brush-win"] { position: absolute; top: 0; bottom: 0; background: color-mix(in oklab, var(--ds-palette-primary-500) 18%, transparent); border: 1px solid var(--ds-palette-primary-500); border-radius: var(--ds-radius-sm); cursor: grab; }
[data-ds-chart] [data-slot="brush-handle"] { position: absolute; top: 4px; bottom: 4px; left: -4px; width: 8px; border-radius: 3px; background: var(--ds-palette-primary-600); cursor: ew-resize; }
[data-ds-chart] [data-slot="brush-handle"][data-end] { left: auto; right: -4px; }
[data-ds-chart] [data-slot="brush-handle"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 2px; }
`.trim()

export const PIE_CSS = `
[data-ds-pie] { display: inline-flex; align-items: center; gap: 20px; }
[data-ds-pie][data-legend="bottom"] { flex-direction: column; }
[data-ds-pie] [data-slot="plot"] { position: relative; flex-shrink: 0; }
[data-ds-pie] [data-slot="slice"] { transition: opacity var(--ds-motion-duration-fast), d var(--ds-motion-duration-fast); stroke: var(--ds-surface-card-background); stroke-width: 1; }
[data-ds-pie] [data-slot="slice-label"] { font-size: 11px; font-weight: 700; fill: #fff; pointer-events: none; font-family: var(--ds-typography-font-family-mono); }
[data-ds-pie] [data-slot="center"] { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
[data-ds-pie] [data-slot="center"] b { font-size: 20px; font-weight: 700; color: var(--ds-color-foreground-primary); font-variant-numeric: tabular-nums; }
[data-ds-pie] [data-slot="center"] span { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-pie] [data-slot="tooltip"] { position: absolute; left: 50%; top: -8px; transform: translate(-50%, -100%); display: flex; flex-direction: column; gap: 2px; padding: 6px 10px; border-radius: var(--ds-radius-md); background: var(--ds-surface-overlay-background); border: var(--ds-surface-overlay-border); box-shadow: var(--ds-surface-overlay-shadow); font-size: 12px; white-space: nowrap; pointer-events: none; }
[data-ds-pie] [data-slot="legend"] { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; font-size: 13px; min-width: 140px; }
[data-ds-pie][data-legend="bottom"] [data-slot="legend"] { flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 4px 14px; }
[data-ds-pie] [data-slot="legend"] li { display: flex; align-items: center; gap: 8px; color: var(--ds-color-foreground-secondary); }
[data-ds-pie] [data-slot="legend"] li[data-active] { color: var(--ds-color-foreground-primary); font-weight: 600; }
[data-ds-pie] [data-slot="legend"] i { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
[data-ds-pie] [data-slot="legend"] em { margin-left: auto; padding-left: 12px; font-style: normal; font-family: var(--ds-typography-font-family-mono); font-size: 12px; }

[data-ds-gauge] { position: relative; display: inline-flex; flex-direction: column; align-items: center; }
[data-ds-gauge] [data-slot="center"] { position: absolute; left: 0; right: 0; display: flex; flex-direction: column; align-items: center; gap: 2px; }
[data-ds-gauge] [data-slot="center"] b { font-weight: 700; font-variant-numeric: tabular-nums; color: var(--ds-color-foreground-primary); line-height: 1.1; }
[data-ds-gauge] [data-slot="center"] span { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
`.trim()
