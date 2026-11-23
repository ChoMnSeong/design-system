import { Card, RadarChart } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

const RADAR_AXES = ['속도', '강도', '기술', '체력', '회복', '집중']

const RADAR_A = { label: 'A 캐릭터', values: [82, 65, 90, 72, 60, 88] }

const RADAR_B = { label: 'B 캐릭터', values: [60, 88, 72, 95, 78, 65] }

export const RadarChartPage = () => (
    <>
        <PageHeader
            title="RadarChart"
            description="다축 비교 (스파이더 차트). primary 단색 톤 기본. fill / showDots / gridShape / gridFilled / axisLabelRender 옵션."
        />

        <ComponentPreview title="기본 (filled + dots)" code={`<RadarChart axes={...} series={[...]} />`}>
            <Card>
                <RadarChart axes={RADAR_AXES} max={100} series={[RADAR_A]} />
            </Card>
        </ComponentPreview>

        <ComponentPreview title='두 시리즈 · legend="top"' description="범례를 그래프 위에 둡니다." code={`<RadarChart axes={...} series={[a, b]} legend="top" />`}>
            <Card>
                <RadarChart axes={RADAR_AXES} max={100} series={[RADAR_A, RADAR_B]} legend="top" />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="라인만 (fill={false})"
            description="채움 없이 윤곽선만"
            code={`<RadarChart axes={...} series={[...]} fill={false} />`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A]}
                    fill={false}
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="점 없이 (showDots={false})"
            code={`<RadarChart axes={...} series={[...]} showDots={false} />`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A]}
                    showDots={false}
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="그리드 채움 (gridFilled)"
            description="동심 다각형이 옅은 primary 톤으로 채워짐"
            code={`<RadarChart axes={...} series={[...]} gridFilled />`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A]}
                    gridFilled
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="원형 그리드 (gridShape='circle')"
            code={`<RadarChart axes={...} series={[...]} gridShape="circle" />`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A]}
                    gridShape="circle"
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="그리드 없음 (gridShape='none')"
            code={`<RadarChart axes={...} series={[...]} gridShape="none" />`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A]}
                    gridShape="none"
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="다중 시리즈 + Legend"
            description="primary 단색 톤으로 자동 진하기 차이"
            code={`<RadarChart axes={RADAR_AXES} series={[RADAR_A, RADAR_B]} />`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A, RADAR_B]}
                />
            </Card>
        </ComponentPreview>

        <ComponentPreview
            title="커스텀 라벨 (axisLabelRender)"
            description="값/단위를 라벨에 함께 표시"
            code={`axisLabelRender={(axis, idx) => (
    <>
        <strong>{RADAR_A.values[idx]}</strong>
        <br />{axis}
    </>
)}`}
        >
            <Card>
                <RadarChart
                    axes={RADAR_AXES}
                    max={100}
                    series={[RADAR_A]}
                    axisLabelRender={(axis, idx) => (
                        <>
                            <strong
                                style={{
                                    fontSize: '13px',
                                    color: 'var(--ds-color-foreground-primary)',
                                }}
                            >
                                {RADAR_A.values[idx]}
                            </strong>
                            <br />
                            {axis}
                        </>
                    )}
                />
            </Card>
        </ComponentPreview>
    </>
)
