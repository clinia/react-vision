const path = require('path');
const glob = require('glob');
const execSync = require('child_process').execSync;
const [version] = process.argv.slice(2);

const examplesPath = path.join(__dirname, '..', 'examples');

{
  // Update React Vizion DOM
  const examples = glob.sync(path.join(examplesPath, '!(react-native*)'));

  examples.forEach(example => {
    execSync(
      `cd ${example} && yarn upgrade @clinia/react-vizion-dom@${version}`,
      {
        stdio: 'inherit',
      }
    );
  });
}

{
  // Update React Vizion Native
  const examples = glob.sync(path.join(examplesPath, '+(react-native*)'));

  examples.forEach(example => {
    // @TODO: update to react-vizion-native
    execSync(`cd ${example} && yarn upgrade @clinia/react-vizion@${version}`, {
      stdio: 'inherit',
    });
  });
}

// {
//   // Update React Vizion DOM Maps
//   const examples = glob.sync(path.join(examplesPath, 'geo-search'));

//   examples.forEach(example => {
//     execSync(
//       `cd ${example} && yarn upgrade @clinia/react-vizion-dom-gmaps@${version}`,
//       {
//         stdio: 'inherit',
//       }
//     );
//   });
// }
