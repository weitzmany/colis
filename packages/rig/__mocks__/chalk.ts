const chalk = (str: string) => str;
chalk.blue = (str: string) => str;
chalk.green = (str: string) => str;
chalk.red = (str: string) => str;
chalk.yellow = (str: string) => str;
chalk.gray = (str: string) => str;
chalk.cyan = (str: string) => str;
chalk.bold = {
  green: (str: string) => str,
  red: (str: string) => str,
  yellow: (str: string) => str,
  blue: (str: string) => str,
  cyan: (str: string) => str,
};

export default chalk;
