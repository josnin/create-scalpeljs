#!/usr/bin/env node

import { input, select } from '@inquirer/prompts';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import kleur from 'kleur';
import degit from 'degit';

const CURR_DIR = process.cwd();
const GITHUB_REPO = 'josnin/create-scalpeljs';

async function fetchTemplateChoices(language) {
  const tmpPath = path.join(os.tmpdir(), `scalpel-peek-${Date.now()}`);
  
  try {
    const remoteSource = `${GITHUB_REPO}/templates/${language}`;
    const emitter = degit(remoteSource, { cache: false, force: true });
    
    await emitter.clone(tmpPath);

    // Read the folder names
    const items = await fs.readdir(tmpPath);
    
    const choices = items
      .filter(item => {
        // Only include actual directories
        const fullPath = path.join(tmpPath, item);
        return fs.lstatSync(fullPath).isDirectory();
      })
      .map(item => ({
        // FIXED: Correctly capitalize the folder name string
        name: `${kleur.yellow('📦 ' + item.charAt(0).toUpperCase() + item.slice(1))}`,
        value: item
      }));

    await fs.remove(tmpPath);
    
    if (choices.length === 0) throw new Error("No templates found");
    
    return choices;
  } catch (error) {
    if (fs.existsSync(tmpPath)) await fs.remove(tmpPath);
    // Fallback if the network or folder structure fails
    return [
      { name: kleur.yellow('📦 Blank'), value: 'blank' }
    ];
  }
}



async function bootstrap() {
  console.log(kleur.bold().cyan('\n🔪 ScalpelJS - Precision Web App Framework\n'));

  try {
    const projectName = await input({
      message: 'Project folder name:',
      default: 'my-scalpeljs-app'
    });

    const templateType = await select({
      message: 'Select language:',
      choices: [
        { name: 'TypeScript', value: 'ts' },
        { name: 'JavaScript', value: 'js' }
      ]
    });

    console.log(kleur.dim('📡 Syncing templates from GitHub...'));
    const dynamicChoices = await fetchTemplateChoices(templateType);

    const templateFlavor = await select({
      message: 'Select a template:',
      choices: dynamicChoices
    });

    const targetPath = path.join(CURR_DIR, projectName);
    if (fs.existsSync(targetPath)) {
      throw new Error(`Folder "${projectName}" already exists.`);
    }

    // --- Final Scaffolding ---
    const remotePath = `${GITHUB_REPO}/templates/${templateType}/${templateFlavor}`;
    console.log(kleur.gray(`\n⚡ Copying ${templateFlavor} to ./${projectName}...`));

    const finalEmitter = degit(remotePath, { cache: false, force: true });
    await finalEmitter.clone(targetPath);

    console.log(kleur.bold().green(`\n✅ Done! Project ready in ./${projectName}`));

    console.log(kleur.bold('\n👉 Next steps:'));
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
