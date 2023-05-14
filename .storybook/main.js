/** @type { import('@storybook/web-components-webpack5').StorybookConfig } */
const path = require('path');

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/web-components-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  // webpackFinal: async (config, { configType }) => {
  // config.module.rules.push({
  //   test: /\.ejs$/,
  //   use: ['ejs-compiled-loader'],
  //   include: path.resolve(__dirname, '../html/inc')
  // })
  // console.log(__dirname);
  // return config
// }
};
export default config;
