
var _    = require('lodash');
var ABNF = require('llkp/abnf');

var merge = function(results) {
  return _.extend.apply(
    null,
    _.flatten([{}, results])
  );
}

var runProps = function() {

  var record = "proposition My proposition!";

  var pattern = new ABNF('proposition-object', function(rule) {
    this['proposition-object'] = rule('proposition-header proposition-body').then(merge);
    this['proposition-header'] = rule('"proposition" " "').select(0).as('object_type');
    this['proposition-body']   = rule('`(.|\\n){1,240}`').select(0).text().as('text');
  });

  var results = pattern.exec(record);
  console.log('proposition:\n', results);
};

var runArgs = function() {

  var record =
    "argument\n\n" +
    "title My Argument!\n" +
    "premise <sha1>\n" +
    "premise <sha1>\n" +
    "conclusion <sha1>\n";

  var pattern = new ABNF('argument-object', function(rule) {
    this['argument-object'] = rule('argument-header argument-body').then(merge);
    this['argument-header']     = rule('"argument" `\\n\\n`').select(0).as('object_type');
    this['argument-body']       = rule('argument-title argument-premises argument-conclusion');
    this['argument-title']      = rule('"title " `.*` `\\n`').select(1).as('title');
    this['argument-premises']   = rule('*(argument-premise)').as('premise_sha1s');
    this['argument-premise']    = rule('"premise " `.*` `\\n`').select(1);
    this['argument-conclusion'] = rule('"conclusion " `.*` `\\n`').select(1).as('conclusion_sha1');
  });

  var results = pattern.exec(record);
  console.log('argument:\n', results);
};

var main = function() {
  runProps();
  runArgs();
};

main();
