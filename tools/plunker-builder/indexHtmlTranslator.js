module.exports = {
  translate: translate
};

var _rxRules = {
  basehref: {
    from: /<base href=".*"[/]?>/,
    to: '<script>document.write(\'<base href="\' + document.location + \'" />\');</script>'
  },
  script: {
    from: /<script.*".*%tag%".*>.*<\/script>/,
    to: '<script src="%tag%"></script>'
  },
  link: {
    from: '/<link rel="stylesheet" href=".*%tag%".*>/',
    to: '<link rel="stylesheet" href="%tag%">'
  },
  config: {
    from: /\s*System.config\(\{\s*packages:[\s\S]*\}\}\s*\}\);/m,
    to: "\n" +
        "      System.config({\n" +
        "        transpiler: 'typescript', \n" +
        "        typescriptOptions: { emitDecoratorMetadata: true }, \n" +
        "        packages: {'app': {defaultExtension: 'ts'}} \n" +
        "      });"
  },

};

var _rxData = [
  {
    pattern: 'basehref',
  },
  {
    pattern: 'script',
    from: 'node_modules/systemjs/dist/system.src.js',
    to:   ['https://code.angularjs.org/tools/system.js', 'https://code.angularjs.org/tools/typescript.js']
    //to:   ['https://rawgithub.com/systemjs/systemjs/0.19.6/dist/system.js', 'https://code.angularjs.org/tools/typescript.js']
    // to: ['https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.18.4/system.js', 'https://code.angularjs.org/tools/typescript.js' ]
  },
  {
    pattern: 'script',
    from: 'node_modules/angular2/bundles/angular2.dev.js',
    to: 'https://code.angularjs.org/2.0.0-alpha.55/angular2.dev.js'
  },
  {
    pattern: 'script',
    from: 'node_modules/angular2/bundles/angular2-all.umd.dev.js',
    to: 'https://code.angularjs.org/2.0.0-alpha.55/angular2-all.umd.dev.js'
  },  
  {
    pattern: 'script',
    from: 'node_modules/angular2/bundles/angular2-polyfills.js',
    to: 'https://code.angularjs.org/2.0.0-alpha.55/angular2-polyfills.js'
  },
  {
    pattern: 'script',
    from: 'node_modules/rxjs/bundles/Rx.js',
    to: 'https://code.angularjs.org/2.0.0-alpha.55/Rx.js'
  },  
  {
    pattern: 'script',
    from: 'node_modules/rxjs/bundles/rx.umd.js',
    to: 'https://code.angularjs.org/2.0.0-alpha.55/Rx.umd.js'
  },  
  {
    pattern: 'script',
    from: 'node_modules/angular2/bundles/router.dev.js',
    to: 'https://code.angularjs.org/2.0.0-alpha.55/router.dev.js'
  },
  {
    pattern: 'script',
    from: 'node_modules/angular2/bundles/http.dev.js',
    to: 'https://code.angularjs.org/2.0.0-alpha.55/http.dev.js'
  },
  {
    pattern: 'script',
    from: 'node_modules/angular2/bundles/testing.dev.js',
    to: 'https://code.angularjs.org/2.0.0-alpha.55/testing.dev.js'
  },
  {
    pattern: 'link',
    from: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
    to: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap-theme.min.css'
    // to: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css'
  },
  {
    pattern: 'config',
  }
];



function translate(html) {
  _rxData.forEach(function(rxDatum) {
    var rxRule = _rxRules[rxDatum.pattern];
    // rxFrom is a rexexp
    var rxFrom = rxRule.from;
    if (rxDatum.from) {
      var from = rxDatum.from.replace('/', '\/');
      var rxTemp = rxFrom.toString();
      rxTemp = rxTemp.replace('%tag%', from);
      rxFrom = rxFromString(rxTemp);
    }
    // rxTo is a string
    var rxTo = rxRule.to;
    if (rxDatum.to) {
      var to = rxDatum.to;
      to = Array.isArray(to) ? to : [to];
      to = to.map(function (toItem) {
        return rxTo.replace("%tag%", toItem);
      });
      rxTo = to.join("\n    ");
    }
    html = html.replace(rxFrom, rxTo );
  });

  return html;
}

function rxFromString(rxString) {
  var rx = /^\/(.*)\/(.*)/;
  var pieces = rx.exec(rxString);
  return RegExp(pieces[1], pieces[2]);
}
