import * as esbuild from 'esbuild';
import fs from 'fs';
import { execSync } from 'child_process';
import JavaScriptObfuscator from 'javascript-obfuscator';

async function build() {
  console.log('Building bundle...');
  
  try {
    // Bundle everything into a single file
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile: 'dist/index.js',
define: {
    'require.resolve': 'undefined',
  },
  banner: {
    js: `
#!/usr/bin/env node
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
`,
  },
      
      external: [
        // We keep external dependencies that might not bundle well if they use native modules or other quirks,
        // but for a single file, we ideally want everything in.
        // MCP SDK and others should bundle fine.
      ],
      target: 'node20',
      minify: false, // We will obfuscate instead
    });

    console.log('Obfuscating...');
    let code = fs.readFileSync('dist/index.js', 'utf8');
    
    // Strictly strip the shebang and any leading/trailing whitespace from line 1
let shebang = '#!/usr/bin/env node';
if (code.startsWith('#!')) {
    code = code.replace(/^#!.*\n/, ''); 
}
    const obfuscatedResult = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: false,
      deadCodeInjection: false,
      debugProtection: false,
      disableConsoleOutput: false,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      numbersToExpressions: false,
      renameGlobals: false,
      selfDefending: false,
      simplify: true,
      splitStrings: false,
      stringArray: true,
      stringArrayCallsTransform: false,
      stringArrayEncoding: [],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 1,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 2,
      stringArrayWrappersType: 'variable',
      stringArrayThreshold: 0.75,
      unicodeEscapeSequence: false
    });

    console.log('Writing obfuscated file...');

    fs.writeFileSync('dist/index.js', obfuscatedResult.getObfuscatedCode());
    
    // Set executable permissions
    fs.chmodSync('dist/index.js', '755');
    
    console.log('Build complete: dist/index.js');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();
