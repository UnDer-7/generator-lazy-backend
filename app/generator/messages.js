const chalk = require('chalk')
/**
 * All messages colors used on the project
 * - __error__: chalk.red.bold
 * - __titleDash__: chalk.green
 * - __dash__: chalk.cyanBright.bold
 * - __initialText__: chalk.red
 * - __greenText__: chalk.greenBright
 * - __endingMessage__: chalk.bold.magenta
 * - __urlGitHub__: chalk.bold.magenta.underline
 * - __warning__: chalk.bold.yellow.underline
 * - __underline__: chalk.bold.underline
 * - __author__: chalk.cyanBright.bold
 */
module.exports = {
  /**
   * chalk.red.bold
   */
  error: chalk.red.bold,
  /**
   * chalk.green
   */
  titleDash: chalk.green,
  /**
   * chalk.cyanBright.bold
   */
  dash: chalk.cyanBright.bold,
  /**
   * chalk.red
   */
  initialText: chalk.red,
  /**
   * chalk.greenBright
   */
  greenText: chalk.greenBright,
  /**
   * chalk.bold.magenta
   */
  endingMessage: chalk.bold.magenta,
  /**
   * chalk.bold.magenta.underline
   */
  urlGitHub: chalk.bold.magenta.underline,
  /**
   * chalk.bold.yellow.underline
   */
  warning: chalk.bold.yellow.underline,
  /**
   * chalk.bold.underline
   */
  underline: chalk.bold.underline,
  /**
   * chalk.cyanBright.bold
   */
  author: chalk.cyanBright.bold
}
