import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { AGENTS, isDetected } from './agents.js';
import { copySkill, fetchBundle, SKILL_NAME } from './install.js';
import {
  bold,
  createProgress,
  createPrompter,
  dim,
  finishProgress,
  green,
  red,
  yellow,
} from './ui.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const home = os.homedir();
const cwd = process.cwd();
const packageRoot = fileURLToPath(new URL('..', import.meta.url));

function parseArgs(argv) {
  const options = {
    list: false,
    all: false,
    force: false,
    yes: false,
    project: false,
    help: false,
    version: false,
    targets: [],
    dir: null,
    source: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    let argument = argv[index];
    let inlineValue = null;

    if (argument.startsWith('--') && argument.includes('=')) {
      const split = argument.indexOf('=');
      inlineValue = argument.slice(split + 1);
      argument = argument.slice(0, split);
    }

    const value = () => {
      const found = inlineValue ?? argv[index + 1];
      if (!found || (inlineValue === null && found.startsWith('-'))) {
        throw new Error(`${argument} needs a value.`);
      }
      if (inlineValue === null) index += 1;
      return found;
    };

    switch (argument) {
      case '-h':
      case '--help':
        options.help = true;
        break;
      case '-v':
      case '--version':
        options.version = true;
        break;
      case '-l':
      case '--list':
        options.list = true;
        break;
      case '-a':
      case '--all':
        options.all = true;
        break;
      case '-y':
      case '--yes':
        options.yes = true;
        break;
      case '-f':
      case '--force':
        options.force = true;
        break;
      case '--project':
        options.project = true;
        break;
      case '-t':
      case '--target':
        options.targets.push(
          ...value()
            .split(',')
            .map((entry) => entry.trim().toLowerCase())
            .filter(Boolean),
        );
        break;
      case '--dir':
        options.dir = value();
        break;
      case '--source':
        options.source = value();
        break;
      default:
        throw new Error(`Unknown option: ${argument}`);
    }
  }

  return options;
}

function expandHome(input) {
  if (input === '~') return home;
  if (input.startsWith('~/') || input.startsWith('~\\')) return path.join(home, input.slice(2));
  return input;
}

function displayPath(target) {
  const relative = path.relative(home, target);
  if (relative && !relative.startsWith('..') && !path.isAbsolute(relative)) {
    return `~/${relative}`;
  }
  return target;
}

function destinationFor(agent, options) {
  if (options.dir) {
    const base = path.resolve(expandHome(options.dir));
    return path.basename(base) === SKILL_NAME ? base : path.join(base, SKILL_NAME);
  }

  const base = options.project ? path.join(cwd, agent.project) : agent.global;
  return path.join(base, SKILL_NAME);
}

function buildEntries(agents, options) {
  const entries = new Map();

  for (const agent of agents) {
    const destination = destinationFor(agent, options);
    if (!entries.has(destination)) entries.set(destination, { agent, destination });
  }

  return [...entries.values()];
}

function printAgents(agents, options) {
  const width = Math.max(...agents.map((agent) => agent.name.length));

  agents.forEach((agent, index) => {
    const destination = displayPath(destinationFor(agent, options));
    console.log(`  ${bold(String(index + 1).padStart(2))}. ${agent.name.padEnd(width)}  ${dim(destination)}`);
  });
}

function parseIndices(input, count) {
  const found = new Set();

  for (const part of input.split(/[\s,]+/).filter(Boolean)) {
    const match = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!match) continue;

    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : start;
    for (let index = start; index <= end; index += 1) {
      if (index >= 1 && index <= count) found.add(index);
    }
  }

  return [...found].sort((a, b) => a - b);
}

async function chooseSelection(options, prompter) {
  if (options.dir) {
    return [{ agent: null, destination: destinationFor(null, options) }];
  }

  if (options.targets.length) {
    const selected = [];
    for (const id of options.targets) {
      const agent = AGENTS.find((candidate) => candidate.id === id);
      if (!agent) {
        throw new Error(`Unknown target "${id}". Run "ui-figma-roblox --list --all" to see all ids.`);
      }
      selected.push(agent);
    }
    return buildEntries(selected, options);
  }

  const detected = AGENTS.filter(isDetected);

  if (options.yes) {
    const pool = options.all ? AGENTS : detected;
    if (!pool.length) {
      throw new Error('No supported agent detected. Use --all or --dir <path>.');
    }
    return buildEntries(pool, options);
  }

  let pool = options.all ? AGENTS : detected;
  let showingAll = options.all;

  if (!pool.length) {
    console.log(yellow('No supported AI agents detected on this machine.'));
    console.log(dim('Use "m" to see every supported target, or "c" to choose a custom folder.'));
    const raw = await prompter.ask('Show all targets? [y/N] ');
    if (raw === null) return [];
    const answer = raw.trim().toLowerCase();
    if (answer === 'y' || answer === 'yes') {
      pool = AGENTS;
      showingAll = true;
    } else {
      return [];
    }
  }

  while (true) {
    console.log(bold(showingAll ? '\nAll supported agents:' : '\nDetected AI agents:'));
    printAgents(pool, options);
    console.log(dim('  m = show all   c = custom folder   q = quit'));

    const raw = await prompter.ask(bold('\nInstall for which agents? [numbers, a = all]: '));
    if (raw === null) return [];
    const answer = raw.trim();

    if (!answer) continue;
    if (/^(q|quit|exit)$/i.test(answer)) return [];
    if (/^(m|more)$/i.test(answer)) {
      pool = AGENTS;
      showingAll = true;
      continue;
    }
    if (/^(c|custom)$/i.test(answer)) {
      const rawPath = await prompter.ask('Skills folder (the skill is installed inside it): ');
      if (rawPath === null) return [];
      const custom = rawPath.trim();
      if (!custom) continue;
      options.dir = custom;
      return [{ agent: null, destination: destinationFor(null, options) }];
    }
    if (/^(a|all)$/i.test(answer)) {
      return buildEntries(pool, options);
    }

    const indices = parseIndices(answer, pool.length);
    if (!indices.length) {
      console.log(red('No matching numbers. Try something like "1" or "1,3".'));
      continue;
    }

    return buildEntries(
      indices.map((index) => pool[index - 1]),
      options,
    );
  }
}

function printHelp() {
  console.log(`${bold(`${SKILL_NAME} ${pkg.version}`)}
Install the ${SKILL_NAME} Agent Skill for Roblox UI design in Figma.

${bold('Usage')}
  npx ${SKILL_NAME} [options]

${bold('Options')}
  -l, --list             Show detected agents and install paths
  -a, --all              Show or install every supported agent
  -t, --target <ids>     Comma-separated ids (claude, opencode, codex, ...)
      --dir <path>       Install into a custom skills folder
      --project          Install into the current project instead of globally
  -f, --force            Overwrite an existing install
  -y, --yes              Do not prompt
      --source <path>    Install from a local clone instead of downloading
  -v, --version          Print the version
  -h, --help             Show this help

${bold('Examples')}
  npx ${SKILL_NAME}
  npx ${SKILL_NAME} --target claude --yes
  npx ${SKILL_NAME} --target claude,opencode,codex
  npx ${SKILL_NAME} --dir ~/.agents/skills --yes
  npx ${SKILL_NAME} --project --target claude

${bold('Notes')}
  Only agents detected on this machine are shown by default.
  The installer downloads the full skill bundle (including the art
  libraries) from the project's GitHub Releases.`);
}

export async function main(argv) {
  let options;

  try {
    options = parseArgs(argv);
  } catch (error) {
    console.error(red(error.message));
    console.error(dim(`Run "${SKILL_NAME} --help" for usage.`));
    process.exitCode = 1;
    return;
  }

  if (options.help) {
    printHelp();
    return;
  }

  if (options.version) {
    console.log(pkg.version);
    return;
  }

  if (options.dir && options.targets.length) {
    console.error(red('Use either --dir or --target, not both.'));
    process.exitCode = 1;
    return;
  }

  if (options.dir && options.project) {
    console.error(red('Use either --dir or --project, not both.'));
    process.exitCode = 1;
    return;
  }

  if (options.list) {
    const agents = options.all ? AGENTS : AGENTS.filter(isDetected);
    if (!agents.length) {
      console.log(yellow('No supported agents detected.'));
      console.log(dim('Use --list --all to see every supported target.'));
      return;
    }
    console.log(bold(options.all ? '\nAll supported agents:' : '\nDetected agents:'));
    printAgents(agents, options);
    return;
  }

  const prompter = createPrompter();
  let bundle = null;

  try {
    const entries = await chooseSelection(options, prompter);
    if (!entries.length) {
      console.log(dim('Nothing installed.'));
      return;
    }

    console.log(bold('\nInstall plan:'));
    let existing = 0;

    for (const entry of entries) {
      const alreadyThere = fs.existsSync(entry.destination);
      if (alreadyThere) existing += 1;
      console.log(`  ${green('->')} ${displayPath(entry.destination)}${alreadyThere ? dim(' (exists)') : ''}`);
    }

    if (existing && !options.force) {
      console.log(
        yellow(`\n${existing} destination(s) already exist and will be skipped. Use --force to update.`),
      );
    }

    if (!options.yes) {
      const raw = await prompter.ask('Continue? [Y/n] ');
      if (raw === null) {
        console.log(dim('\nCancelled.'));
        return;
      }
      const answer = raw.trim().toLowerCase();
      if (answer === 'n' || answer === 'no') {
        console.log(dim('Cancelled.'));
        return;
      }
    }

    let source;
    if (options.source) {
      source = path.resolve(expandHome(options.source));
      if (!fs.existsSync(path.join(source, 'SKILL.md'))) {
        throw new Error(`No SKILL.md found in ${source}.`);
      }
    } else if (fs.existsSync(path.join(packageRoot, 'SKILL.md'))) {
      source = packageRoot;
      console.log(dim(`\nUsing local skill files from ${source}.`));
    } else {
      console.log(dim(`\nDownloading ${SKILL_NAME} v${pkg.version}...`));
      const progress = createProgress('Downloading');
      bundle = await fetchBundle(pkg.version, { onProgress: progress });
      finishProgress();
      source = bundle.source;
    }

    console.log();
    let installed = 0;

    for (const entry of entries) {
      const result = copySkill(source, entry.destination, { force: options.force });
      const label = entry.agent ? entry.agent.name : 'Custom folder';

      if (result.skipped) {
        console.log(`  ${yellow('*')} ${label}: skipped (already installed)`);
      } else {
        console.log(`  ${green('+')} ${label} -> ${displayPath(entry.destination)}`);
        installed += 1;
      }
    }

    if (installed) {
      console.log(bold(green(`\nInstalled ${SKILL_NAME} in ${installed} location(s).`)));
      console.log(dim('Restart your agent, then ask: "Use ui-figma-roblox to design a stud-style shop in Figma."'));
    } else {
      console.log(yellow('\nNothing installed. Re-run with --force to overwrite existing installs.'));
    }
  } catch (error) {
    finishProgress();
    console.error(red(`\n${error.message}`));
    if (!options.source) {
      console.error(dim('If downloads are blocked, clone the repo and run:'));
      console.error(dim(`  node bin/${SKILL_NAME}.js --source .`));
    }
    process.exitCode = 1;
  } finally {
    prompter.close();
    if (bundle) bundle.cleanup();
  }
}
