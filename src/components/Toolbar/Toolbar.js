/**
 * Toolbar — نوار ابزار و فیلتر
 *
 * `attached` را وقتی بدهید که نوار مستقیم بالای یک جدول می‌نشیند؛ آن‌وقت
 * گوشه‌های مشترک صاف می‌شوند و دو قاب مثل یک قاب دیده می‌شوند.
 */

import cx from '../../utils/cx';

export default function Toolbar( {
	/** چسبیده به جدولِ بلافاصله بعدی */
	attached = false,
	className,
	children,
	...props
} ) {
	return (
		<div
			{ ...props }
			className={ cx(
				'rk-toolbar',
				attached && 'rk-toolbar--attached',
				className
			) }
		>
			{ children }
		</div>
	);
}

// فاصله‌انداز — هرچه بعد از آن بیاید به لبهٔ مقابل رانده می‌شود.
export function ToolbarSpacer() {
	return <span className="rk-toolbar__spacer" />;
}

// گروه چسبیدهٔ کنترل‌ها داخل نوار.
export function ToolbarGroup( { className, children, ...props } ) {
	return (
		<div { ...props } className={ cx( 'rk-toolbar__group', className ) }>
			{ children }
		</div>
	);
}
