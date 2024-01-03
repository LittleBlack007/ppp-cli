#! /usr/bin/env node  
// 该字段是必须的，触发ppp-cli时告诉操作系统用node环境来执行cli.js文件

// 修改package.json文件，新增bin字段, 配置ppp-cli变量，触发时执行文件地址指向./bin/cli.js。
console.log('--欢迎使用--PPP-CLI');

const path = require("path");
const package = require('../package.json');
const program = require('commander');
// inquirer是一个交互式命令行工具库，用于与用户进行交互，最新版本需要import引入，所以本文用的^8.2.5版本
const inquirer = require("inquirer");
// 可选择模板
const templates = require('./templates.js');
// 使用download-git-repo依赖来完成git项目模版的下载
// 默认会拉取master分支的代码，如果想从其他分支拉取代码，可以在git地址后面添加#branch选择分支。
const downloadGitRepo = require('download-git-repo');
// 一个命令行的loading动画库
const ora = require('ora');

// 引入命令行模板==========为了让下面命令可执行，引用program库来解决
// # npm 6.x
// npm create vite@latest my-vue-app --template vue

// # npm 7+, extra double-dash is needed:
// npm create vite@latest my-vue-app -- --template vue

// # yarn
// yarn create vite my-vue-app --template vue

// # pnpm
// pnpm create vite my-vue-app --template vue



console.log(process.cwd());

// 定义当前版本
program.version(`**v${package.version}**`);
program.on('--help', () => {}) // 添加--help
// 解析用户执行命令传入参数

// type: 问题类型，可以是 input（输入框）、list（列表选择框）、confirm（二选一选择框）等
// name: 问题名称，用于标识答案对象中对应的属性名
// message: 问题描述，将会作为问题提示信息展示给用户
// choices: 选项列表，只有当问题类型为 list 时才需要提供
program
  .command('create')
  .description('创建模板')
  .action(async () => { 
    const {template} = await inquirer.prompt({
      type: 'list',
      name: 'template',
      message: '请选择项目名称',
      choices: templates // 模版列表
    })
    console.log(templates);
    let item = templates.find(item => item.value === template);
    // 获取目标文件夹 process.cwd()-获取用户执行命令行所在的目录位置
    const dest = path.join(process.cwd(), item.name)
    const loading = ora('开始下载模版...'); // 定义loading
    // 下载模版
    console.log(template, '=====>',dest)
    loading.start()
    downloadGitRepo(template, dest,(err) => {
      if (err) {
        loading.fail('创建模版失败：' + err.message) // 失败loading
      } else {
        loading.succeed('创建模版成功!') // 成功loading
      }
    })
  })

program.parse(process.argv); // ppp-cli --version  输出：**v1.0.0**
