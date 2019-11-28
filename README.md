<div align="center">
  <img src=".github/clinia-logo.svg" width="250">
  <h1>React Vision</h1>
  <h4>React library that lets you create a health-care search experience using Clinia's search API.</h4>
  <a href="https://www.npmjs.com/package/react-vision">
    <img src="http://img.shields.io/npm/v/react-vision.svg" alt="View on npm">
  </a>
  <p>
    <a href="#why">Why</a> •
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#examples">Examples</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#-license">License</a>
  </p>
</div>

# Why

#### React Vision is the result of Clinia's effort to make its expertise more accessible to its partners. The Vision tools allow partners to create their own health-care search experience, for internal or external use, using Clinia's search API.

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

## React example ([README](./examples/default))

Inside the **[React example](./examples/default)** folder:

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
