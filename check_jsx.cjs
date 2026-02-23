
const parser = require('@babel/parser');
const fs = require('fs');

try {
    const code = fs.readFileSync('frontend/src/pages/PostJob.jsx', 'utf8');
    parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx'],
    });
    console.log('JSX is valid');
} catch (e) {
    console.error('JSX Error:', e.message);
    console.error('At line:', e.loc.line, 'column:', e.loc.column);
}
