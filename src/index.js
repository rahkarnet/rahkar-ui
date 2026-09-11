/**
 * rahkar-ui — دیزاین سیستم مشترک پلاگین‌های راهکار
 *
 * نقطهٔ ورود پکیج. استایل‌ها همین‌جا import می‌شوند تا wp-scripts آن‌ها را در
 * `build/index.css` جمع کند.
 */

import './styles/index.css';

/* کنترل‌های فرم */
export { default as Button } from './components/Button';
export { default as TextField } from './components/TextField';
export { default as Textarea } from './components/Textarea';
export { default as NumberField } from './components/NumberField';
export { default as Select } from './components/Select';
export { default as Toggle } from './components/Toggle';
export { default as FormRow } from './components/FormRow';

/* ظرف‌ها */
export { default as Card } from './components/Card';
export { default as Panel, PanelSection } from './components/Panel';
export { default as Modal, ConfirmModal } from './components/Modal';

/* داده و ناوبری */
export { default as Table } from './components/Table';
export { default as Pagination } from './components/Pagination';
export {
	default as Toolbar,
	ToolbarSpacer,
	ToolbarGroup,
} from './components/Toolbar';
export { default as Tabs, TabPanel } from './components/Tabs';
export {
	default as VerticalTabs,
	VerticalTabsPanel,
} from './components/VerticalTabs';

/* بازخورد */
export { default as Notice } from './components/Notice';
export { default as Badge } from './components/Badge';
export { default as StatTile } from './components/StatTile';
export { default as EmptyState } from './components/EmptyState';
export { default as CodeBlock } from './components/CodeBlock';

export {
	default as Icon,
	setSpriteUrl,
	getSpriteUrl,
	ICON_NAMES,
} from './icons';

export {
	default as tokens,
	rawTokens,
	applyTokenOverrides,
} from './tokens/tokens';

export { default as cx } from './utils/cx';
export { default as attachFormGuard } from './utils/formGuard';

/** نسخهٔ پکیج — باید با `package.json` و ثابت PHP یکی بماند. */
export const VERSION = '0.3.1';
