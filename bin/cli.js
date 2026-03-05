#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import kleur from 'kleur';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURR_DIR = process.cwd();

async function bootstrap() {
  console.log(kleur.bold().cyan('\n🚀 Welcome to ScalpelJS! Let\'s build something great.\n'));

  try {
    const answers = await inquirer.prompt([
      {
        name: 'projectName',
        type: 'input',
        message: 'Project name:',
        default: 'my-scalpeljs-app',
        validate: (input) => {
          if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
          return 'Use only letters, numbers, underscores, and dashes.';
        }
      },
      {
        name: 'templateInput',
        type: 'input',
        message: 'Select flavor [js/ts]:', 
        default: 'ts',
        filter: (val) => val.toLowerCase().trim(),
        validate: (input) => {
          if (input === 'js' || input === 'ts') return true;
          return 'Please type "js" or "ts".';
        }
      }
    ]);

    const { projectName, templateInput: template } = answers;
    const templatePath = path.resolve(__dirname, '../templates', template);
    const targetPath = path.join(CURR_DIR, projectName);

    if (fs.existsSync(targetPath)) {
      console.error(kleur.red(`\n❌ Error: Folder "${projectName}" already exists.`));
      process.exit(1);
    }

    console.log(kleur.gray(`\nScaffolding ${template.toUpperCase()} project with Vite...`));

    await fs.copy(templatePath, targetPath);

    // Update package.json name
    const pkgJsonPath = path.join(targetPath, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = await fs.readJson(pkgJsonPath);
      pkgJson.name = projectName;
      await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });
    }

    console.log(kleur.bold().green(`\n✅ Success! ${projectName} created.`));
    console.log('\nNext steps to start developing:');
    console.log(kleur.cyan(`  1. cd ${projectName}`));
    console.log(kleur.cyan('  2. npm install'));
    console.log(kleur.cyan('  3. npm run dev\n'));

  } catch (error) {
    console.error(kleur.red('\n❌ Scaffolding failed:'), error.message);
    process.exit(1);
  }
}

bootstrap();

