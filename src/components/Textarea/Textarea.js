/**
 * Textarea — ناحیهٔ متن چندخطی
 *
 * برای قالب پیامک، متن ایمیل و هر چیزی که در یک خط جا نمی‌شود.
 * روی `TextareaControl` بستهٔ ‎@wordpress/components‎ سوار شده است.
 */

import { TextareaControl } from '@wordpress/components';
import cx from '../../utils/cx';
import Icon from '../../icons/Icon';

let uid = 0;
const nextId = () => `rk-textarea-${ ++uid }`;

export default function Textarea( {
	label,
	value = '',
	onChange,
	help,
	error,
	rows = 5,
	/** قالب و کد — چپ‌به‌راست و تک‌عرض */
	monospace = false,
	required = false,
	disabled = false,
	id,
	className,
	...props
} ) {
	const controlId = id || nextId();
	const errorId = error ? `${ controlId }-error` : undefined;

	return (
		<div
			className={ cx(
				'rk-textarea',
				{
					'rk-textarea--mono': monospace,
					'rk-textarea--error': !! error,
				},
				className
			) }
		>
			<TextareaControl
				{ ...props }
				__nextHasNoMarginBottom
				id={ controlId }
				label={ label }
				value={ value }
				onChange={ onChange }
				help={ help }
				rows={ rows }
				disabled={ disabled }
				required={ required }
				aria-invalid={ error ? 'true' : undefined }
				aria-errormessage={ errorId }
			/>

			{ error && (
				<p className="rk-field__error" id={ errorId } role="alert">
					<Icon name="alert" size="sm" />
					{ error }
				</p>
			) }
		</div>
	);
}
