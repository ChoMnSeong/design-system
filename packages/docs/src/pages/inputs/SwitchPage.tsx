import { useState } from 'react'
import { Switch } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const SwitchPage = () => {
    const [saving, setSaving] = useState(false)
    return (
        <>
            <PageHeader title="Switch" description="size xs~lg, tone, labelPosition, onLabel/offLabel, loading." />
            <ComponentPreview title="size" code={`<Switch size="xs" defaultChecked /> … <Switch size="lg" defaultChecked />`}>
                <Switch size="xs" defaultChecked aria-label="xs" />
                <Switch size="sm" defaultChecked aria-label="sm" />
                <Switch defaultChecked aria-label="md" />
                <Switch size="lg" defaultChecked aria-label="lg" />
                <Switch aria-label="off" />
                <Switch defaultChecked disabled aria-label="disabled" />
            </ComponentPreview>
            <ComponentPreview
                title="옵션"
                code={`<Switch tone="success" defaultChecked label="가동" />
<Switch labelPosition="start" onLabel="자동 갱신 켜짐" offLabel="자동 갱신 꺼짐" />
<Switch loading={saving} label="알람 차단" onCheckedChange={save} />`}
            >
                <Switch tone="success" defaultChecked label="가동" />
                <Switch tone="danger" defaultChecked label="알람 차단" />
                <Switch labelPosition="start" defaultChecked onLabel="자동 갱신 켜짐" offLabel="자동 갱신 꺼짐" />
                <Switch
                    loading={saving}
                    label={saving ? '적용 중' : '서버 반영'}
                    onCheckedChange={() => {
                        setSaving(true)
                        setTimeout(() => setSaving(false), 1200)
                    }}
                />
            </ComponentPreview>
        </>
    )
}
