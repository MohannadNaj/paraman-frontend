if(process.env.NODE_ENV != 'temp-require')
{
	let mix = require('laravel-mix');

	mix.setPublicPath('dist');

	if( mix.inProduction()) {
		mix.js('./src/js/core.js', 'js')
		.sass('./src/sass/core.scss', 'css')
	}

	mix.js('./src/js/app.js', 'js')
	.sass('./src/sass/app.scss', 'css')

	mix.setResourceRoot('/vendor/parameters/');

	if( mix.inProduction()) {
		mix.copy('node_modules/tinymce/skins', 'dist/css/libs/tinymce/skins');
		mix.copy('node_modules/tinymce/themes', 'dist/css/libs/tinymce/themes');

		mix.copy('node_modules/tinymce/plugins/emoticons/img', 'dist/js/plugins/emoticons/img');
		mix.copy('node_modules/tinymce/plugins/codesample/css', 'dist/js/plugins/codesample/css');
		mix.copy('node_modules/tinymce/plugins/visualblocks/css', 'dist/js/plugins/visualblocks/css');
	}

	if(! mix.inProduction())
	{
		mix.sourceMaps(true)
		mix.disableNotifications()

		if(process.argv.filter(x => x.indexOf('no-browsersync') != -1).length == 0)
			mix.browserSync({proxy: 'http://localhost:8000', files: ['./dist/**/*.*'], injectChanges: true})

		if(process.argv.filter(x => x.indexOf('no-tests') != -1).length == 0)
			require('./specs-watcher');

	}
}
