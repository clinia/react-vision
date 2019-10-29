const path = require('path');
const glob = require('glob');
const execSync = require('child_process').execSync;
const [version] = process.argv.slice(2);

const examplesPath = path.join(__dirname, '..', 'examples');

{
  // Update React Vision DOM
  const examples = glob.sync(path.join(examplesPath, '!(react-native*)'));

  examples.forEach(example => {
    execSync(`cd ${example} && yarn upgrade react-vision-dom@${version}`, {
      stdio: 'inherit',
    });
  });
}

{
  // Update React Vision Native
  const examples = glob.sync(path.join(examplesPath, '+(react-native*)'));

  examples.forEach(example => {
    // @TODO: update to react-vision-native
    execSync(`cd ${example} && yarn upgrade react-vision@${version}`, {
      stdio: 'inherit',
    });
  });
}

{
  // Update React Vision DOM Maps
  const examples = glob.sync(path.join(examplesPath, 'geo-search'));

  examples.forEach(example => {
    execSync(`cd ${example} && yarn upgrade react-vision-dom-maps@${version}`, {
      stdio: 'inherit',
    });
  });
}
