import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import size from 'rollup-plugin-size';
import { premove } from 'premove/sync';

const production = !process.env.ROLLUP_WATCH;

// https://github.com/sveltejs/template/blob/b1bdb5c9bd0061ea54a328ba11ccacb64b3e529f/rollup.config.js#L10
function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}


export default {
  input: "src/main.js",
  output: {
    dir: "public/dist",
    format: "es",
    sourcemap: !production
  },
  plugins: [
		// remove old build files
		premove("public/dist"),
		// resolve module to support on browser
    resolve({
			browser: true,
		}),
		// convert common js to es6
		commonjs(),
		// show build files size
		size(),
    !production && serve(),
		!production && livereload('public'),
		production && terser(),
  ],
  watch: {
		clearScreen: false
	}
};
