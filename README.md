<div align="center">
  <img src=".github/clinia-logo.svg" width="250">
  <h1>React Vizion</h1>
  <h4>React library that lets you create a healthcare search experience using Clinia's search API.</h4>
  <p>
    <a href="#why">Why</a> •
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#examples">Examples</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#-license">License</a>
  </p>
</div>

<div align="center">

[![Version][version-svg]][package-url] [![Build Status][ci-svg]][ci-url] [![License][license-image]][license-url] [![Downloads][downloads-image]][downloads-url]

</div>

# Why

#### React Vizion is the result of Clinia's effort to make its expertise more accessible to its partners. The Vizion tools allow partners to create their own healthcare search experience, for internal or external use, using Clinia's search API.

# Features

- **[Widgets](./doc/widgets/README.md)** that offer bare UI components to be customized be the partners.
- **[Connectors](./doc/connectors/README.md)** that allows the partners to link their own components with the Clinia's search logic.
- Compatible with **React** and **React-Native**
- Available **[Storybook](https://storybook.js.org)** to experiment with the components

# Getting Started

React Vizion is available on [npm](https://www.npmjs.com/get-npm) registry. It relies on [`clinia`](https://github.com/clinia/clinia-client-javascript) to communicate with Clinia APIs.

```
npm install @clinia/react-vizion-dom clinia
OR
yarn add @clinia/react-vizion-dom clinia
```

# Examples

## React example ([README](./examples/react-router))

Inside the **[React example](./examples/react-router)** folder:

```
yarn install
```

Then

```
yarn start
```

## React-Native example ([README](./examples/react-native))

Inside the **[React-Native example](./examples/react-native)** folder:

```
yarn install
```

Then

```
yarn start
```

This example uses **[Expo](https://github.com/expo/expo)** and can therefore be launch using the expo cli :

```
expo start
```

# Contributing

We welcome all contributors, from casual to regular. You are only one command away to start the developer environment, [read our CONTRIBUTING guide](CONTRIBUTING.md).

# 📄 License

React Vizion is an open-sourced software licensed under the [MIT license](LICENSE).

<!-- Links -->

[ci-svg]: https://img.shields.io/circleci/build/gh/clinia/react-vizion/master?style=flat-square
[ci-url]: https://circleci.com/gh/clinia/react-vizion
[license-image]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/@clinia/react-vizion.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=@clinia/react-vizion
[version-svg]: https://img.shields.io/npm/v/@clinia/react-vizion.svg?style=flat-square
[package-url]: https://yarnpkg.com/en/package/@clinia/react-vizion
