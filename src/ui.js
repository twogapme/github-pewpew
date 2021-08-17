const style = require('ansi-colors');
const ora = require('ora');
const { prompt } = require('enquirer');

const { getPackageDetails } = require('./utils');

function printWelcome() {
  const PACKAGE = getPackageDetails().package;

  const name = PACKAGE.name;
  const description = PACKAGE.description;
  const version = PACKAGE.version;

  if (name && description && version) {
    console.log(`${style.bold(`${name} v${version}`)}`);
    console.log(description);
    console.log();
  }
}

async function promptGetRepositories(repositories) {
  return await prompt({
    type: 'autocomplete',
    name: 'repos',
    message: 'Select repositories you want to delete:',
    limit: 12,
    multiple: true,
    footer: '––—————––—————––—————––—————––————————————',
    format: (value) => style.green(value),
    choices: repositories.map(({ full_name }) => full_name),
  });
}

function printGetRepositoriesStart() {
  const strMessage = `Fetching repositories…`;
  return ora(strMessage).start();
}

function printGetRepositoriesSucceed(spinner, repoCount) {
  const strMessage = `${repoCount} ${
    repoCount > 1 ? 'repositories' : 'repository'
  } found.`;
  return spinner.succeed(strMessage);
}

async function promptConfirmDelete(repoCount) {
  return await prompt({
    type: 'select',
    name: 'confirmDelete',
    message: `Are you sure?`,
    format: (value) => value,
    choices: [
      {
        name: 'Yes',
        message: `${style.redBright(
          `Yes, delete ${repoCount > 1 ? 'repositories' : 'repository'} (${repoCount})`
        )}`,
        value: true,
      },
      {
        name: 'Cancel',
        message: 'Cancel',
        value: false,
      },
    ],
  });
}

function printConfirmDelete(deletedRepos) {
  const strConfirm = `🔫 pew pew! ${deletedRepos} repositories deleted suscessfully.`;
  const strRecover = `Recover repositories from github.com/settings/repositories`;

  console.log(strConfirm);
  console.log(style.dim(strRecover));

  return true;
}

function printDeleteRepositoryStart(repo) {
  return ora(style.dim(repo)).start();
}

function printDeleteRepositorySucceed(spinner, repo) {
  return spinner.stopAndPersist({
    symbol: '',
    text: style.strikethrough.dim(repo),
  });
}

function printDeleteRepositoryFailed(spinner, repo) {
  strError = `${repo} [ERROR]`;

  return spinner.fail(style.dim(strError));
}

function printNoReposDeleted() {
  const strMessage = `Rest assured, no repositories were deleted.`;

  return console.log(style.dim(strMessage));
}

function printNoReposSelected() {
  const strMessage = `No repositories selected.`;

  return console.log(style.dim(strMessage));
}

function printError(strError) {
  return console.log(style.redBright(strError));
}

function printAuthStart() {
  const strSignIn = `Sign in to GitHub:`;
  console.log(style.dim(strSignIn));

  return ora();
}

async function requestToken(spinner, verification) {
  const strOpen = `Open:`;
  const strURL = verification.verification_uri;
  const strCode = `Code:`;
  const strCodeValue = verification.user_code;
  const strClipboard = `Copied to clipboard!`;

  console.log(`${style.bold(strOpen)} ${style.cyan.underline(strURL)}`);
  console.log(`${style.bold(strCode)} ${strCodeValue} ${style.dim(strClipboard)}`);

  return spinner.start();
}

function printAuthFinished(spinner) {
  spinner.stop();
  return console.log();
}

module.exports = {
  printWelcome,
  printAuthStart,
  requestToken,
  printAuthFinished,
  promptGetRepositories,
  printGetRepositoriesStart,
  printGetRepositoriesSucceed,
  promptConfirmDelete,
  printConfirmDelete,
  printDeleteRepositoryStart,
  printDeleteRepositorySucceed,
  printDeleteRepositoryFailed,
  printNoReposDeleted,
  printNoReposSelected,
  printError,
};
