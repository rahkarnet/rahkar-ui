/**
 * Button — دکمه
 *
 * سه حالت دارد: اصلی، ثانویه، مخرب. روی `Button` بستهٔ ‎@wordpress/components‎
 * سوار شده تا رفتار دسترس‌پذیری (aria، لینک/دکمه، tooltip) رایگان به‌دست بیاید؛
 * فقط لایهٔ ظاهری بازنویسی می‌شود.
 */

import { Button as WPButton } from '@wordpress/components';
import cx from '../../utils/cx';
import Icon from '../../icons/Icon';

export default function Button( {
	variant = 'secondary',
	size = 'md',
	icon,
	iconPosition = 'start',
	isBusy = false,
	isFullWidth = false,
	disabled = false,
	className,
	children,
	...props
} ) {
	const iconOnly = !! icon && ! children;
	const iconName = isBusy ? 'refresh' : icon;
	const iconSize = size === 'lg' ? 'md' : 'sm';

	const glyph = iconName ? (
		<Icon name={ iconName } size={ iconSize } />
	) : null;

	return (
		<WPButton
			{ ...props }
			// حالت بصری خودمان است؛ variant وردپرس عمداً پاس داده نمی‌شود
			// تا استایل `is-primary` با استایل ما نجنگد.
			disabled={ disabled || isBusy }
			aria-busy={ isBusy || undefined }
			className={ cx(
				'rk-button',
				`rk-button--${ variant }`,
				size !== 'md' && `rk-button--${ size }`,
				{
					'rk-button--busy': isBusy,
					'rk-button--full': isFullWidth,
					'rk-button--icon-only': iconOnly,
				},
				className
			) }
		>
			{ iconPosition === 'start' && glyph }
			{ children }
			{ iconPosition === 'end' && glyph }
		</WPButton>
	);
}
