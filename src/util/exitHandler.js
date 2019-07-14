function pruneEndedGames() {
  Object.values(global.servers).forEach((server) => {
    Object.getOwnPropertyNames(server.games).forEach((gameId) => {
      if (server.games[gameId].status === 'ended') delete server[gameId];
    });
  });
}

const handle = setInterval(pruneEndedGames, 5 * 60 * 1000);

/*
 * This exit handler simply makes sure the program terminates gracefully when
 * it is killed, nodemon restarts, or an error occurs.
 */
function exitHandler(exitCode) {
  clearInterval(handle);
  logger.info('Interval cleared');
  if (exitCode) logger.info(`Exit code: ${exitCode}`);
  process.exit();
}

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
/**
 * We set up an uncaught exception capture callback so that the bot keeps running even when an
 * error occurs
 */
process.setUncaughtExceptionCaptureCallback((err) => {
  logger.error(`An error occurred: ${err}`);
});