// use prettier on vue files along with js, modified from:
// https://medium.com/@jackysee/prettier-vue-file-with-sublime-text-475062375956

// Prettier options
const formatOptions = {
  useTabs: false,
  semi: false,
  bracketSpacing: true,
  singleQuote: true,
  jsxBracketSameLine: false,
  trailingComma: 'none',
  parser: 'babylon'
}

const glob = require('glob')
const prettier = require('prettier')
const fs = require('fs')
const parser = require('html-script-hook')
const jsBeautify = require('js-beautify').html
const unformatted = [
        // excluding `template` tag.
        // https://github.com/beautify-web/js-beautify/blob/895a45d95b36d8e37a2b8ad4dda488c0e1a8f272/js/src/html/beautifier.js#L94
        'a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite',
        'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img',
        'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript',
        'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', /* 'script', */ 'select', 'small',
        'span', 'strong', 'sub', 'sup', 'svg', 'textarea', 'time', 'u', 'var',
        'video', 'wbr', 'text',
        'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt',
    ];

const files = process.argv[2] || 'resources/assets/js/**/*.{vue,js}'

glob(files, function(er, files) {
  files.forEach(file => {
    let source = fs.readFileSync(file, 'utf8')
    let result

    if (file.endsWith('vue')) {
      result = jsBeautify(source, {
        unformatted,
         indent_size: 2,
        indent_scripts: "keep"
      })
      result = parser(result, {
        scriptCallback: function(code) {
          return `\n\n${prettier.format(code, formatOptions)}\n`
        },
        padLineNo: true
      })
    } else {
      result = prettier.format(source, formatOptions)
    }

    fs.writeFileSync(file, result, { encoding: 'utf8' })
    console.log(`run prettier on ${file}`)
  })
})
