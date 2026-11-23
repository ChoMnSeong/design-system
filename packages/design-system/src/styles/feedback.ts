/** Alert · Skeleton · Spinner · Empty. */
const TONES = ['accent', 'neutral', 'success', 'warning', 'danger', 'info']
export const FEEDBACK_CSS = `
${TONES.map((t) => `[data-ds-alert][data-tone="${t}"], [data-ds-spinner-ring][data-tone="${t}"] { --_c: var(--ds-tone-${t}-text); --_cs: var(--ds-tone-${t}-solid); --_on: var(--ds-tone-${t}-on); }`).join('\n')}
[data-ds-alert] {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 14px;
    box-sizing: border-box;
    min-width: 0;
    border-radius: var(--ds-radius-md);
    border: 1px solid transparent;
    font-size: 13px;
    line-height: 1.5;
    color: var(--ds-color-foreground-primary);
}
[data-ds-alert][data-size="sm"] { padding: 8px 12px; gap: 8px; font-size: 12px; }
[data-ds-alert][data-appearance="soft"] { background: color-mix(in oklab, var(--_cs) 11%, var(--ds-surface-card-background)); border-color: color-mix(in oklab, var(--_cs) 25%, transparent); }
[data-ds-alert][data-appearance="solid"] { background: var(--_cs); color: var(--_on); }
[data-ds-alert][data-appearance="outline"] { background: var(--ds-surface-card-background); border-color: color-mix(in oklab, var(--_cs) 55%, transparent); }
[data-ds-alert][data-appearance="accent-left"] { background: var(--ds-surface-card-background); border-color: var(--ds-color-border-subtle); box-shadow: inset 3px 0 0 var(--_cs); }
[data-ds-alert][data-banner] { border-radius: 0; border-left: none; border-right: none; padding: 10px 20px; align-items: center; }
[data-ds-alert] [data-slot="icon"] { display: inline-flex; flex-shrink: 0; margin-top: 1px; color: var(--_c); }
[data-ds-alert][data-appearance="solid"] [data-slot="icon"] { color: inherit; }
[data-ds-alert] [data-slot="body"] { flex: 1; min-width: 0; }
[data-ds-alert] [data-slot="title"] { display: block; margin-bottom: 2px; font-weight: 600; }
[data-ds-alert][data-banner] [data-slot="title"] { display: inline; margin-right: 8px; }
[data-ds-alert][data-banner] [data-slot="text"] { display: inline; }
[data-ds-alert] [data-slot="actions"] { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
[data-ds-alert][data-banner] [data-slot="actions"] { margin-top: 0; }
[data-ds-alert] [data-slot="close"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin: -4px -6px -4px 0;
    padding: 0;
    flex-shrink: 0;
    border: none;
    border-radius: var(--ds-radius-sm);
    background: transparent;
    color: inherit;
    opacity: 0.7;
    cursor: pointer;
}
[data-ds-alert] [data-slot="close"]:hover { opacity: 1; background: color-mix(in oklab, currentColor 10%, transparent); }
[data-ds-alert] [data-slot="close"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); }

[data-ds-skeleton][data-animation="pulse"] { background: var(--ds-color-background-muted); animation: ds-skpulse 1.4s ease-in-out infinite; }
[data-ds-skeleton][data-animation="none"] { background: var(--ds-color-background-muted); animation: none; }
@keyframes ds-skpulse { 50% { opacity: 0.5; } }
[data-ds-skeleton-card] {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    border: 1px solid var(--ds-color-border-subtle);
    border-radius: var(--ds-radius-md);
    background: var(--ds-surface-card-background);
}

[data-ds-spinner-ring] {
    --_cs: var(--ds-palette-primary-600);
    display: inline-block;
    flex-shrink: 0;
    box-sizing: border-box;
    border-style: solid;
    border-color: color-mix(in oklab, var(--_cs) 22%, transparent);
    border-top-color: var(--_cs);
    border-radius: 50%;
    animation: ds-spin 700ms linear infinite;
}
[data-ds-spinner-overlay] {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
    color: var(--ds-color-foreground-secondary);
    background: color-mix(in oklab, var(--ds-surface-card-background) 70%, transparent);
    border-radius: inherit;
}

[data-ds-empty] {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 28px 16px;
    text-align: center;
    color: var(--ds-color-foreground-tertiary);
    font-size: 13px;
}
[data-ds-empty][data-size="sm"] { padding: 16px 12px; gap: 6px; font-size: 12px; }
[data-ds-empty][data-size="lg"] { padding: 48px 24px; gap: 10px; font-size: 14px; }
[data-ds-empty] [data-slot="icon"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--ds-color-background-muted);
    color: var(--ds-color-foreground-tertiary);
}
[data-ds-empty][data-size="sm"] [data-slot="icon"] { width: 36px; height: 36px; }
[data-ds-empty][data-size="lg"] [data-slot="icon"] { width: 64px; height: 64px; }
[data-ds-empty] [data-slot="icon"][data-tone="danger"] { color: var(--ds-tone-danger-text); background: color-mix(in oklab, var(--ds-palette-danger-500) 12%, transparent); }
[data-ds-empty] [data-slot="text"] { display: flex; flex-direction: column; gap: 2px; }
[data-ds-empty] [data-slot="text"] b { font-size: 14px; font-weight: 600; color: var(--ds-color-foreground-primary); }
[data-ds-empty][data-size="lg"] [data-slot="text"] b { font-size: 16px; }
[data-ds-empty] [data-slot="action"] { margin-top: 4px; display: flex; gap: 6px; }
[data-ds-empty][data-appearance="compact"] { flex-direction: row; text-align: left; padding: 12px; gap: 10px; }
[data-ds-empty][data-appearance="compact"] [data-slot="icon"] { width: 32px; height: 32px; }
[data-ds-empty][data-appearance="compact"] [data-slot="action"] { margin: 0 0 0 auto; }
`.trim()

/** Popover · Tooltip · HoverCard */
export const POPOVER_CSS = `
[data-ds-popover-panel] {
    padding: 12px 14px;
    min-width: 160px;
    max-width: 360px;
    box-sizing: border-box;
    font-size: 13px;
    line-height: 1.5;
    color: var(--ds-surface-overlay-color);
    background: var(--ds-surface-overlay-background);
    -webkit-backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    border: var(--ds-surface-overlay-border);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-surface-overlay-shadow);
    outline: none;
}
[data-ds-popover-scrim] { position: fixed; inset: 0; z-index: calc(var(--ds-z-index-popover) - 1); background: transparent; }
[data-ds-popover] { --_ab: var(--ds-surface-overlay-background); --_abd: var(--ds-color-border-subtle); }
[data-ds-popover]:has(> [data-ds-tooltip]) { --_ab: var(--_tt-bg); --_abd: transparent; }
[data-ds-popover-arrow] {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--_ab);
    border: 1px solid var(--_abd);
    transform: rotate(45deg);
    pointer-events: none;
}
[data-ds-popover][data-side="bottom"] > [data-ds-popover-arrow] { top: -5px; border-right-color: transparent; border-bottom-color: transparent; }
[data-ds-popover][data-side="top"] > [data-ds-popover-arrow] { bottom: -5px; border-left-color: transparent; border-top-color: transparent; }
[data-ds-popover][data-side="right"] > [data-ds-popover-arrow] { left: -5px; border-right-color: transparent; border-top-color: transparent; }
[data-ds-popover][data-side="left"] > [data-ds-popover-arrow] { right: -5px; border-left-color: transparent; border-bottom-color: transparent; }
[data-ds-popover][data-side="bottom"][data-align="center"] > [data-ds-popover-arrow],
[data-ds-popover][data-side="top"][data-align="center"] > [data-ds-popover-arrow] { left: calc(50% - 5px); }
[data-ds-popover][data-side="bottom"][data-align="start"] > [data-ds-popover-arrow],
[data-ds-popover][data-side="top"][data-align="start"] > [data-ds-popover-arrow] { left: 14px; }
[data-ds-popover][data-side="bottom"][data-align="end"] > [data-ds-popover-arrow],
[data-ds-popover][data-side="top"][data-align="end"] > [data-ds-popover-arrow] { right: 14px; }
[data-ds-popover][data-side="left"][data-align="center"] > [data-ds-popover-arrow],
[data-ds-popover][data-side="right"][data-align="center"] > [data-ds-popover-arrow] { top: calc(50% - 5px); }
[data-ds-popover][data-side="left"][data-align="start"] > [data-ds-popover-arrow],
[data-ds-popover][data-side="right"][data-align="start"] > [data-ds-popover-arrow] { top: 12px; }
[data-ds-popover][data-side="left"][data-align="end"] > [data-ds-popover-arrow],
[data-ds-popover][data-side="right"][data-align="end"] > [data-ds-popover-arrow] { bottom: 12px; }

[data-ds-tooltip] {
    --_tt-bg: var(--ds-color-foreground-primary);
    padding: 5px 9px;
    border-radius: var(--ds-radius-sm);
    background: var(--_tt-bg);
    color: var(--ds-color-background-muted);
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
    box-shadow: var(--ds-shadow-lg);
    pointer-events: none;
    white-space: normal;
    overflow-wrap: break-word;
}
[data-ds-tooltip][data-tone="accent"] { --_tt-bg: var(--ds-palette-primary-700); color: #fff; }
[data-ds-tooltip][data-tone="danger"] { --_tt-bg: var(--ds-palette-danger-700); color: #fff; }
[data-ds-popover]:has(> [data-ds-tooltip][data-tone="accent"]) { --_ab: var(--ds-palette-primary-700); }
[data-ds-popover]:has(> [data-ds-tooltip][data-tone="danger"]) { --_ab: var(--ds-palette-danger-700); }
[data-ds-popover]:has(> [data-ds-tooltip]:not([data-tone])) { --_ab: var(--ds-color-foreground-primary); }
`.trim()

/** Dialog · Drawer */
export const OVERLAY_CSS = `
[data-ds-modal-root] {
    position: fixed;
    inset: 0;
    z-index: var(--ds-z-index-modal);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: var(--ds-color-background-scrim);
    animation: ds-fade 160ms var(--ds-motion-easing-ease-out);
}
[data-ds-modal-root][data-scroll="outside"] { align-items: flex-start; overflow-y: auto; }
@keyframes ds-fade { from { opacity: 0; } }
@keyframes ds-pop { from { opacity: 0; transform: translateY(8px) scale(0.98); } }
[data-ds-dialog] {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 520px;
    max-height: calc(100vh - 48px);
    box-sizing: border-box;
    color: var(--ds-surface-overlay-color);
    background: var(--ds-surface-overlay-background);
    -webkit-backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    border: var(--ds-surface-overlay-border);
    border-radius: var(--ds-surface-overlay-radius);
    box-shadow: var(--ds-surface-overlay-shadow);
    outline: none;
    animation: ds-pop 180ms var(--ds-motion-easing-ease-out);
}
[data-ds-modal-root][data-scroll="outside"] [data-ds-dialog] { max-height: none; margin: auto 0; }
[data-ds-dialog][data-size="xs"] { max-width: 320px; }
[data-ds-dialog][data-size="sm"] { max-width: 400px; }
[data-ds-dialog][data-size="lg"] { max-width: 680px; }
[data-ds-dialog][data-size="xl"] { max-width: 880px; }
[data-ds-dialog][data-size="fullscreen"] { max-width: none; width: calc(100vw - 48px); height: calc(100vh - 48px); }
[data-ds-dialog] [data-slot="header"] { display: flex; gap: 12px; padding: 20px 52px 8px 24px; }
[data-ds-dialog] [data-slot="header"][data-draggable] { cursor: move; user-select: none; }
[data-ds-dialog] [data-slot="header"] h2 { margin: 0; font-size: 17px; font-weight: 600; line-height: 1.4; color: var(--ds-color-foreground-primary); }
[data-ds-dialog] [data-slot="header"] p { margin: 4px 0 0; font-size: 13px; line-height: 1.6; color: var(--ds-color-foreground-secondary); }
[data-ds-dialog] [data-slot="tone-icon"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 50%;
    color: var(--ds-tone-info-text);
    background: color-mix(in oklab, var(--ds-palette-info-500) 14%, transparent);
}
${['accent', 'success', 'warning', 'danger', 'neutral'].map((t) => `[data-ds-dialog][data-tone="${t}"] [data-slot="tone-icon"] { color: var(--ds-tone-${t}-text); background: color-mix(in oklab, var(--ds-tone-${t}-solid) 14%, transparent); }`).join('\n')}
[data-ds-dialog] [data-slot="body"] { padding: 8px 24px 20px; font-size: 14px; line-height: 1.6; color: var(--ds-color-foreground-secondary); overflow-y: auto; flex: 1 1 auto; min-height: 0; }
[data-ds-modal-root][data-scroll="outside"] [data-ds-dialog] [data-slot="body"] { overflow: visible; }
[data-ds-dialog] [data-slot="footer"],
[data-ds-drawer] [data-slot="footer"] {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 14px 24px;
    border-top: 1px solid var(--ds-color-border-subtle);
    background: color-mix(in oklab, var(--ds-color-background-muted) 60%, transparent);
    border-radius: 0 0 var(--ds-surface-overlay-radius) var(--ds-surface-overlay-radius);
}
[data-ds-dialog] [data-slot="close"],
[data-ds-drawer] [data-slot="close"] {
    position: absolute;
    top: 14px;
    right: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: var(--ds-radius-sm);
    background: transparent;
    color: var(--ds-color-foreground-tertiary);
    cursor: pointer;
}
[data-ds-dialog] [data-slot="close"]:hover, [data-ds-drawer] [data-slot="close"]:hover { background: var(--ds-color-background-muted); color: var(--ds-color-foreground-primary); }
[data-ds-dialog] [data-slot="close"]:focus-visible, [data-ds-drawer] [data-slot="close"]:focus-visible { outline: 2px solid var(--ds-palette-primary-500); }

[data-ds-drawer-root] { position: fixed; inset: 0; z-index: var(--ds-z-index-modal); display: flex; background: var(--ds-color-background-scrim); animation: ds-fade 160ms; }
[data-ds-drawer-root]:not([data-modal]) { background: transparent; pointer-events: none; }
[data-ds-drawer-root]:not([data-modal]) [data-ds-drawer] { pointer-events: auto; }
[data-ds-drawer-root][data-side="right"] { justify-content: flex-end; }
[data-ds-drawer-root][data-side="top"], [data-ds-drawer-root][data-side="bottom"] { flex-direction: column; }
[data-ds-drawer-root][data-side="bottom"] { justify-content: flex-end; }
[data-ds-drawer] {
    position: relative;
    display: flex;
    flex-direction: column;
    max-width: 100vw;
    max-height: 100vh;
    box-sizing: border-box;
    color: var(--ds-surface-overlay-color);
    background: var(--ds-surface-overlay-background);
    -webkit-backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    box-shadow: var(--ds-surface-overlay-shadow);
    outline: none;
}
[data-ds-drawer][data-side="right"] { height: 100%; border-left: var(--ds-surface-overlay-border); animation: ds-drawer-right 220ms var(--ds-motion-easing-ease-out); }
[data-ds-drawer][data-side="left"] { height: 100%; border-right: var(--ds-surface-overlay-border); animation: ds-drawer-left 220ms var(--ds-motion-easing-ease-out); }
[data-ds-drawer][data-side="top"] { width: 100%; border-bottom: var(--ds-surface-overlay-border); animation: ds-drawer-top 220ms var(--ds-motion-easing-ease-out); }
[data-ds-drawer][data-side="bottom"] { width: 100%; border-top: var(--ds-surface-overlay-border); border-radius: var(--ds-radius-xl) var(--ds-radius-xl) 0 0; animation: ds-drawer-bottom 220ms var(--ds-motion-easing-ease-out); }
@keyframes ds-drawer-right { from { transform: translateX(100%); } }
@keyframes ds-drawer-left { from { transform: translateX(-100%); } }
@keyframes ds-drawer-top { from { transform: translateY(-100%); } }
@keyframes ds-drawer-bottom { from { transform: translateY(100%); } }
[data-ds-drawer] [data-slot="header"] { padding: 20px 56px 12px 24px; border-bottom: 1px solid var(--ds-color-border-subtle); }
[data-ds-drawer] [data-slot="header"] h2 { margin: 0; font-size: 17px; font-weight: 600; }
[data-ds-drawer] [data-slot="header"] p { margin: 4px 0 0; font-size: 13px; color: var(--ds-color-foreground-secondary); }
[data-ds-drawer] [data-slot="body"] { flex: 1; min-height: 0; overflow-y: auto; padding: 16px 24px; font-size: 14px; }
[data-ds-drawer] [data-slot="footer"] { border-radius: 0; }
[data-ds-drawer] [data-slot="resize"] { position: absolute; z-index: 1; }
[data-ds-drawer][data-side="right"] [data-slot="resize"] { left: -3px; top: 0; bottom: 0; width: 6px; cursor: ew-resize; }
[data-ds-drawer][data-side="left"] [data-slot="resize"] { right: -3px; top: 0; bottom: 0; width: 6px; cursor: ew-resize; }
[data-ds-drawer][data-side="bottom"] [data-slot="resize"] { top: -3px; left: 0; right: 0; height: 6px; cursor: ns-resize; }
[data-ds-drawer][data-side="top"] [data-slot="resize"] { bottom: -3px; left: 0; right: 0; height: 6px; cursor: ns-resize; }
[data-ds-drawer] [data-slot="resize"]:hover { background: color-mix(in oklab, var(--ds-palette-primary-500) 45%, transparent); }
`.trim()

/** Toast */
export const TOAST_CSS = `
[data-ds-toaster] {
    position: fixed;
    z-index: var(--ds-z-index-toast, 1700);
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 16px;
    list-style: none;
    pointer-events: none;
    max-width: min(400px, 100vw);
    box-sizing: border-box;
}
[data-ds-toaster][data-placement^="top"] { top: 0; }
[data-ds-toaster][data-placement^="bottom"] { bottom: 0; }
[data-ds-toaster][data-placement$="left"] { left: 0; }
[data-ds-toaster][data-placement$="right"] { right: 0; }
[data-ds-toaster][data-placement$="center"] { left: 50%; transform: translateX(-50%); }
${['accent', 'neutral', 'success', 'warning', 'danger', 'info'].map((t) => `[data-ds-toast][data-tone="${t}"] { --_c: var(--ds-tone-${t}-text); --_cs: var(--ds-tone-${t}-solid); }`).join('\n')}
[data-ds-toast] {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    width: 360px;
    max-width: 100%;
    padding: 12px 12px 12px 14px;
    box-sizing: border-box;
    overflow: hidden;
    pointer-events: auto;
    font-size: 13px;
    line-height: 1.5;
    color: var(--ds-surface-overlay-color);
    background: var(--ds-surface-overlay-background);
    -webkit-backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    border: var(--ds-surface-overlay-border);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-surface-overlay-shadow), inset 3px 0 0 var(--_cs);
    animation: ds-pop 200ms var(--ds-motion-easing-ease-out);
}
[data-ds-toast] [data-slot="icon"] { display: inline-flex; flex-shrink: 0; margin-top: 1px; color: var(--_c); }
[data-ds-toast] [data-slot="icon"] [data-ds-spinner-ring] { --_cs: var(--ds-palette-primary-600); }
[data-ds-toast] [data-slot="body"] { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
[data-ds-toast] [data-slot="body"] b { font-weight: 600; color: var(--ds-color-foreground-primary); }
[data-ds-toast] [data-slot="body"] span { color: var(--ds-color-foreground-secondary); }
[data-ds-toast] [data-slot="action"] {
    flex-shrink: 0;
    height: 28px;
    padding: 0 10px;
    border: none;
    border-radius: var(--ds-radius-sm);
    background: color-mix(in oklab, var(--_cs) 12%, transparent);
    color: var(--_c);
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}
[data-ds-toast] [data-slot="action"]:hover { background: color-mix(in oklab, var(--_cs) 20%, transparent); }
[data-ds-toast] [data-slot="close"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    flex-shrink: 0;
    border: none;
    border-radius: var(--ds-radius-xs);
    background: transparent;
    color: var(--ds-color-foreground-tertiary);
    cursor: pointer;
}
[data-ds-toast] [data-slot="close"]:hover { background: var(--ds-color-background-muted); color: var(--ds-color-foreground-primary); }
[data-ds-toast] :focus-visible { outline: 2px solid var(--ds-palette-primary-500); outline-offset: 1px; }
[data-ds-toast] [data-slot="progress"] {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 100%;
    background: var(--_cs);
    transform-origin: left;
    animation: ds-toast-progress linear forwards;
}
@keyframes ds-toast-progress { from { transform: scaleX(1); } to { transform: scaleX(0); } }
`.trim()

/** CommandPalette */
export const COMMAND_CSS = `
[data-ds-modal-root][data-command] { align-items: flex-start; padding-top: 12vh; }
[data-ds-command] {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 560px;
    max-height: 70vh;
    overflow: hidden;
    color: var(--ds-surface-overlay-color);
    background: var(--ds-surface-overlay-background);
    -webkit-backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    backdrop-filter: var(--ds-surface-overlay-backdrop-filter);
    border: var(--ds-surface-overlay-border);
    border-radius: var(--ds-surface-overlay-radius);
    box-shadow: var(--ds-surface-overlay-shadow);
    outline: none;
    animation: ds-pop 160ms var(--ds-motion-easing-ease-out);
}
[data-ds-command][data-size="lg"] { max-width: 720px; }
[data-ds-command] [data-slot="search"] { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--ds-color-border-subtle); color: var(--ds-color-foreground-tertiary); }
[data-ds-command] [data-slot="search"] input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; color: var(--ds-color-foreground-primary); font: inherit; font-size: 15px; }
[data-ds-command] [data-slot="list"] { flex: 1; min-height: 0; overflow-y: auto; padding: 6px; }
[data-ds-command] [data-slot="group"] { padding: 8px 10px 4px; font-size: 12px; font-weight: 600; color: var(--ds-color-foreground-tertiary); }
[data-ds-command] [data-slot="item"] { display: flex; align-items: center; gap: 10px; min-height: 38px; padding: 6px 10px; box-sizing: border-box; border-radius: var(--ds-radius-sm); font-size: 14px; cursor: pointer; }
[data-ds-command] [data-slot="item"][data-active] { background: color-mix(in oklab, var(--ds-palette-primary-500) 12%, transparent); color: var(--ds-tone-accent-text); }
[data-ds-command] [data-slot="item"][aria-disabled="true"] { color: var(--ds-color-foreground-tertiary); cursor: not-allowed; }
[data-ds-command] [data-slot="icon"] { display: inline-flex; color: var(--ds-color-foreground-tertiary); }
[data-ds-command] [data-slot="label"] { flex: 1; min-width: 0; display: flex; flex-direction: column; }
[data-ds-command] [data-slot="label"] small { font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-command] [data-slot="empty"] { padding: 28px; text-align: center; font-size: 13px; color: var(--ds-color-foreground-tertiary); }
[data-ds-command] [data-slot="footer"] { display: flex; gap: 14px; padding: 8px 14px; border-top: 1px solid var(--ds-color-border-subtle); font-size: 12px; color: var(--ds-color-foreground-tertiary); }
[data-ds-command] [data-slot="footer"] > span { display: inline-flex; align-items: center; gap: 4px; }
`.trim()
