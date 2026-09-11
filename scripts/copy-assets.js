/**
 * مرحلهٔ پس از ساخت.
 *
 * سه کار می‌کند:
 *
 *   ۱) بررسی هم‌خوانی نسخه بین `package.json` و `VERSION` در `src/index.js`.
 *      این دو اگر از هم جدا بیفتند، بارگذارندهٔ PHP نسخه‌ای را گزارش می‌کند که
 *      با چیزی که واقعاً در باندل است فرق دارد — و هیچ‌جا خطایی نمی‌دهد.
 *
 *   ۲) کپی اسپرایت آیکون. webpack آن را نمی‌بیند چون از JS بازگردانی نمی‌شود
 *      و کامپوننت Icon با <use> از راه URL می‌خواندش.
 *
 *   ۳) نوشتن `build/manifest.json`.
 *
 * دربارهٔ مانیفست: اسکریپت‌های سینکِ پلاگین‌ها معمولاً نسخهٔ semver را مقایسه
 * می‌کنند، ولی semver فقط وقتی عوض می‌شود که کسی یادش بماند بالایش ببرد. اگر
 * کامپوننت تازه‌ای اضافه شود و نسخه دست‌نخورده بماند، سینک هیچ دلیلی برای
 * آوردن بیلد تازه نمی‌بیند و پلاگین در سکوت CSS قدیمی را اجرا می‌کند.
 *
 * `assetHash` هش محتوایی است که خود webpack تولید می‌کند و با هر تغییر واقعی
 * عوض می‌شود — چه نسخه بالا رفته باشد چه نه. سینک باید همین را مقایسه کند.
 */

const fs = require( 'fs' );
const path = require( 'path' );
const crypto = require( 'crypto' );
const vm = require( 'vm' );

const root = path.resolve( __dirname, '..' );
const buildDir = path.join( root, 'build' );

const fail = ( message ) => {
	// eslint-disable-next-line no-console
	console.error( `rahkar-ui: ${ message }` );
	process.exit( 1 );
};

// ---------- ۱. هم‌خوانی نسخه ----------

const pkg = JSON.parse(
	fs.readFileSync( path.join( root, 'package.json' ), 'utf8' )
);

const entry = fs.readFileSync( path.join( root, 'src/index.js' ), 'utf8' );
const declared = entry.match( /export const VERSION = '([^']+)'/ );

if ( ! declared ) {
	fail( 'ثابت VERSION در src/index.js پیدا نشد.' );
}

if ( declared[ 1 ] !== pkg.version ) {
	fail(
		`نسخه‌ها هم‌خوان نیستند — package.json روی ${ pkg.version } است و ` +
			`src/index.js روی ${ declared[ 1 ] }. هر دو باید یکی باشند.`
	);
}

if ( ! fs.existsSync( buildDir ) ) {
	fail( 'پوشهٔ build وجود ندارد. اول `npm run build`.' );
}

// ---------- ۲. کپی اسپرایت ----------

const sprite = path.join( root, 'src/icons/sprite.svg' );

if ( ! fs.existsSync( sprite ) ) {
	fail( 'src/icons/sprite.svg پیدا نشد.' );
}

fs.copyFileSync( sprite, path.join( buildDir, 'sprite.svg' ) );

// ---------- ۳. مانیفست ----------

const sha = ( file ) =>
	crypto
		.createHash( 'sha256' )
		.update( fs.readFileSync( file ) )
		.digest( 'hex' )
		.slice( 0, 16 );

const readAsset = ( name ) => {
	const file = path.join( buildDir, `${ name }.asset.php` );
	if ( ! fs.existsSync( file ) ) {
		return null;
	}
	const body = fs.readFileSync( file, 'utf8' );
	const version =
		( body.match( /'version' => '([^']+)'/ ) || [] )[ 1 ] || null;
	const deps = ( body.match( /'dependencies' => array\(([^)]*)\)/ ) ||
		[] )[ 1 ];
	return {
		version,
		dependencies: deps
			? deps
					.split( ',' )
					.map( ( d ) => d.trim().replace( /^'|'$/g, '' ) )
					.filter( Boolean )
			: [],
	};
};

const indexAsset = readAsset( 'index' );
const guardAsset = readAsset( 'form-guard' );
const assetVersion = indexAsset ? indexAsset.version : null;

// نقطهٔ کل ماجرای جدا کردن این entry همین است. اگر روزی وابستگی پیدا کند،
// مصرف‌کننده‌ای که فقط نگهبان فرم را می‌خواهد دوباره رانتایم وردپرس را
// می‌بلعد — و چون هیچ‌جا خطایی نمی‌دهد، فقط اینجا می‌شود گرفتش.
if ( guardAsset && guardAsset.dependencies.length > 0 ) {
	fail(
		'خروجی form-guard باید بدون وابستگی باشد، ولی این‌ها را اعلام کرده: ' +
			guardAsset.dependencies.join( '، ' )
	);
}

/*
 * شکل سراسریِ form-guard.
 *
 * این همان چیزی است که بی‌صدا خراب می‌شود. اگر `library.export` جا بیفتد،
 * webpack فضای‌نام ماژول را روی سراسری می‌گذارد و
 * `window.rahkarUI.formGuard` می‌شود `{ default: fn }` — بیلد موفق، فایل
 * سر جایش، وابستگی‌ها خالی، و صدا زدنش TypeError. یک بار همین اتفاق افتاد و
 * نگهبان در پیشخوان واقعی وصل نشد.
 *
 * پس به‌جای اعتماد به پیکربندی، باندل ساخته‌شده اجرا و شکلش سنجیده می‌شود.
 */
const guardBundle = path.join( buildDir, 'form-guard.js' );

if ( fs.existsSync( guardBundle ) ) {
	const sandbox = { window: {} };

	try {
		vm.runInNewContext( fs.readFileSync( guardBundle, 'utf8' ), sandbox );
	} catch ( error ) {
		fail( `اجرای form-guard.js شکست خورد: ${ error.message }` );
	}

	const exposed = ( sandbox.window.rahkarUI || {} ).formGuard;

	if ( typeof exposed !== 'function' ) {
		fail(
			'window.rahkarUI.formGuard باید تابع باشد ولی ' +
				`${ typeof exposed } است. ` +
				"احتمالاً `library.export: 'default'` از entry افتاده."
		);
	}
}

const components = fs
	.readdirSync( path.join( root, 'src/components' ), { withFileTypes: true } )
	.filter( ( e ) => e.isDirectory() )
	.map( ( e ) => e.name )
	.sort();

const manifest = {
	name: pkg.name,
	version: pkg.version,
	// هش محتوای webpack — با هر تغییر واقعی عوض می‌شود، مستقل از semver.
	assetHash: assetVersion,
	files: {
		'index.js': sha( path.join( buildDir, 'index.js' ) ),
		'index.css': sha( path.join( buildDir, 'index.css' ) ),
		'form-guard.js': sha( path.join( buildDir, 'form-guard.js' ) ),
		'sprite.svg': sha( path.join( buildDir, 'sprite.svg' ) ),
	},

	// اسکریپت‌های قابل enqueue و وابستگی‌های واقعی هرکدام. مصرف‌کننده از روی
	// همین تصمیم می‌گیرد کدام را بردارد.
	scripts: {
		index: {
			handle: 'rahkar-ui',
			dependencies: indexAsset ? indexAsset.dependencies : [],
		},
		'form-guard': {
			handle: 'rahkar-ui-form-guard',
			dependencies: guardAsset ? guardAsset.dependencies : [],
		},
	},
	components,
	builtAt: new Date().toISOString(),
};

fs.writeFileSync(
	path.join( buildDir, 'manifest.json' ),
	JSON.stringify( manifest, null, 2 ) + '\n'
);

// eslint-disable-next-line no-console
console.log(
	`rahkar-ui: نسخهٔ ${ pkg.version } ساخته شد — ` +
		`${ components.length } کامپوننت، هش ${ assetVersion }. ` +
		'form-guard بدون وابستگی و تابع است.'
);
