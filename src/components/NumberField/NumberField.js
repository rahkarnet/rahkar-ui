/**
 * NumberField — ورودی عددی
 *
 * `min`، `max` و `step` را هم به مرورگر می‌دهد و هم — اگر `showRange` بدهید —
 * کنار راهنما نشان می‌دهد. کاربر نباید با آزمون‌وخطا بفهمد محدودهٔ مجاز چیست.
 */

import { TextControl } from '@wordpress/components';
import cx from '../../utils/cx';
import Icon from '../../icons/Icon';

let uid = 0;
const nextId = () => `rk-number-${ ++uid }`;

export default function NumberField( {
	label,
	value = '',
	onChange,
	help,
	error,
	min,
	max,
	step,
	/** واحد کنار ورودی — «روز»، «تومان»، «ثانیه» */
	unit,
	/** محدودهٔ مجاز را کنار راهنما نشان می‌دهد */
	showRange = true,
	/** تمام‌عرض ستون به‌جای عرض کوتاه عددی */
	isFullWidth = false,
	required = false,
	disabled = false,
	id,
	className,
	...props
} ) {
	const controlId = id || nextId();
	const errorId = error ? `${ controlId }-error` : undefined;

	const hasRange = undefined !== min || undefined !== max;
	const rangeText =
		showRange && hasRange
			? `${ undefined !== min ? min : '' }–${
					undefined !== max ? max : ''
			  }`
			: null;

	const field = (
		<TextControl
			{ ...props }
			__nextHasNoMarginBottom
			id={ controlId }
			type="number"
			label={ label }
			value={ value }
			onChange={ onChange }
			// راهنما فقط وقتی اینجا می‌آید که واحدی کنار ورودی نباشد؛ وگرنه
			// زیر ردیفِ عدد+واحد رندر می‌شود تا چیدمان به‌هم نریزد.
			help={ unit ? undefined : help }
			min={ min }
			max={ max }
			step={ step }
			disabled={ disabled }
			required={ required }
			aria-invalid={ error ? 'true' : undefined }
			aria-errormessage={ errorId }
		/>
	);

	return (
		<div
			className={ cx(
				'rk-number',
				'rk-field',
				{
					'rk-number--full': isFullWidth,
					'rk-field--error': !! error,
				},
				className
			) }
		>
			{ unit ? (
				<div className="rk-number__row">
					{ field }
					<span className="rk-number__unit">{ unit }</span>
				</div>
			) : (
				field
			) }

			{ ( ( unit && help ) || rangeText ) && (
				<p className="rk-field__help">
					{ unit ? help : null }
					{ rangeText && (
						<span className="rk-number__range">{ rangeText }</span>
					) }
				</p>
			) }

			{ error && (
				<p className="rk-field__error" id={ errorId } role="alert">
					<Icon name="alert" size="sm" />
					{ error }
				</p>
			) }
		</div>
	);
}
