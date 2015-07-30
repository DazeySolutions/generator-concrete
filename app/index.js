'use strict';

/* Dependencies */

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _s = require('underscore.string');

/* Vars */

var tempDir = '.tmp/';
var webRoot = 'public_html/';
var application = 'application/';
var webRootThemesDir = webRoot + application + 'themes/';
var webRootBlocksDir = webRoot + application + 'blocks/';
var concreteGITRepo = 'https://github.com/DazeySolutions/concrete.git';
var tempConcreteRepo = tempDir + 'concrete/';
var themeBoilerplateRepo = 'https://github.com/DazeySolutions/frontend-boilerplate.git';
var tempFrontendBoilerplateDir = tempDir + 'theme/';
var srcThemesDir = 'themes/';
var successMessage = 'Done';

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.pkg = require('../package.json');
  },

  askFor: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the Yeoman ' + chalk.blue('Concrete 5') + ' generator!'
    ));

    /* User defined data */

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'Enter project name',
      default: 'custom'
    }, {
      type: 'input',
      name: 'projectVersion',
      message: 'Enter project version',
      default: '0.0.1'
    }, {
      type: 'input',
      name: 'concreteVersion',
      message: 'Enter Concrete Version',
      default: '5.7.4.2'
    }, {
      type: 'input',
      name: 'yourName',
      message: 'Enter your name',
      default: 'Mark Dazey'
    }, {
      type: 'input',
      name: 'yourEmail',
      message: 'Enter your email',
      default: 'mark@dazeysolutions.com'
    }, {
      type: 'input',
      name: 'dbHost',
      message: 'Enter Database Host',
      default: '127.0.0.1'
    }, {
      type: 'input',
      name: 'dbName',
      message: 'Enter Database Name',
      default: 'db'
    }, {
      type: 'input',
      name: 'dbUser',
      message: 'Enter Database Username',
      default: 'user'
    }, {
      type: 'input',
      name: 'dbPassword',
      message: 'Enter Database Password',
      default: 'p@s$w0rd'
    }];

    this.log(chalk.green('Tell me a bit about your project...'));
    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.projectVersion = props.projectVersion;
      this.yourEmail = props.yourEmail;
      this.yourName = props.yourName;
      this.dbHost = props.dbHost;
      this.dbName = props.dbName;
      this.dbUser = props.dbUser;
      this.dbPassword = props.dbPassword;
      this.srcThemeDir = srcThemesDir + props.projectName + '/';
      this.concreteVersion = props.concreteVersion;
      done();
    }.bind(this));
  },

  app: function () {

    /* Create core directories */

    this.log(chalk.green('Creating core directories...'));
    this.mkdir(this.srcThemeDir);
    this.mkdir(webRoot);
    this.log(chalk.green.bold(successMessage));

    /* Copy core files */
	
    this.log(chalk.green('Copying core project files...'));
	this.copy('_concrete-excludes.txt', tempDir + 'concrete-excludes.txt');
	this.template('_bower.json', tempDir + 'bower.json', {
      projectName: this.projectName,
      projectVersion: this.projectVersion,
      yourEmail: this.yourEmail,
      yourName: this.yourName
    });
    this.template('_package.json', tempDir + 'package.json', {
      projectName: this.projectName,
      projectVersion: this.projectVersion,
      yourEmail: this.yourEmail,
      yourName: this.yourName
    });
	this.copy('_frontend-boilerplate-excludes.txt', tempDir + 'frontend-boilerplate-excludes.txt');
	this.copy('_gulpfile.js', tempDir + 'gulpfile.js');
    // Core project files
    this.template('_gitignore', webRoot + '.gitignore');
    this.copy('gitattributes', webRoot + '.gitattributes');
    this.template('_bower.json', this.srcThemeDir + 'bower.json');
    this.copy('bowerrc', this.srcThemeDir + '.bowerrc');
    this.copy('jshintrc', this.srcThemeDir + '.jshintrc');
    this.copy('editorconfig', this.srcThemeDir + '.editorconfig');

    this.log(chalk.green.bold(successMessage));
  },

  install: function () {

    this.on('end', function () {
      if (!this.options['skip-install']) {

        /**
         * Run the following tasks consecutively
         */

        /* Process tasks */

        this.processTask = function (task) {
          this.log(chalk.green(task.msg));
          this.spawnCommand(task.cmd, task.args, task.opts)
          .on('exit', function (err) {
            if (err) {
              this.log.error(chalk.red.bold('Choke... Error: ' + err));
            } else {
              this.emit('nextTask');
            }
          }.bind(this));
        };

        /* Move to next task */

        this.on('nextTask', function () {
          var next = this.tasks.shift();
          if (next) {
            this.log(chalk.green.bold(successMessage));
            this.processTask(next);
          } else {
            this.createSymlinks();
            this.cleanUp();
            this.log(chalk.green.bold('Yo, all done!'));
          }
        });

        /* Task config */

        // Prep
        this.tasks = [];

        // Clone concrete repo
        this.tasks.push({
          cmd: 'git',
          args: [
            'clone',
            concreteGITRepo,
            tempConcreteRepo
          ],
          msg: 'Cloning concrete repo...'
        });
        

        // Move concrete files
        this.tasks.push({
          cmd: 'rsync',
          args: [
            '-vaz',
            '--exclude-from',
            tempDir + 'concrete-excludes.txt',
            tempConcreteRepo,
            webRoot
          ],
          msg: 'Moving required concrete files...'
        });

        // Clone frontend-boilerplate repo
        this.tasks.push({
          cmd: 'git',
          args: [
            'clone',
            themeBoilerplateRepo,
            tempFrontendBoilerplateDir
          ],
          msg: 'Cloning frontend-boilerplate repo...'
        });

        // Move frontend-boilerplate files
        this.tasks.push({
          cmd: 'rsync',
          args: [
            '-vaz',
            '--exclude-from',
            tempDir + 'frontend-boilerplate-excludes.txt',
            tempFrontendBoilerplateDir,
            this.srcThemeDir
          ],
          msg: 'Moving required frontend-boilerplate files...'
        });
        
        this.tasks.push({
			cmd: 'cp',
			args: [
				tempDir+'bower.json',
				this.srcThemeDir+'bower.json'
			],
			msg: 'Copying bower.json...'
        });

		this.tasks.push({
			cmd: 'cp',
			args: [
				tempDir+'package.json',
				this.srcThemeDir+'package.json'
			],
			msg: 'Copying package.json...'
        });

		this.tasks.push({
			cmd: 'cp',
			args: [
				tempDir+'gulpfile.js',
				this.srcThemeDir+'gulpfile.js'
			],
			msg: 'Copying gulpfile...'
        });

        // npm install
        this.tasks.push({
          cmd: 'npm',
          args: ['install'],
          opts: {
            cwd: this.srcThemeDir
          },
          msg: 'Installing npm dependencies...'
        });

        // bower install
        this.tasks.push({
          cmd: 'bower',
          args: ['install'],
          opts: {
            cwd: this.srcThemeDir
          },
          msg: 'Installing bower components...'
        });

        // Grunt build
        this.tasks.push({
          cmd: 'gulp',
          args: ['dev'],
          opts: {
            cwd: this.srcThemeDir
          },
          msg: 'Initial build for the theme...'
        });

        /* Start the tasks */

        this.processTask(this.tasks.shift());

        /* Finish and clean up */

        this.createSymlinks = function () {
          this.log(chalk.green('Creating directory symlinks...'));
          this.spawnCommand('ln', ['-s', '../' + this.srcThemesDir], { cwd: webRootThemesDir });

        };

        this.cleanUp = function () {
          this.log(chalk.green('Cleaning up...'));
          this.spawnCommand('rm', ['-rf', tempDir]);
        };

      }
    });

  }
});
