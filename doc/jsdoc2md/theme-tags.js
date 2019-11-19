// See https://github.com/bvanderlaan/jsdoc-route-plugin for examples on how to edit a tag output.

exports.defineTags = function(dictionary) {
  dictionary.defineTag('themekey', {
    mustHaveValue: true,
    mustNotHaveDescription: false,
    canHaveType: true,
    canHaveName: true,
    onTagged: (doclet, tag) => {
      if (!doclet.themes) {
        doclet.themes = [];
      }
      doclet.themes.push({
        name: tag.value.name,
        description: tag.value.description,
      });
    },
  });
};
