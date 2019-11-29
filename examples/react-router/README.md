<div align="center">
  <img src="../../.github/clinia-logo.svg" width="250">
  <h1>React example</h1>
  <h4>Example showcasing how the React Vision library can be used to power a react web application</h4>
  <p>
    <a href="#features">Features</a>
  </p>
</div>

# Features

- A search results page that showcases a search header, a results list and a map view.
- Synchronize your vision url with react-router
- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Clone the example

```bash
curl https://codeload.github.com/clinia/react-vision/tar.gz/develop | tar -xz --strip=2 react-vision-develop/examples/react-router
```

## Start the example

You will need to provide your own Google Maps Api Key inside the `src/components/pages/Search.js` file.

```
yarn install --no-lockfile
yarn start
```
