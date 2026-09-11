/**
 * Toggle — سوییچ روشن/خاموش
 *
 * روی `FormToggle` بستهٔ ‎@wordpress/components‎ سوار شده و برچسب/توضیح را
 * خودش می‌چیند تا در کارت ماژول و فرم تنظیمات یک‌شکل باشد.
 */

import { FormToggle } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import cx from '../../utils/cx';

let uid = 0;
const nextId = () => `rk-toggle-${ ++uid }`;

export default function Toggle( {
	checked = false,
	onChange,
	label,
	help,
	/** برچسب را سمت مقابل سوییچ و کشیده در عرض می‌چیند (مناسب ردیف تنظیمات) */
	reverse = false,
	/** نمایش متن «روشن/خاموش» کنار برچسب */
	showState = false,
	disabled = false,
	id,
	className,
	...props
} ) {
	const controlId = id || nextId();
	const helpId = help ? `${ controlId }-help` : undefined;

	const handleChange = ( event ) => {
		if ( onChange ) {
			onChange( event.target.checked, event );
		}
	};

	return (
		<div
			className={ cx(
				'rk-toggle',
				reverse && 'rk-toggle--reverse',
				disabled && 'is-disabled',
				className
			) }
		>
			<FormToggle
				{ ...props }
				id={ controlId }
				checked={ checked }
				disabled={ disabled }
				onChange={ handleChange }
				aria-describedby={ helpId }
				className="rk-toggle__control"
			/>

			{ ( label || help ) && (
				<div className="rk-toggle__text">
					{ label && (
						<label
							className="rk-toggle__label"
							htmlFor={ controlId }
						>
							{ label }
							{ showState && (
								<span className="rk-toggle__state">
									{ checked
										? __( 'روشن', 'rahkar-ui' )
										: __( 'خاموش', 'rahkar-ui' ) }
								</span>
							) }
						</label>
					) }
					{ help && (
						<span className="rk-toggle__help" id={ helpId }>
							{ help }
						</span>
					) }
				</div>
			) }
		</div>
	);
}
