/**
 * CodeBlock — بلوک کد
 *
 * `label` را بدهید تا کاربر بداند به چه چیزی نگاه می‌کند؛ یک JSON بی‌عنوان
 * وسط صفحهٔ سلامت، برای اپراتور فروشگاه معنایی ندارد.
 */

import cx from '../../utils/cx';

export default function CodeBlock( {
	/** عنوان ریز بالای بلوک */
	label,
	/** محتوا؛ اگر ندهید از children خوانده می‌شود */
	value,
	/** زمینهٔ روشن به‌جای تیره */
	light = false,
	/** درون‌متنی و تک‌خطی */
	inline = false,
	className,
	children,
	...props
} ) {
	const content = value ?? children;

	if ( inline ) {
		return (
			<code
				{ ...props }
				className={ cx( 'rk-code', 'rk-code--inline', className ) }
			>
				{ content }
			</code>
		);
	}

	return (
		<div>
			{ label && (
				<div className="rk-code__head">
					<span>{ label }</span>
				</div>
			) }
			<pre
				{ ...props }
				className={ cx(
					'rk-code',
					light && 'rk-code--light',
					className
				) }
			>
				{ content }
			</pre>
		</div>
	);
}
