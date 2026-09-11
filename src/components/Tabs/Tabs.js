/**
 * Tabs — تب‌ها
 *
 * اگر آیتم `href` داشته باشد، لینک رندر می‌شود؛ وگرنه دکمه با `onSelect`.
 * برای منویی که هر تبش یک زیرصفحهٔ جداست (`add_submenu_page`) حتماً `href`
 * بدهید — دکمه، نشانی قابل‌اشتراک و باز کردن در تب جدید را از کاربر می‌گیرد.
 */

import cx from '../../utils/cx';
import Icon from '../../icons/Icon';

export default function Tabs( {
	/** [ { key, label, href?, icon?, count?, countStatus?, disabled? } ] */
	items = [],
	/** کلید تب فعال */
	active,
	/** فقط برای تب‌های دکمه‌ای */
	onSelect,
	/** برچسب ناوبری برای صفحه‌خوان */
	label,
	className,
	...props
} ) {
	const isLinkTabs = items.some( ( item ) => !! item.href );

	const body = items.map( ( item ) => {
		const selected = item.key === active;

		const content = (
			<>
				{ item.icon && <Icon name={ item.icon } size="sm" /> }
				{ item.label }
				{ undefined !== item.count && (
					<span
						className={ cx(
							'rk-tabs__count',
							item.countStatus &&
								`rk-tabs__count--${ item.countStatus }`
						) }
					>
						{ item.count }
					</span>
				) }
			</>
		);

		// تب‌های لینکی صفحه عوض می‌کنند، پس `aria-current="page"` درست است؛
		// تب‌های درون‌صفحه‌ای الگوی tablist دارند و `aria-selected` می‌گیرند.
		if ( item.href ) {
			return (
				<a
					key={ item.key }
					className="rk-tabs__item"
					href={ item.href }
					aria-current={ selected ? 'page' : undefined }
				>
					{ content }
				</a>
			);
		}

		return (
			<button
				key={ item.key }
				type="button"
				role="tab"
				className="rk-tabs__item"
				aria-selected={ selected }
				aria-controls={ `rk-tabpanel-${ item.key }` }
				id={ `rk-tab-${ item.key }` }
				disabled={ item.disabled }
				onClick={ () => onSelect && onSelect( item.key ) }
			>
				{ content }
			</button>
		);
	} );

	if ( isLinkTabs ) {
		return (
			<nav
				{ ...props }
				className={ cx( 'rk-tabs', className ) }
				aria-label={ label }
			>
				{ body }
			</nav>
		);
	}

	return (
		<div
			{ ...props }
			className={ cx( 'rk-tabs', className ) }
			role="tablist"
			aria-label={ label }
		>
			{ body }
		</div>
	);
}

// پنل محتوای یک تب درون‌صفحه‌ای.
export function TabPanel( { tabKey, active, className, children, ...props } ) {
	if ( tabKey !== active ) {
		return null;
	}

	return (
		<div
			{ ...props }
			className={ className }
			role="tabpanel"
			id={ `rk-tabpanel-${ tabKey }` }
			aria-labelledby={ `rk-tab-${ tabKey }` }
			tabIndex={ 0 }
		>
			{ children }
		</div>
	);
}
