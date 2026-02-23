
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const jsx = require('acorn-jsx');

const parser = acorn.Parser.extend(jsx());

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ?
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
};

walkDir('src', (f) => {
    if (f.endsWith('.jsx') || f.endsWith('.js')) {
        const content = fs.readFileSync(f, 'utf8');
        try {
            parser.parse(content, {
                sourceType: 'module',
                ecmaVersion: 'latest'
            });
            // console.log(`✓ ${f}`);
        } catch (e) {
            console.log(`✗ ${f}: ${e.message} at line ${e.loc.line} col ${e.loc.column}`);
        }
    }
});
