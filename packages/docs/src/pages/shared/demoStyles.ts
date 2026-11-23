/** 문서 데모용 레이아웃 도우미 */
export const full = { width: '100%' } as const
export const grid = (n: number) => ({ display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, gap: 10, width: '100%' }) as const
