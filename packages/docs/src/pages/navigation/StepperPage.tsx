import { useState } from 'react'
import { Stepper } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const StepperPage = () => {
    const [cur, setCur] = useState(2)
    return (
        <>
            <PageHeader title="Stepper" description="status(wait · process · finish · error · skip) · time · appearance number · dot · icon · orientation · size · clickable." />
            <ComponentPreview title="number · status · time" code={`<Stepper current={3} steps={[{ label: '작성', time: '11/18 09:12' }, …, { label: '품질 검토', status: 'error', description: '반려' }, …]} />`}>
                <Stepper
                    style={{ width: '100%' }}
                    current={3}
                    steps={[
                        { label: '작성', description: '생산관리', time: '11/18 09:12' },
                        { label: '팀장 승인', time: '11/18 10:40' },
                        { label: '품질 검토', status: 'error', description: '반려 · 기준서 누락' },
                        { label: '재승인', description: '진행 중' },
                        { label: '확정', description: '대기' },
                    ]}
                />
            </ComponentPreview>
            <ComponentPreview title="dot · sm · clickable / vertical" code={`<Stepper appearance="dot" size="sm" clickable current={cur} onStepClick={setCur} … /> <Stepper orientation="vertical" … />`}>
                <div style={{ display: 'flex', gap: 48, width: '100%', alignItems: 'flex-start' }}>
                    <Stepper style={{ flex: 1 }} appearance="dot" size="sm" clickable current={cur} onStepClick={setCur} steps={['입고', '수입검사', '적치', '출고 대기'].map((label) => ({ label }))} />
                    <Stepper orientation="vertical" current={1} steps={[{ label: '설계', description: '완료' }, { label: '개발', description: '45%' }, { label: '테스트', description: '12/07 예정' }]} />
                </div>
            </ComponentPreview>
        </>
    )
}
