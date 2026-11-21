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

export const INDUSTRIAL_CSS = `
[data-ds-control-chart] { display: flex; flex-direction: column; gap: 8px; }
[data-ds-control-chart] [data-slot="violations"] { margin: 0; padding: 8px 12px; list-style: none; border-radius: var(--ds-radius-md); background: color-mix(in oklab, var(--ds-palette-danger-500) 8%, var(--ds-surface-card-background)); font-size: 12px; color: var(--ds-color-foreground-secondary); display: flex; flex-direction: column; gap: 2px; }
[data-ds-control-chart] [data-slot="violations"] b { color: var(--ds-tone-danger-text); font-weight: 600; }

[data-ds-bullet] { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 10px; font-size: 13px; }
[data-ds-bullet] [data-slot="label"] { min-width: 72px; color: var(--ds-color-foreground-secondary); }
[data-ds-bullet] [data-slot="track"] { position: relative; height: 18px; border-radius: 3px; background: var(--ds-color-background-muted); overflow: hidden; }
[data-ds-bullet] [data-slot="range"] { position: absolute; top: 0; bottom: 0; background: var(--ds-color-foreground-primary); }
[data-ds-bullet] [data-slot="range"][data-shade="0.22"] { opacity: 0.16; }
[data-ds-bullet] [data-slot="range"][data-shade="0.13"] { opacity: 0.09; }
[data-ds-bullet] [data-slot="range"][data-shade="0.06"] { opacity: 0.04; }
[data-ds-bullet] [data-slot="bar"] { position: absolute; left: 0; top: 5px; height: 8px; border-radius: 2px; }
[data-ds-bullet] [data-slot="target"] { position: absolute; top: 2px; bottom: 2px; width: 2px; margin-left: -1px; background: var(--ds-color-foreground-primary); }
[data-ds-bullet] [data-slot="value"] { font-family: var(--ds-typography-font-family-mono); font-weight: 600; font-size: 12px; white-space: nowrap; }
[data-ds-bullet] [data-slot="value"] small { font-weight: 400; color: var(--ds-color-foreground-tertiary); }
[data-ds-bullet][data-orientation="vertical"] { grid-template-columns: auto; justify-items: center; }
[data-ds-bullet][data-orientation="vertical"] [data-slot="track"] { width: 18px; height: 140px; }
[data-ds-bullet][data-orientation="vertical"] [data-slot="range"] { left: 0; right: 0; top: auto; }
[data-ds-bullet][data-orientation="vertical"] [data-slot="bar"] { top: auto; bottom: 0; left: 5px; width: 8px; height: auto; }
[data-ds-bullet][data-orientation="vertical"] [data-slot="target"] { left: 2px; right: 2px; top: auto; width: auto; height: 2px; margin: 0 0 -1px; }

[data-ds-heatmap] { display: flex; flex-direction: column; gap: 8px; overflow-x: auto; }
[data-ds-heatmap] table { border-collapse: separate; border-spacing: 2px; font-size: 12px; font-variant-numeric: tabular-nums; }
[data-ds-heatmap] th { font-weight: 500; color: var(--ds-color-foreground-tertiary); padding: 0 6px; white-space: nowrap; }
[data-ds-heatmap] thead th { font-size: 11px; }
[data-ds-heatmap] tbody th { text-align: right; }
[data-ds-heatmap] td { min-width: 36px; text-align: center; border-radius: 3px; background: var(--ds-color-background-muted); font-family: var(--ds-typography-font-family-mono); font-size: 11px; color: var(--ds-color-foreground-primary); }
[data-ds-heatmap] td:hover { outline: 2px solid var(--ds-color-foreground-primary); outline-offset: -1px; }
[data-ds-heatmap] [data-slot="scale"] { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--ds-color-foreground-tertiary); }
[data-ds-heatmap] [data-slot="scale"] i { width: 140px; height: 8px; border-radius: 4px; }

[data-ds-status-timeline] { --_lw: 96px; display: flex; flex-direction: column; gap: 8px; font-size: 12px; }
[data-ds-status-timeline] [data-slot="legend"] { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 14px; color: var(--ds-color-foreground-secondary); }
[data-ds-status-timeline] [data-slot="legend"] span { display: inline-flex; align-items: center; gap: 6px; }
[data-ds-status-timeline] [data-slot="legend"] i { width: 10px; height: 10px; border-radius: 2px; }
[data-ds-status-timeline] [data-slot="legend"] small { margin-left: auto; color: var(--ds-color-foreground-tertiary); }
[data-ds-status-timeline] [data-slot="grid"] { position: relative; display: grid; gap: 4px; }
[data-ds-status-timeline] [data-slot="row"] { display: grid; grid-template-columns: var(--_lw) minmax(0, 1fr); align-items: center; }
[data-ds-status-timeline] [data-slot="row-label"] { font-weight: 600; color: var(--ds-color-foreground-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
[data-ds-status-timeline] [data-slot="lane"] { position: relative; height: 100%; border-radius: 3px; background: var(--ds-color-background-muted); overflow: hidden; user-select: none; }
[data-ds-status-timeline] [data-slot="seg"] { position: absolute; top: 3px; bottom: 3px; padding: 0; border: none; border-radius: 2px; cursor: pointer; }
[data-ds-status-timeline] [data-slot="seg"]:hover { filter: brightness(1.12); }
[data-ds-status-timeline] [data-slot="seg"]:focus-visible { outline: 2px solid var(--ds-color-foreground-primary); outline-offset: 1px; z-index: 1; }
[data-ds-status-timeline] [data-slot="highlight"] { position: absolute; top: 0; bottom: 0; border: 2px solid var(--ds-color-foreground-primary); border-radius: 3px; pointer-events: none; }
[data-ds-status-timeline] [data-slot="selection"] { position: absolute; top: 0; bottom: 0; background: color-mix(in oklab, var(--ds-palette-primary-500) 25%, transparent); pointer-events: none; }
[data-ds-status-timeline] [data-slot="axis"] { position: relative; height: 18px; }
[data-ds-status-timeline] [data-slot="axis"] span { position: absolute; transform: translateX(-50%); font-family: var(--ds-typography-font-family-mono); font-size: 11px; color: var(--ds-color-foreground-tertiary); }
[data-ds-status-timeline] [data-slot="axis"] span:first-child { transform: none; }
[data-ds-status-timeline] [data-slot="axis"] span:last-child { transform: translateX(-100%); }
[data-ds-status-timeline] [data-slot="now"] { position: absolute; top: 0; bottom: 22px; width: 2px; background: var(--ds-palette-danger-600); pointer-events: none; }

[data-ds-gantt] { display: grid; grid-template-columns: 200px minmax(0, 1fr); border: 1px solid var(--ds-color-border-subtle); border-radius: var(--ds-radius-md); overflow: hidden; font-size: 12px; background: var(--ds-surface-card-background); }
[data-ds-gantt] [data-slot="names"] { border-right: 1px solid var(--ds-color-border-default); }
[data-ds-gantt] [data-slot="head"] { position: relative; height: 28px; line-height: 28px; padding: 0 8px; border-bottom: 1px solid var(--ds-color-border-default); background: var(--ds-color-background-muted); font-weight: 600; color: var(--ds-color-foreground-tertiary); box-sizing: border-box; }
[data-ds-gantt] [data-slot="scroll"] [data-slot="head"] { padding: 0; }
[data-ds-gantt] [data-slot="scroll"] [data-slot="head"] span { position: absolute; padding-left: 4px; font-family: var(--ds-typography-font-family-mono); font-weight: 500; font-size: 11px; }
[data-ds-gantt] [data-slot="name"] { display: flex; align-items: center; gap: 4px; box-sizing: border-box; border-bottom: 1px solid var(--ds-color-border-subtle); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
[data-ds-gantt] [data-slot="toggle"] { width: 16px; padding: 0; border: none; background: none; color: var(--ds-color-foreground-tertiary); cursor: pointer; font-size: 10px; flex-shrink: 0; }
[data-ds-gantt] [data-slot="scroll"] { overflow-x: auto; }
[data-ds-gantt] [data-slot="grid"] { stroke: var(--ds-color-border-subtle); }
`.trim()

/** 대시보드 소형 차트 (보드 9-04 ~ 9-10) */
export const MINI_CSS = `
[data-ds-segment-meter] { display: flex; flex-direction: column; gap: 8px; min-width: 0; --_h: 12px; }
[data-ds-segment-meter][data-size="sm"] { --_h: 6px; }
[data-ds-segment-meter][data-size="lg"] { --_h: 20px; }
[data-ds-segment-meter] [data-slot="markers"] { position: relative; height: 16px; font-size: 11px; color: var(--ds-color-foreground-tertiary); }
[data-ds-segment-meter] [data-slot="markers"] span { position: absolute; transform: translateX(-50%); display: inline-flex; gap: 3px; white-space: nowrap; }
[data-ds-segment-meter] [data-slot="bar"] { position: relative; display: flex; height: var(--_h); border-radius: 3px; overflow: visible; }
[data-ds-segment-meter] [data-slot="seg"] { height: 100%; border-radius: 2px; }
[data-ds-segment-meter] [data-slot="rest"] { height: 100%; border-radius: 2px; background: var(--ds-color-border-subtle); }
[data-ds-segment-meter] [data-remainder="hatch"] [data-slot="rest"] { background: repeating-linear-gradient(135deg, var(--ds-color-border-default) 0 2px, transparent 2px 6px); }
[data-ds-segment-meter] [data-slot="marker-line"] { position: absolute; top: -4px; bottom: -4px; width: 2px; margin-left: -1px; background: var(--ds-color-foreground-primary); }
[data-ds-segment-meter] [data-slot="scale"] { position: relative; display: flex; justify-content: space-between; font-family: var(--ds-typography-font-family-mono); font-size: 11px; color: var(--ds-color-foreground-tertiary); }
[data-ds-segment-meter] [data-slot="legend"] { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12px; color: var(--ds-color-foreground-secondary); }
[data-ds-segment-meter] [data-slot="legend"][data-rows] { flex-direction: column; }
[data-ds-segment-meter] [data-slot="legend"] li { display: flex; align-items: center; gap: 6px; }
[data-ds-segment-meter] [data-slot="legend"] i { width: 8px; height: 8px; border-radius: 2px; }
[data-ds-segment-meter] [data-slot="legend"] b { font-family: var(--ds-typography-font-family-mono); font-weight: 600; color: var(--ds-color-foreground-primary); }
[data-ds-segment-meter] [data-slot="legend"][data-rows] b { margin-left: auto; }
[data-ds-segment-meter] [data-slot="legend"] em { font-style: normal; font-size: 11px; min-width: 48px; text-align: right; }

[data-ds-uptime] { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
[data-ds-uptime] [data-slot="head"] { display: flex; justify-content: space-between; font-size: 13px; }
[data-ds-uptime] [data-slot="head"] b { font-family: var(--ds-typography-font-family-mono); font-variant-numeric: tabular-nums; }
[data-ds-uptime] [data-slot="cells"] { position: relative; display: flex; gap: 2px; height: 28px; }
[data-ds-uptime][data-size="sm"] [data-slot="cells"] { height: 18px; gap: 1px; }
[data-ds-uptime] [data-slot="cell"] { flex: 1; min-width: 0; padding: 0; border: none; border-radius: 2px; cursor: pointer; }
[data-ds-uptime] [data-slot="cell"][data-empty] { background: var(--ds-color-border-subtle); cursor: default; }
[data-ds-uptime] [data-slot="cell"]:hover, [data-ds-uptime] [data-slot="cell"]:focus-visible { outline: 2px solid var(--ds-color-foreground-primary); outline-offset: 1px; z-index: 1; }
[data-ds-uptime] [data-slot="cell"][data-highlight] { outline: 2px solid var(--ds-color-foreground-primary); }
[data-ds-uptime] [data-slot="tip"] { position: absolute; bottom: calc(100% + 6px); transform: translateX(-50%); padding: 4px 8px; border-radius: var(--ds-radius-sm); background: var(--ds-color-foreground-primary); color: var(--ds-color-background-muted); font-size: 11px; white-space: nowrap; pointer-events: none; z-index: 2; }
[data-ds-uptime] [data-slot="foot"] { display: flex; justify-content: space-between; font-size: 11px; color: var(--ds-color-foreground-tertiary); }

[data-ds-inline-bar] { display: inline-flex; align-items: center; gap: 8px; min-width: 0; vertical-align: middle; }
[data-ds-inline-bar] [data-slot="value"] { flex-shrink: 0; min-width: 48px; font-family: var(--ds-typography-font-family-mono); font-size: 12px; font-variant-numeric: tabular-nums; text-align: right; }
[data-ds-inline-bar] [data-slot="value"] small { margin-left: 2px; color: var(--ds-color-foreground-tertiary); }
[data-ds-inline-bar] [data-slot="track"] { position: relative; flex: 1; height: 6px; border-radius: 999px; background: var(--ds-color-border-subtle); }
[data-ds-inline-bar] [data-slot="fill"] { position: absolute; top: 0; bottom: 0; left: 0; border-radius: 999px; }
[data-ds-inline-bar] [data-slot="zero"], [data-ds-inline-bar] [data-slot="target"] { position: absolute; top: -3px; bottom: -3px; width: 2px; margin-left: -1px; background: var(--ds-color-foreground-primary); }
[data-ds-inline-bar] [data-slot="zero"] { left: 50%; background: var(--ds-color-border-strong); }

[data-ds-mini-gauge] { position: relative; display: inline-flex; flex-direction: column; align-items: center; gap: 2px; }
[data-ds-mini-gauge][data-variant="lollipop"] { align-items: stretch; }
[data-ds-mini-gauge] [data-slot="value"] { display: flex; align-items: baseline; gap: 4px; }
[data-ds-mini-gauge] [data-slot="value"][data-center] { margin-top: -8px; }
[data-ds-mini-gauge] [data-slot="value"] b { font-size: 20px; font-weight: 700; font-variant-numeric: tabular-nums; }
[data-ds-mini-gauge] [data-slot="value"] span { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-mini-gauge] [data-slot="value"] em { margin-left: 6px; font-style: normal; font-size: 12px; font-weight: 600; }

[data-ds-target-scatter] { display: inline-flex; flex-direction: column; gap: 6px; }
[data-ds-target-scatter] [data-slot="axis"] { stroke: var(--ds-color-border-subtle); }
[data-ds-target-scatter] [data-slot="tick"] { font-size: 10px; fill: var(--ds-color-foreground-tertiary); }
[data-ds-target-scatter] [data-slot="dist"] { display: flex; align-items: flex-end; gap: 2px; height: 32px; }
[data-ds-target-scatter] [data-slot="dist"] span { flex: 1; min-height: 1px; border-radius: 2px 2px 0 0; background: var(--ds-palette-primary-300); }
`.trim()
