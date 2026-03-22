#!/usr/bin/env node

import { input, select } from '@inquirer/prompts';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import kleur from 'kleur';
import degit from 'degit';
import { execSync } from 'child_process';

const CURR_DIR = process.cwd();
const GITHUB_REPO = 'josnin/create-scalpeljs';

async function fetchTemplateChoices(language) {
  const tmpPath = path.join(os.tmpdir(), `scalpel-peek-${Date.now()}`);
  
  try {
    const remoteSource = `${GITHUB_REPO}/templates/${language}`;
    const emitter = degit(remoteSource, { cache: false, force: true });
    
    await emitter.clone(tmpPath);

    const items = await fs.readdir(tmpPath);
    
    const choices = items
      .filter(item => {
        const fullPath = path.join(tmpPath, item);
        return fs.lstatSync(fullPath).isDirectory();
      })
      .map(item => ({
        name: `${kleur.yellow('📦 ' + item.charAt(0).toUpperCase() + item.slice(1))}`,
        value: item
      }));

    await fs.remove(tmpPath);
    
    if (choices.length === 0) throw new Error("No templates found");
    
    return choices;
  } catch (error) {
    if (fs.existsSync(tmpPath)) await fs.remove(tmpPath);
    return null; 
  }
}

async function bootstrap() {
  console.log(kleur.bold().cyan('\n🔪 ScalpelJS - Precision Web App Framework\n'));

  try {
    const projectName = await input({
      message: 'Project folder name:',
      default: 'my-scalpeljs-app'
    });

    const targetPath = path.join(CURR_DIR, projectName);
    if (fs.existsSync(targetPath)) {
      throw new Error(`Folder "${projectName}" already exists.`);
    }

    const templateType = await select({
      message: 'Select language:',
      choices: [
        { name: 'TypeScript', value: 'ts' },
        { name: 'JavaScript', value: 'js' }
      ]
    });

    console.log(kleur.dim('📡 Syncing templates from GitHub...'));
    const dynamicChoices = await fetchTemplateChoices(templateType);

    let templateFlavor;
    if (dynamicChoices) {
      templateFlavor = await select({
        message: 'Select a template:',
        choices: dynamicChoices
      });
    } else {
      console.log(kleur.yellow('⚠️  Could not sync templates. Switching to manual entry.'));
      templateFlavor = await input({
        message: 'Enter template name (e.g., "blank", "ecommerce"):',
        validate: (val) => val.length > 0 || 'Name is required'
      });
    }

    const remotePath = `${GITHUB_REPO}/templates/${templateType}/${templateFlavor}`;
    console.log(kleur.gray(`\n⚡ Copying ${templateFlavor} to ./${projectName}...`));

    const finalEmitter = degit(remotePath, { cache: false, force: true });
    await finalEmitter.clone(targetPath);

    console.log(kleur.bold().green(`\n✅ Project ready in ./${projectName}`));

    // --- Automatic Execution ---
    console.log(kleur.cyan('\n📦 Installing dependencies via npm...'));
    execSync('npm install', { cwd: targetPath, stdio: 'inherit' });

    console.log(kleur.bold().yellow('\n🚀 Launching ScalpelJS dev server...\n'));
    execSync('npm run dev', { cwd: targetPath, stdio: 'inherit' });

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
