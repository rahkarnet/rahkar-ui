/**
 * Select — فهرست کشویی
 *
 * روی `BaseControl` بستهٔ ‎@wordpress/components‎ سوار است، نه `SelectControl`.
 * توضیح دلیلش در `select.css` آمده: مارک‌آپ داخلی SelectControl حاشیه را با یک
 * لایهٔ emotion جدا می‌کشد و بازنویسی ظاهرش شکننده است. `BaseControl` همان
 * اتصال برچسب/راهنما/`id` را می‌دهد بی‌آنکه ظاهری تحمیل کند.
 */

import { BaseControl } from '@wordpress/components';
import cx from '../../utils/cx';
import Icon from '../../icons/Icon';

let uid = 0;
const nextId = () => `rk-select-${ ++uid }`;

export default function Select( {
	label,
	value,
	onChange,
	/** [ { value, label, disabled? } ] یا نگاشت سادهٔ { key: label } */
	options = [],
	help,
	error,
	size = 'md',
	/** عرض طبیعی به‌جای تمام‌عرض — برای نوار فیلتر */
	auto = false,
	required = false,
	disabled = false,
	id,
	className,
	...props
} ) {
	const controlId = id || nextId();
	const errorId = error ? `${ controlId }-error` : undefined;

	const list = Array.isArray( options )
		? options
		: Object.entries( options ).map( ( [ key, text ] ) => ( {
				value: key,
				label: text,
		  } ) );

	return (
		<BaseControl
			__nextHasNoMarginBottom
			id={ controlId }
			label={ label }
			help={ help }
			className={ cx(
				'rk-select',
				size !== 'md' && `rk-select--${ size }`,
				{
					'rk-select--auto': auto,
					'rk-select--error': !! error,
				},
				className
			) }
		>
			<span className="rk-select__wrap">
				<select
					{ ...props }
					id={ controlId }
					className="rk-select__input"
					value={ value }
					disabled={ disabled }
					required={ required }
					aria-invalid={ error ? 'true' : undefined }
					aria-errormessage={ errorId }
					onChange={ ( event ) =>
						onChange && onChange( event.target.value, event )
					}
				>
					{ list.map( ( option ) => (
						<option
							key={ option.value }
							value={ option.value }
							disabled={ option.disabled }
						>
							{ option.label }
						</option>
					) ) }
				</select>

				<Icon
					name="chevron-down"
					size="sm"
					className="rk-select__arrow"
				/>
			</span>

			{ error && (
				<p className="rk-field__error" id={ errorId } role="alert">
					<Icon name="alert" size="sm" />
					{ error }
				</p>
			) }
		</BaseControl>
	);
}
