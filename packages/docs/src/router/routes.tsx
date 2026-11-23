import type { ComponentType } from 'react'
import { IntroductionPage } from '../pages/foundation/IntroductionPage'
import { PalettesPage } from '../pages/foundation/PalettesPage'
import { ThemePresetPage } from '../pages/foundation/PresetsPage'
import { SurfacesPage } from '../pages/foundation/SurfacesPage'
import { TypographyPage } from '../pages/foundation/TypographyPage'
import { TokensPage } from '../pages/foundation/TokensPage'
import { ButtonPage } from '../pages/actions/ButtonPage'
import { ButtonGroupPage } from '../pages/actions/ButtonGroupPage'
import { SplitButtonPage } from '../pages/actions/SplitButtonPage'
import { TogglePage } from '../pages/actions/TogglePage'
import { ToolbarPage } from '../pages/actions/ToolbarPage'
import { InputPage } from '../pages/inputs/InputPage'
import { TextareaPage } from '../pages/inputs/TextareaPage'
import { NumberInputPage } from '../pages/inputs/NumberInputPage'
import { ComboBoxPage } from '../pages/inputs/SelectPage'
import { CheckboxPage } from '../pages/inputs/CheckboxPage'
import { RadioPage } from '../pages/inputs/RadioPage'
import { SwitchPage } from '../pages/inputs/SwitchPage'
import { SliderPage } from '../pages/inputs/SliderPage'
import { SegmentedControlPage } from '../pages/inputs/SegmentedControlPage'
import { DatePickerPage } from '../pages/inputs/DatePickerPage'
import { TimePickerPage } from '../pages/inputs/TimePickerPage'
import { ColorPickerPage } from '../pages/inputs/ColorPickerPage'
import { FileUploadPage } from '../pages/inputs/FileUploadPage'
import { RatingPage } from '../pages/inputs/RatingPage'
import { OTPInputPage } from '../pages/inputs/OTPInputPage'
import { FormFieldPage } from '../pages/forms/FormFieldPage'
import { LabelPage } from '../pages/forms/LabelPage'
import { FilterBarPage } from '../pages/forms/FilterBarPage'
import { AppShellPage } from '../pages/layout/AppShellPage'
import { PageHeaderPage } from '../pages/layout/PageHeaderPage'
import { ContainerPage } from '../pages/layout/ContainerPage'
import { BoxPage } from '../pages/layout/BoxPage'
import { DashboardGridPage } from '../pages/layout/DashboardGridPage'
import { SplitterPage } from '../pages/layout/SplitterPage'
import { CardPage } from '../pages/surfaces/CardPage'
import { CardSlotsPage } from '../pages/surfaces/CardSlotsPage'
import { KpiCardPage } from '../pages/surfaces/KpiCardPage'
import { TabsPage } from '../pages/surfaces/TabsPage'
import { AccordionPage } from '../pages/surfaces/AccordionPage'
import { NavigationMenuPage } from '../pages/navigation/NavigationMenuPage'
import { BreadcrumbPage } from '../pages/navigation/BreadcrumbPage'
import { PaginationPage } from '../pages/navigation/PaginationPage'
import { StepperPage } from '../pages/navigation/StepperPage'
import { TreePage } from '../pages/navigation/TreePage'
import { TablePage } from '../pages/data/TablePage'
import { DataTablePage } from '../pages/data/DataTablePage'
import { DataGridPage } from '../pages/data/DataGridPage'
import { DescriptionsPage } from '../pages/data/DescriptionsPage'
import { TimelinePage } from '../pages/data/TimelinePage'
import { CalendarPage } from '../pages/data/CalendarPage'
import { BadgePage } from '../pages/display/BadgePage'
import { TagPage } from '../pages/display/TagPage'
import { AvatarPage } from '../pages/display/AvatarPage'
import { StatPage } from '../pages/display/StatPage'
import { KbdPage } from '../pages/display/KbdPage'
import { CodeBlockPage } from '../pages/display/CodeBlockPage'
import { ImagePage } from '../pages/display/ImagePage'
import { MarqueePage } from '../pages/display/MarqueePage'
import { AlertPage } from '../pages/feedback/AlertPage'
import { ProgressPage } from '../pages/feedback/ProgressPage'
import { SkeletonPage } from '../pages/feedback/SkeletonPage'
import { ToastPage } from '../pages/feedback/ToastPage'
import { DialogPage } from '../pages/overlay/DialogPage'
import { DrawerPage } from '../pages/overlay/DrawerPage'
import { TooltipPage } from '../pages/overlay/PopoverPage'
import { MenuPage } from '../pages/overlay/MenuPage'
import { CommandPalettePage } from '../pages/overlay/CommandPalettePage'
import { LineChartPage } from '../pages/charts/LineChartPage'
import { BarChartPage } from '../pages/charts/BarChartPage'
import { AreaChartPage } from '../pages/charts/AreaChartPage'
import { CartesianChartPage } from '../pages/charts/CartesianChartPage'
import { PiePage } from '../pages/charts/PieChartPage'
import { RadarChartPage } from '../pages/charts/RadarChartPage'
import { RadialChartPage } from '../pages/charts/RadialChartPage'
import { GaugePage } from '../pages/charts/GaugePage'
import { MiniChartsPage } from '../pages/charts/MiniChartsPage'
import { ParetoPage } from '../pages/industrial/ParetoChartPage'
import { StatusTimelinePage } from '../pages/industrial/StatusTimelinePage'
import { GanttPage } from '../pages/industrial/GanttChartPage'
import { SiteHeaderPage } from '../pages/commerce/SiteHeaderPage'
import { HeroPage } from '../pages/commerce/HeroPage'
import { CarouselPage } from '../pages/commerce/CarouselPage'
import { RailPage } from '../pages/commerce/RailPage'
import { MediaPage } from '../pages/commerce/MediaPage'
import { PricePage } from '../pages/commerce/PricePage'
import { PurchaseInputsPage } from '../pages/commerce/PurchaseInputsPage'
import { SearchBoxPage } from '../pages/commerce/SearchBoxPage'
import { VideoPlayerPage } from '../pages/commerce/VideoPlayerPage'
import { BottomSheetPage } from '../pages/commerce/BottomSheetPage'

export type RouteId =
    | 'introduction'
    | 'palettes'
    | 'presets'
    | 'surfaces'
    | 'typography'
    | 'tokens'
    | 'c-button'
    | 'c-buttongroup'
    | 'c-splitbutton'
    | 'c-toggle'
    | 'c-toolbar'
    | 'c-input'
    | 'c-textarea'
    | 'c-numberinput'
    | 'c-combobox'
    | 'c-checkbox'
    | 'c-radio'
    | 'c-switch'
    | 'c-slider'
    | 'c-segmented'
    | 'c-datepicker'
    | 'c-timepicker'
    | 'c-colorpicker'
    | 'c-fileupload'
    | 'c-rating'
    | 'c-otpinput'
    | 'c-formfield'
    | 'c-label'
    | 'c-filterbar'
    | 'c-appshell'
    | 'c-pageheader'
    | 'c-container'
    | 'c-box'
    | 'c-dashboard'
    | 'c-splitter'
    | 'c-card'
    | 'c-cardslots'
    | 'c-kpicard'
    | 'c-tabs'
    | 'c-accordion'
    | 'c-navigationmenu'
    | 'c-breadcrumb'
    | 'c-pagination'
    | 'c-stepper'
    | 'c-tree'
    | 'c-table'
    | 'c-datatable'
    | 'c-datagrid'
    | 'c-descriptions'
    | 'c-timeline'
    | 'c-calendar'
    | 'c-badge'
    | 'c-tag'
    | 'c-avatar'
    | 'c-stat'
    | 'c-kbd'
    | 'c-codeblock'
    | 'c-image'
    | 'c-marquee'
    | 'c-alert'
    | 'c-progress'
    | 'c-skeleton'
    | 'c-toast'
    | 'c-dialog'
    | 'c-drawer'
    | 'c-tooltip'
    | 'c-menu'
    | 'c-commandpalette'
    | 'c-linechart'
    | 'c-barchart'
    | 'c-areachart'
    | 'c-cartesian'
    | 'c-pie'
    | 'c-radarchart'
    | 'c-radialchart'
    | 'c-gauge'
    | 'c-minicharts'
    | 'c-pareto'
    | 'c-statustimeline'
    | 'c-gantt'
    | 'c-siteheader'
    | 'c-hero'
    | 'c-carousel'
    | 'c-rail'
    | 'c-media'
    | 'c-price'
    | 'c-purchase'
    | 'c-searchbox'
    | 'c-videoplayer'
    | 'c-bottomsheet'

export type RouteGroup =
    | 'foundation'
    | 'actions'
    | 'inputs'
    | 'forms'
    | 'layout'
    | 'surfaces'
    | 'navigation'
    | 'data'
    | 'display'
    | 'feedback'
    | 'overlay'
    | 'charts'
    | 'industrial'
    | 'commerce'

export type RouteMeta = {
    id: RouteId
    label: string
    page: ComponentType
    description?: string
    group: RouteGroup
}

export const routes: RouteMeta[] = [
    /* Foundation */
    { id: 'introduction', label: 'Introduction', group: 'foundation', page: IntroductionPage },
    { id: 'palettes', label: 'Palettes', group: 'foundation', page: PalettesPage },
    { id: 'presets', label: 'Presets', group: 'foundation', page: ThemePresetPage },
    { id: 'surfaces', label: 'Surfaces', group: 'foundation', page: SurfacesPage },
    { id: 'typography', label: 'Typography', group: 'foundation', page: TypographyPage },
    { id: 'tokens', label: 'Tokens', group: 'foundation', page: TokensPage },

    /* Actions */
    { id: 'c-button', label: 'Button', group: 'actions', page: ButtonPage },
    { id: 'c-buttongroup', label: 'ButtonGroup', group: 'actions', page: ButtonGroupPage },
    { id: 'c-splitbutton', label: 'SplitButton', group: 'actions', page: SplitButtonPage },
    { id: 'c-toggle', label: 'Toggle', group: 'actions', page: TogglePage },
    { id: 'c-toolbar', label: 'Toolbar', group: 'actions', page: ToolbarPage },

    /* Inputs */
    { id: 'c-input', label: 'Input', group: 'inputs', page: InputPage },
    { id: 'c-textarea', label: 'Textarea', group: 'inputs', page: TextareaPage },
    { id: 'c-numberinput', label: 'NumberInput', group: 'inputs', page: NumberInputPage },
    { id: 'c-combobox', label: 'Select · ComboBox', group: 'inputs', page: ComboBoxPage },
    { id: 'c-checkbox', label: 'Checkbox', group: 'inputs', page: CheckboxPage },
    { id: 'c-radio', label: 'Radio', group: 'inputs', page: RadioPage },
    { id: 'c-switch', label: 'Switch', group: 'inputs', page: SwitchPage },
    { id: 'c-slider', label: 'Slider', group: 'inputs', page: SliderPage },
    { id: 'c-segmented', label: 'SegmentedControl', group: 'inputs', page: SegmentedControlPage },
    { id: 'c-datepicker', label: 'DatePicker', group: 'inputs', page: DatePickerPage },
    { id: 'c-timepicker', label: 'TimePicker', group: 'inputs', page: TimePickerPage },
    { id: 'c-colorpicker', label: 'ColorPicker', group: 'inputs', page: ColorPickerPage },
    { id: 'c-fileupload', label: 'FileUpload', group: 'inputs', page: FileUploadPage },
    { id: 'c-rating', label: 'Rating', group: 'inputs', page: RatingPage },
    { id: 'c-otpinput', label: 'OTPInput', group: 'inputs', page: OTPInputPage },

    /* Forms */
    { id: 'c-formfield', label: 'FormField · Form', group: 'forms', page: FormFieldPage },
    { id: 'c-label', label: 'Label', group: 'forms', page: LabelPage },
    { id: 'c-filterbar', label: 'FilterBar', group: 'forms', page: FilterBarPage },

    /* Layout */
    { id: 'c-appshell', label: 'AppShell', group: 'layout', page: AppShellPage },
    { id: 'c-pageheader', label: 'PageHeader', group: 'layout', page: PageHeaderPage },
    { id: 'c-container', label: 'Container · Section', group: 'layout', page: ContainerPage },
    { id: 'c-box', label: 'Box · Stack · Grid', group: 'layout', page: BoxPage },
    { id: 'c-dashboard', label: 'DashboardGrid', group: 'layout', page: DashboardGridPage },
    { id: 'c-splitter', label: 'Splitter', group: 'layout', page: SplitterPage },

    /* Surfaces */
    { id: 'c-card', label: 'Card', group: 'surfaces', page: CardPage },
    { id: 'c-cardslots', label: 'Card 대시보드 슬롯', group: 'surfaces', page: CardSlotsPage },
    { id: 'c-kpicard', label: 'KpiCard · StatusCard', group: 'surfaces', page: KpiCardPage },
    { id: 'c-tabs', label: 'Tabs', group: 'surfaces', page: TabsPage },
    { id: 'c-accordion', label: 'Accordion', group: 'surfaces', page: AccordionPage },

    /* Navigation */
    { id: 'c-navigationmenu', label: 'NavigationMenu', group: 'navigation', page: NavigationMenuPage },
    { id: 'c-breadcrumb', label: 'Breadcrumb', group: 'navigation', page: BreadcrumbPage },
    { id: 'c-pagination', label: 'Pagination', group: 'navigation', page: PaginationPage },
    { id: 'c-stepper', label: 'Stepper', group: 'navigation', page: StepperPage },
    { id: 'c-tree', label: 'Tree', group: 'navigation', page: TreePage },

    /* Data */
    { id: 'c-table', label: 'Table', group: 'data', page: TablePage },
    { id: 'c-datatable', label: 'DataTable', group: 'data', page: DataTablePage },
    { id: 'c-datagrid', label: 'DataGrid', group: 'data', page: DataGridPage },
    { id: 'c-descriptions', label: 'Descriptions', group: 'data', page: DescriptionsPage },
    { id: 'c-timeline', label: 'Timeline', group: 'data', page: TimelinePage },
    { id: 'c-calendar', label: 'Calendar', group: 'data', page: CalendarPage },

    /* Display */
    { id: 'c-badge', label: 'Badge', group: 'display', page: BadgePage },
    { id: 'c-tag', label: 'Tag', group: 'display', page: TagPage },
    { id: 'c-avatar', label: 'Avatar · StatusIndicator', group: 'display', page: AvatarPage },
    { id: 'c-stat', label: 'Stat', group: 'display', page: StatPage },
    { id: 'c-kbd', label: 'Kbd', group: 'display', page: KbdPage },
    { id: 'c-codeblock', label: 'CodeBlock', group: 'display', page: CodeBlockPage },
    { id: 'c-image', label: 'Image', group: 'display', page: ImagePage },
    { id: 'c-marquee', label: 'Marquee', group: 'display', page: MarqueePage },

    /* Feedback */
    { id: 'c-alert', label: 'Alert', group: 'feedback', page: AlertPage },
    { id: 'c-progress', label: 'Progress', group: 'feedback', page: ProgressPage },
    { id: 'c-skeleton', label: 'Skeleton · Spinner · Empty', group: 'feedback', page: SkeletonPage },
    { id: 'c-toast', label: 'Toast', group: 'feedback', page: ToastPage },

    /* Overlay */
    { id: 'c-dialog', label: 'Dialog', group: 'overlay', page: DialogPage },
    { id: 'c-drawer', label: 'Drawer', group: 'overlay', page: DrawerPage },
    { id: 'c-tooltip', label: 'Popover · Tooltip · HoverCard', group: 'overlay', page: TooltipPage },
    { id: 'c-menu', label: 'Menu', group: 'overlay', page: MenuPage },
    { id: 'c-commandpalette', label: 'CommandPalette', group: 'overlay', page: CommandPalettePage },

    /* Charts */
    { id: 'c-linechart', label: 'LineChart', group: 'charts', page: LineChartPage },
    { id: 'c-barchart', label: 'BarChart', group: 'charts', page: BarChartPage },
    { id: 'c-areachart', label: 'AreaChart', group: 'charts', page: AreaChartPage },
    { id: 'c-cartesian', label: 'CartesianChart', group: 'charts', page: CartesianChartPage },
    { id: 'c-pie', label: 'PieChart · DonutChart', group: 'charts', page: PiePage },
    { id: 'c-radarchart', label: 'RadarChart', group: 'charts', page: RadarChartPage },
    { id: 'c-radialchart', label: 'RadialChart', group: 'charts', page: RadialChartPage },
    { id: 'c-gauge', label: 'Gauge', group: 'charts', page: GaugePage },
    { id: 'c-minicharts', label: 'Mini Charts', group: 'charts', page: MiniChartsPage },

    /* Industrial Charts */
    { id: 'c-pareto', label: 'ParetoChart · ControlChart', group: 'industrial', page: ParetoPage },
    { id: 'c-statustimeline', label: 'StatusTimeline · BulletChart', group: 'industrial', page: StatusTimelinePage },
    { id: 'c-gantt', label: 'GanttChart · Heatmap · Waterfall', group: 'industrial', page: GanttPage },

    /* Commerce */
    { id: 'c-siteheader', label: 'SiteHeader · SiteFooter', group: 'commerce', page: SiteHeaderPage },
    { id: 'c-hero', label: 'Hero', group: 'commerce', page: HeroPage },
    { id: 'c-carousel', label: 'Carousel', group: 'commerce', page: CarouselPage },
    { id: 'c-rail', label: 'Rail', group: 'commerce', page: RailPage },
    { id: 'c-media', label: 'Media · WatchProgress', group: 'commerce', page: MediaPage },
    { id: 'c-price', label: 'Price · RatingDisplay', group: 'commerce', page: PricePage },
    { id: 'c-purchase', label: 'QuantityInput · OptionPicker', group: 'commerce', page: PurchaseInputsPage },
    { id: 'c-searchbox', label: 'SearchBox', group: 'commerce', page: SearchBoxPage },
    { id: 'c-videoplayer', label: 'VideoPlayer', group: 'commerce', page: VideoPlayerPage },
    { id: 'c-bottomsheet', label: 'BottomSheet · MobileTabBar', group: 'commerce', page: BottomSheetPage },
]

export const routeMap: Record<RouteId, RouteMeta> = routes.reduce(
    (acc, r) => ({ ...acc, [r.id]: r }),
    {} as Record<RouteId, RouteMeta>,
)

export const isRouteId = (value: string): value is RouteId =>
    value in routeMap

export const groupOrder: RouteGroup[] = [
    'foundation',
    'actions',
    'inputs',
    'forms',
    'layout',
    'surfaces',
    'navigation',
    'data',
    'display',
    'feedback',
    'overlay',
    'charts',
    'industrial',
    'commerce',
]

export const groupLabels: Record<RouteGroup, string> = {
    foundation: 'Foundation',
    actions: 'Actions',
    inputs: 'Inputs',
    forms: 'Forms',
    layout: 'Layout',
    surfaces: 'Surfaces',
    navigation: 'Navigation',
    data: 'Data',
    display: 'Display',
    feedback: 'Feedback',
    overlay: 'Overlay',
    charts: 'Charts',
    industrial: 'Industrial Charts',
    commerce: 'Commerce',
}
