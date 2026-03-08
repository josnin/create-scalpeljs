#!/usr/bin/env node

import { input, select } from '@inquirer/prompts'; // Modern, more stable API
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import kleur from 'kleur';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURR_DIR = process.cwd();

async function bootstrap() {
  console.log(kleur.bold().cyan('\n🔪 ScalpelJS - Precision Web App Framework'));
  console.log(kleur.dim('-------------------------------------------\n'));

  try {
    // 1. Project Name
    const projectName = await input({
      message: 'Project name:',
      default: 'my-scalpeljs-app',
      validate: (val) => /^([A-Za-z\-\\_\d])+$/.test(val) || 'Invalid characters.'
    });

    // 2. Language Selection (More Transparent)
    const templateType = await select({
      message: 'Select your language flavor:',
      choices: [
        { 
          name: kleur.blue('📘 TypeScript') + kleur.gray(' - Full type safety (Recommended)'), 
          value: 'ts' 
        },
        { 
          name: kleur.green('📗 JavaScript') + kleur.gray(' - Plain ESM development'), 
          value: 'js' 
        }
      ]
    });

    // 3. Template Selection
    const templateFlavor = await select({
      message: 'Select a starter template:',
      choices: [
        { 
          name: kleur.yellow('🛍️  Ecommerce Shop') + kleur.gray(' - Store, Cart, Checkout sample'), 
          value: 'ecommerce' 
        },
        { 
          name: kleur.white('📄 Blank Starter') + kleur.gray(' - Minimal ScalpelJS setup'), 
          value: 'blank' 
        }
      ]
    });

    // --- Scaffolding Logic ---
    const templatePath = path.resolve(__dirname, '../templates', templateType, templateFlavor);
    const targetPath = path.join(CURR_DIR, projectName);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templateType}/${templateFlavor}`);
    }

    if (fs.existsSync(targetPath)) {
      throw new Error(`Folder "${projectName}" already exists.`);
    }

    console.log(kleur.gray(`\n⚡ Scaffolding ${kleur.white(templateType)} ${templateFlavor}...`));

    await fs.copy(templatePath, targetPath);

    // Update package.json
    const pkgJsonPath = path.join(targetPath, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = await fs.readJson(pkgJsonPath);
      pkgJson.name = projectName;
      await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
    }

    // --- Success Output ---
    console.log(kleur.bold().green(`\n✅ Created ${projectName} successfully!`));
    
    console.log(kleur.bold('\n🚀 Quick Start:'));
    console.log(kleur.cyan(`  cd ${projectName}`));
    console.log(kleur.cyan('  npm install'));
    console.log(kleur.cyan('  npm run dev\n'));

  } catch (error) {
    if (error.name === 'ExitPromptError') {
      console.log(kleur.yellow('\n👋 See you next time!'));
    } else {
      console.error(kleur.red('\n❌ Error:'), error.message);
    }
    process.exit(1);
  }
}

bootstrap();
