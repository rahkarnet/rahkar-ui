/**
 * TextField — فیلد ورودی متنی
 *
 * روی `TextControl` بستهٔ ‎@wordpress/components‎ سوار شده تا اتصال برچسب و
 * راهنما (id/aria) خودکار بماند؛ حالت خطا و اندازه‌ها اضافه شده‌اند.
 */

import { TextControl } from '@wordpress/components';
import cx from '../../utils/cx';
import Icon from '../../icons/Icon';

let uid = 0;
const nextId = () => `rk-field-${ ++uid }`;

export default function TextField( {
	label,
	value = '',
	onChange,
	help,
	/** پیام خطا؛ اگر پر باشد فیلد به حالت خطا می‌رود */
	error,
	size = 'md',
	/** ورودی‌های لاتین مثل کلید API — چپ‌به‌راست و تک‌عرض */
	monospace = false,
	required = false,
	disabled = false,
	type = 'text',
	id,
	className,
	...props
} ) {
	const controlId = id || nextId();
	const errorId = error ? `${ controlId }-error` : undefined;

	return (
		<div
			className={ cx(
				'rk-field',
				size !== 'md' && `rk-field--${ size }`,
				{
					'rk-field--mono': monospace,
					'rk-field--error': !! error,
				},
				className
			) }
		>
			<TextControl
				{ ...props }
				__nextHasNoMarginBottom
				id={ controlId }
				type={ type }
				label={
					label && required ? (
						<>
							{ label }
							<span
								className="rk-field__required"
								aria-hidden="true"
							>
								*
							</span>
						</>
					) : (
						label
					)
				}
				value={ value }
				onChange={ onChange }
				help={ help }
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
