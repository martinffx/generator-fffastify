var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.appname = args[0];

    this.env.options.nodePackageManager = 'yarn';
    this.destinationPath('index.js');
  }

  async name() {
    this.log(this.sourceRoot())
    this.log(this.contextRoot)

    if (!this.appname) {
      this.appname = await this.prompt([
        {
          type: "input",
          name: "name",
          message: "Your project name",
          default: 'fffastify'
        }
      ]);
      this.destinationRoot(this.appname)
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: 'Templating with Yeoman' }
    );
  }
};
