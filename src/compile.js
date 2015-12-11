var convertSourceMap = require("convert-source-map");
var escodegen = require("escodegen");
var esmangle = require("esmangle");
var uniq = require("lodash/array/uniq");
var OopsyData = require("oopsy-data");

var addLocMaker = require("./file-index-to-position-mapper");
var transformAst = require("./transform-ast");
var traverse = require("./traverse");
var optimize = require("./optimize");
var parse = require("./file-parse");
var lint = require("./lint");

var SHOULD_MANGLE = false;
var SHOULD_OPTIMIZE = true;

function ensureNewline(x) {
    if (x.charAt(x.length - 1) === "\n") {
        return x;
    }
    return x + "\n";
}

function generateCodeAndSourceMap(node, name, code) {
    return escodegen.generate(node, {
        sourceMap: name,
        sourceMapWithCode: true,
        sourceContent: code
    });
}

function addSourceMapUrl(code, sourceMap) {
    var comment = convertSourceMap.fromJSON(sourceMap).toComment();
    return code + comment + "\n";
}

// TODO: Make it possible to compile REPL code as well.
function compile(code, filename, options) {
    // TODO: Merge options if there are ever more.
    options = options || {
        embedSourceMaps: true,
        color: false
    };
    if (arguments.length !== compile.length) {
        throw new Error("incorrect argument count to compile");
    }
    var result = parse(code);
    if (!result.status) {
        var expectations = uniq(result.expected);
        var data = "expected one of " + expectations.join(", ");
        var index = Math.min(result.index, code.length - 1);
        var oopsyInput = {index: index, data: data};
        var oopsies =
            OopsyData.fromIndices(code, [oopsyInput], {color: options.color});
        return {
            parsed: false,
            result: {
                expectations: expectations,
                oopsy: oopsies[0]
            }
        };
    }
    var squiggleAst = result.value;
    var addLocToNode = addLocMaker(code, filename);
    traverse.walk({enter: addLocToNode}, squiggleAst);
    var warnings = lint(squiggleAst);
    var contextualWarnings =
        OopsyData.fromLocations(code, warnings, {color: options.color});
    var esAst = transformAst(squiggleAst);
    var mangledAst = SHOULD_MANGLE ?
        esmangle.optimize(esAst) :
        esAst;
    var optimizedAst = SHOULD_OPTIMIZE ?
        optimize(mangledAst) :
        mangledAst;
    var stuff = generateCodeAndSourceMap(
        optimizedAst, filename, code);
    var js = ensureNewline(stuff.code);
    var sourceMap = stuff.map.toString();
    if (options.embedSourceMaps) {
        js = addSourceMapUrl(js, sourceMap);
    }
    return {
        parsed: true,
        warnings: contextualWarnings,
        sourceMap: sourceMap,
        code: js
    };
}

module.exports = compile;
