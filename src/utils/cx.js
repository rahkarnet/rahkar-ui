/**
 * ترکیب کلاس‌های شرطی. جایگزین سبک `clsx` تا پکیج وابستگی زمان‌اجرا نداشته باشد.
 *
 * @param {...(string|false|null|undefined|Object)} args کلاس یا نگاشت شرطی.
 * @return {string} رشتهٔ کلاس نهایی.
 */
export default function cx( ...args ) {
	const out = [];

	args.forEach( ( arg ) => {
		if ( ! arg ) {
			return;
		}
		if ( typeof arg === 'string' ) {
			out.push( arg );
			return;
		}
		if ( Array.isArray( arg ) ) {
			const nested = cx( ...arg );
			if ( nested ) {
				out.push( nested );
			}
			return;
		}
		if ( typeof arg === 'object' ) {
			Object.entries( arg ).forEach( ( [ key, value ] ) => {
				if ( value ) {
					out.push( key );
				}
			} );
		}
	} );

	return out.join( ' ' );
}
