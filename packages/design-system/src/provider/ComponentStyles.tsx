import { COMPONENT_CSS } from '../styles/index.js'

export const ComponentStyles = () => (
    <style
        data-ds-component-styles
        dangerouslySetInnerHTML={{ __html: COMPONENT_CSS }}
    />
)
