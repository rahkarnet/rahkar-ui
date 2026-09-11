/**
 * هم‌ترازی نسخه بین `package.json` و `src/index.js`.
 *
 * روی چرخهٔ `version` خود npm سوار است، پس `npm version minor` هر دو را با هم
 * بالا می‌برد و تغییرِ `src/index.js` هم داخل همان کامیت نسخه می‌نشیند.
 *
 * چرا اصلاً دو جا: `package.json` را ابزار می‌خواند و `VERSION` را کدِ
 * مصرف‌کننده. گارد `copy-assets.js` جلوی جدا افتادنشان را می‌گیرد، ولی گارد
 * فقط خطا می‌دهد — این اسکریپت کاری می‌کند که اصلاً خطایی پیش نیاید.
 */

const fs = require( 'fs' );
const path = require( 'path' );

const root = path.resolve( __dirname, '..' );
const entryPath = path.join( root, 'src/index.js' );

const { version } = JSON.parse(
	fs.readFileSync( path.join( root, 'package.json' ), 'utf8' )
);

const source = fs.readFileSync( entryPath, 'utf8' );
const pattern = /(export const VERSION = ')([^']+)(';)/;

if ( ! pattern.test( source ) ) {
	// eslint-disable-next-line no-console
	console.error( 'rahkar-ui: ثابت VERSION در src/index.js پیدا نشد.' );
	process.exit( 1 );
}

const [ , , current ] = source.match( pattern );

if ( current === version ) {
	// eslint-disable-next-line no-console
	console.log( `rahkar-ui: نسخه از قبل روی ${ version } بود.` );
	process.exit( 0 );
}

fs.writeFileSync(
	entryPath,
	source.replace( pattern, `$1${ version }$3` ),
	'utf8'
);

// eslint-disable-next-line no-console
console.log( `rahkar-ui: VERSION از ${ current } به ${ version } رفت.` );
