/**
 * EmptyState — حالت خالی
 *
 * `actions` را جدی بگیرید: حالت خالی بدون قدم بعدی، بن‌بست است. مثلاً صفحهٔ
 * تنظیمات وقتی هیچ ماژولی روشن نیست باید دکمهٔ رفتن به صفحهٔ ماژول‌ها بدهد.
 */

import cx from '../../utils/cx';
import Icon from '../../icons/Icon';

export default function EmptyState( {
	icon = 'package',
	title,
	description,
	actions,
	/** پس‌زمینهٔ فرورفته با حاشیهٔ ممتد، به‌جای حاشیهٔ چین‌چین */
	inset = false,
	className,
	children,
	...props
} ) {
	return (
		<div
			{ ...props }
			className={ cx(
				'rk-empty',
				inset && 'rk-empty--inset',
				className
			) }
		>
			{ icon && (
				<span className="rk-empty__glyph">
					<Icon name={ icon } size="lg" />
				</span>
			) }

			{ title && <h3 className="rk-empty__title">{ title }</h3> }

			{ description && (
				<p className="rk-empty__description">{ description }</p>
			) }

			{ children }

			{ actions && <div className="rk-empty__actions">{ actions }</div> }
		</div>
	);
}
