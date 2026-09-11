/**
 * Badge — نشان وضعیت
 *
 * برای وضعیت ماژول (روشن/خاموش)، سطح گزارش، و نتیجهٔ بررسی سلامت.
 */

import cx from '../../utils/cx';

export default function Badge( {
	/** success | error | warning | info | brand | critical | quiet */
	variant,
	size = 'md',
	/**
	 * نقطهٔ رنگی کنار متن. وقتی چند نشان کنار هم‌اند و تفاوتشان فقط رنگ است،
	 * این تنها چیزی است که برای کاربر کوررنگ باقی می‌ماند.
	 */
	dot = false,
	/** متن لاتین/عددی — نسخه، کد وضعیت */
	monospace = false,
	className,
	children,
	...props
} ) {
	return (
		<span
			{ ...props }
			className={ cx(
				'rk-badge',
				variant && `rk-badge--${ variant }`,
				size !== 'md' && `rk-badge--${ size }`,
				monospace && 'rk-badge--mono',
				className
			) }
		>
			{ dot && <span className="rk-badge__dot" aria-hidden="true" /> }
			{ children }
		</span>
	);
}
