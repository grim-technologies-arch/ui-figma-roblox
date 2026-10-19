import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import { URL } from 'node:url';
import { x as extractTar } from 'tar';

export const REPO = 'grim-technologies-arch/ui-figma-roblox';
export const SKILL_NAME = 'ui-figma-roblox';

const CONTENT = [
  'SKILL.md',
  'README.md',
  'LICENSE',
  'ATTRIBUTION.md',
  'references',
  'assets',
  'examples',
];

export function bundleUrl(version) {
  return (
    process.env.UI_FIGMA_ROBLOX_BUNDLE ||
    `https://github.com/${REPO}/releases/download/v${version}/${SKILL_NAME}-skill-v${version}.tar.gz`
  );
}

export function download(url, destination, { onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const follow = (currentUrl, redirects = 0) => {
      if (redirects > 5) {
        reject(new Error('Download failed: too many redirects.'));
        return;
      }

      let parsed;
      try {
        parsed = new URL(currentUrl);
      } catch {
        reject(new Error(`Download failed: invalid URL ${currentUrl}`));
        return;
      }

      const transport = parsed.protocol === 'http:' ? http : https;
      const request = transport.get(
        parsed,
        { headers: { 'user-agent': `${SKILL_NAME}-installer` } },
        (response) => {
          const status = response.statusCode || 0;

          if (status >= 300 && status < 400 && response.headers.location) {
            response.resume();
            follow(new URL(response.headers.location, parsed).toString(), redirects + 1);
            return;
          }

          if (status !== 200) {
            response.resume();
            reject(new Error(`Download failed: HTTP ${status} from ${parsed.hostname}.`));
            return;
          }

          const total = Number(response.headers['content-length']) || 0;
          let received = 0;
          const output = fs.createWriteStream(destination);

          response.on('data', (chunk) => {
            received += chunk.length;
            if (onProgress) onProgress({ received, total });
          });

          response.on('error', reject);
          output.on('error', reject);
          output.on('finish', () => output.close(() => resolve({ received, total })));
          response.pipe(output);
        },
      );

      request.on('error', reject);
      request.setTimeout(30000, () => {
        request.destroy(new Error('Download failed: connection timed out.'));
      });
    };

    follow(url);
  });
}

export async function extract(archive, destination) {
  fs.mkdirSync(destination, { recursive: true });
  await extractTar({ file: archive, cwd: destination, strip: 1 });
}

export function copySkill(source, destination, { force = false } = {}) {
  const marker = path.join(source, 'SKILL.md');
  if (!fs.existsSync(marker)) {
    throw new Error(`No SKILL.md found in ${source}.`);
  }

  if (fs.existsSync(destination) && !force) {
    return { skipped: true, destination };
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const staging = `${destination}.tmp-${process.pid}-${Date.now()}`;
  fs.rmSync(staging, { recursive: true, force: true });

  try {
    fs.mkdirSync(staging, { recursive: true });
    for (const item of CONTENT) {
      const from = path.join(source, item);
      if (!fs.existsSync(from)) continue;
      fs.cpSync(from, path.join(staging, item), { recursive: true });
    }

    fs.rmSync(destination, { recursive: true, force: true });
    fs.renameSync(staging, destination);
    return { skipped: false, destination };
  } catch (error) {
    fs.rmSync(staging, { recursive: true, force: true });
    throw error;
  }
}

export async function fetchBundle(version, { onProgress } = {}) {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `${SKILL_NAME}-`));
  const archive = path.join(workspace, 'skill.tar.gz');
  const source = path.join(workspace, 'skill');

  try {
    const url = bundleUrl(version);
    await download(url, archive, { onProgress });
    await extract(archive, source);

    if (!fs.existsSync(path.join(source, 'SKILL.md'))) {
      throw new Error('The downloaded bundle does not contain SKILL.md.');
    }

    return {
      version,
      url,
      source,
      cleanup() {
        fs.rmSync(workspace, { recursive: true, force: true });
      },
    };
  } catch (error) {
    fs.rmSync(workspace, { recursive: true, force: true });
    throw error;
  }
}
