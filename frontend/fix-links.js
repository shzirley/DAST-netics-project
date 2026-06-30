const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if(fs.statSync(p).isDirectory()) walk(p);
    else if(p.endsWith('.tsx') || p.endsWith('.ts')) {
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes('<Link') && !content.includes('next/link')) {
        content = "import Link from 'next/link';\n" + content;
        fs.writeFileSync(p, content);
      }
    }
  });
}
walk('d:/DAST/figma/src/components');
