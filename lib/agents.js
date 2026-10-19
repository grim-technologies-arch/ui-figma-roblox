import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const home = os.homedir();
const isWindows = process.platform === 'win32';
const xdgConfig = process.env.XDG_CONFIG_HOME || path.join(home, '.config');

const join = (...parts) => path.join(...parts);
const optional = (...parts) => (parts[0] ? path.join(...parts.filter(Boolean)) : null);

const chatgptApps = [
  '/Applications/ChatGPT.app',
  join(home, 'Applications', 'ChatGPT.app'),
  optional(process.env.LOCALAPPDATA, 'Programs', 'ChatGPT'),
  optional(process.env.LOCALAPPDATA, 'ChatGPT'),
  optional(process.env.APPDATA, 'ChatGPT'),
].filter(Boolean);

export const AGENTS = [
  {
    id: 'claude',
    name: 'Claude Code',
    global: join(home, '.claude', 'skills'),
    project: '.claude/skills',
    detect: [join(home, '.claude')],
    bins: ['claude'],
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    global: join(xdgConfig, 'opencode', 'skills'),
    project: '.opencode/skills',
    detect: [
      join(xdgConfig, 'opencode'),
      join(home, '.opencode'),
      optional(process.env.APPDATA, 'opencode'),
    ].filter(Boolean),
    bins: ['opencode'],
  },
  {
    id: 'codex',
    name: 'Codex / ChatGPT',
    global: join(home, '.agents', 'skills'),
    project: '.agents/skills',
    detect: [join(home, '.codex'), ...chatgptApps],
    bins: ['codex'],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    global: join(home, '.cursor', 'skills'),
    project: '.cursor/skills',
    detect: [join(home, '.cursor')],
    bins: ['cursor'],
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    global: join(home, '.gemini', 'skills'),
    project: '.gemini/skills',
    detect: [join(home, '.gemini')],
    bins: ['gemini'],
  },
  {
    id: 'cline',
    name: 'Cline',
    global: join(home, '.agents', 'skills'),
    project: '.agents/skills',
    detect: [join(home, '.cline')],
    bins: ['cline'],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    global: join(home, '.codeium', 'windsurf', 'skills'),
    project: '.windsurf/skills',
    detect: [join(home, '.codeium', 'windsurf')],
    bins: ['windsurf'],
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    global: join(home, '.copilot', 'skills'),
    project: '.agents/skills',
    detect: [join(home, '.copilot')],
    bins: ['copilot'],
  },
  {
    id: 'goose',
    name: 'Goose',
    global: join(home, '.config', 'goose', 'skills'),
    project: '.goose/skills',
    detect: [join(home, '.config', 'goose')],
    bins: ['goose'],
  },
  {
    id: 'continue',
    name: 'Continue',
    global: join(home, '.continue', 'skills'),
    project: '.continue/skills',
    detect: [join(home, '.continue')],
    bins: ['continue'],
  },
  {
    id: 'roo',
    name: 'Roo Code',
    global: join(home, '.roo', 'skills'),
    project: '.roo/skills',
    detect: [join(home, '.roo')],
    bins: ['roo'],
  },
  {
    id: 'openhands',
    name: 'OpenHands',
    global: join(home, '.openhands', 'skills'),
    project: '.openhands/skills',
    detect: [join(home, '.openhands')],
    bins: ['openhands'],
  },
  {
    id: 'amp',
    name: 'Amp',
    global: join(home, '.config', 'agents', 'skills'),
    project: '.agents/skills',
    detect: [join(home, '.config', 'amp')],
    bins: ['amp'],
  },
  {
    id: 'kimi',
    name: 'Kimi Code CLI',
    global: join(home, '.config', 'agents', 'skills'),
    project: '.agents/skills',
    detect: [join(home, '.kimi')],
    bins: ['kimi'],
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    global: join(home, '.gemini', 'antigravity', 'skills'),
    project: '.agent/skills',
    detect: [join(home, '.gemini', 'antigravity')],
    bins: ['antigravity'],
  },
  {
    id: 'augment',
    name: 'Augment',
    global: join(home, '.augment', 'skills'),
    project: '.augment/skills',
    detect: [join(home, '.augment')],
    bins: ['augment'],
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    global: join(home, '.openclaw', 'skills'),
    project: 'skills',
    detect: [join(home, '.openclaw'), join(home, '.clawdbot'), join(home, '.moltbot')],
    bins: ['openclaw'],
  },
  {
    id: 'codebuddy',
    name: 'CodeBuddy',
    global: join(home, '.codebuddy', 'skills'),
    project: '.codebuddy/skills',
    detect: [join(home, '.codebuddy')],
    bins: ['codebuddy'],
  },
  {
    id: 'crush',
    name: 'Crush',
    global: join(home, '.config', 'crush', 'skills'),
    project: '.crush/skills',
    detect: [join(home, '.config', 'crush')],
    bins: ['crush'],
  },
  {
    id: 'droid',
    name: 'Droid',
    global: join(home, '.factory', 'skills'),
    project: '.factory/skills',
    detect: [join(home, '.factory')],
    bins: ['droid'],
  },
  {
    id: 'junie',
    name: 'Junie',
    global: join(home, '.junie', 'skills'),
    project: '.junie/skills',
    detect: [join(home, '.junie')],
    bins: ['junie'],
  },
  {
    id: 'kilo',
    name: 'Kilo Code',
    global: join(home, '.kilocode', 'skills'),
    project: '.kilocode/skills',
    detect: [join(home, '.kilocode')],
    bins: ['kilo'],
  },
  {
    id: 'kiro',
    name: 'Kiro CLI',
    global: join(home, '.kiro', 'skills'),
    project: '.kiro/skills',
    detect: [join(home, '.kiro')],
    bins: ['kiro'],
  },
  {
    id: 'qwen',
    name: 'Qwen Code',
    global: join(home, '.qwen', 'skills'),
    project: '.qwen/skills',
    detect: [join(home, '.qwen')],
    bins: ['qwen'],
  },
  {
    id: 'trae',
    name: 'Trae',
    global: join(home, '.trae', 'skills'),
    project: '.trae/skills',
    detect: [join(home, '.trae')],
    bins: ['trae'],
  },
  {
    id: 'universal',
    name: 'Any Agent (shared .agents/skills)',
    global: join(home, '.agents', 'skills'),
    project: '.agents/skills',
    detect: [join(home, '.agents')],
    bins: [],
  },
];

export function hasBinary(name) {
  const dirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
  const extensions = isWindows
    ? (process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM').split(';').filter(Boolean)
    : [''];

  for (const dir of dirs) {
    for (const extension of extensions) {
      try {
        if (fs.existsSync(path.join(dir, `${name}${extension}`))) return true;
      } catch {
        // Ignore unreadable PATH entries.
      }
    }
  }
  return false;
}

export function isDetected(agent) {
  if (agent.detect.some((candidate) => candidate && fs.existsSync(candidate))) return true;
  return (agent.bins || []).some(hasBinary);
}
