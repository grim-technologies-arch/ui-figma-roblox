import readline from 'node:readline';

const colorEnabled = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR && process.env.TERM !== 'dumb';

const style = (code) => (value) => (colorEnabled ? `\u001b[${code}m${value}\u001b[0m` : String(value));

export const bold = style('1');
export const dim = style('2');
export const red = style('31');
export const green = style('32');
export const yellow = style('33');
export const cyan = style('36');
export const magenta = style('35');

export function createPrompter() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: Boolean(process.stdin.isTTY),
  });
  const queued = [];
  const waiting = [];
  let closed = false;

  rl.on('line', (line) => {
    const resolve = waiting.shift();
    if (resolve) resolve(line);
    else queued.push(line);
  });

  rl.on('close', () => {
    closed = true;
    while (waiting.length) waiting.shift()(null);
  });

  return {
    ask(question) {
      process.stdout.write(question);
      if (queued.length) return Promise.resolve(queued.shift());
      if (closed) return Promise.resolve(null);
      return new Promise((resolve) => waiting.push(resolve));
    },
    close() {
      rl.close();
    },
  };
}

export function createProgress(label) {
  let lastUpdate = 0;
  let lastPercent = -1;

  return ({ received, total }) => {
    const now = Date.now();
    const percent = total ? Math.min(100, Math.floor((received / total) * 100)) : -1;

    if (process.stdout.isTTY) {
      if (now - lastUpdate < 100 && received !== total) return;
      lastUpdate = now;
      const receivedMb = (received / 1048576).toFixed(1);
      if (total) {
        const totalMb = (total / 1048576).toFixed(1);
        process.stdout.write(`\r${label} ${percent}% (${receivedMb}/${totalMb} MB)`);
      } else {
        process.stdout.write(`\r${label} ${receivedMb} MB`);
      }
      return;
    }

    if (total && percent !== lastPercent && percent % 10 === 0) {
      lastPercent = percent;
      const receivedMb = (received / 1048576).toFixed(1);
      const totalMb = (total / 1048576).toFixed(1);
      console.log(`${label} ${percent}% (${receivedMb}/${totalMb} MB)`);
    }
  };
}

export function finishProgress() {
  if (process.stdout.isTTY) process.stdout.write('\n');
}
