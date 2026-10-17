// Guards against closing tags whose casing differs from their opening tag
// (e.g. `<SelectContent>...</selectcontent>`). Vue's template compiler matches
// tags case-insensitively, so vue-tsc and eslint-plugin-vue both stay silent.
import { globSync, readFileSync } from 'node:fs';
import process from 'node:process';
import { parse } from 'vue/compiler-sfc';

const CLOSING_TAG = /<\/([^\s>]+)\s*>$/;

const patterns = process.argv.slice(2);
const files = (patterns.length ? patterns : ['src/**/*.vue'])
  .flatMap(pattern => pattern.includes('*') ? globSync(pattern) : [pattern]);

let problems = 0;

for (const filename of files) {
  const { descriptor, errors } = parse(readFileSync(filename, 'utf8'), { filename });

  for (const error of errors) {
    console.error(`${filename}: ${String(error.message ?? error).split('\n')[0]}`);
    problems++;
  }
  if (errors.length || !descriptor.template)
    continue;

  const visit = (node) => {
    if (node.type === 1) {
      // `endTag` is not exposed on the AST, so read the closing tag from the
      // element's full source. Self-closing tags (`<X />`) never match.
      const closing = CLOSING_TAG.exec(node.loc.source.trimEnd());
      if (closing && closing[1] !== node.tag) {
        console.error(`${filename}:${node.loc.start.line} closing tag casing mismatch: <${node.tag}> ... </${closing[1]}>`);
        problems++;
      }
      node.children.forEach(visit);
    }
    else if (node.children) {
      node.children.forEach(visit);
    }
  };
  visit(descriptor.template.ast);
}

console.log(`Checked ${files.length} file(s), found ${problems} problem(s).`);
process.exitCode = problems > 0 ? 1 : 0;
