const app = require('./app');
const { port } = require('./config/env');
const { runSeed } = require('./seed/seed');

async function start() {
  await runSeed();
  app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
