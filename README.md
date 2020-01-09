<div align="center">
  <img src=".github/clinia-logo.svg" width="250">
  <h1>React Vision</h1>
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

#### React Vision is the result of Clinia's effort to make its expertise more accessible to its partners. The Vision tools allow partners to create their own healthcare search experience, for internal or external use, using Clinia's search API.

# Features

- **[Widgets](./doc/widgets/README.md)** that offer bare UI components to be customized be the partners.
- **[Connectors](./doc/connectors/README.md)** that allows the partners to link their own components with the Clinia's search logic.
- Compatible with **React** and **React-Native**
- Available **[Storybook](https://storybook.js.org)** to experiment with the components

# Getting Started

React Vision is available on [npm](https://www.npmjs.com/get-npm) registry. It relies on [`cliniasearch`](https://github.com/clinia/cliniasearch-client-javascript) to communicate with Clinia APIs.

```
npm install react-vision-dom cliniasearch
OR
yarn add react-vision-dom cliniasearch
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

React Vision is an open-sourced software licensed under the [MIT license](LICENSE).

<!-- Links -->

[ci-svg]: https://circleci.com/gh/clinia/react-vision.svg?style=svg
[ci-url]: https://circleci.com/gh/clinia/react-vision
[license-image]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/react-vision.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=react-vision
[version-svg]: https://img.shields.io/npm/v/react-vision.svg?style=flat-square
[package-url]: https://yarnpkg.com/en/package/react-vision
