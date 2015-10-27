var estraverse = require("estraverse");
var esprima = require("esprima");
var L = require("lodash");

var predef = require("./predef");

function sortUnique(xs) {
    return L(xs).slice().sort().uniq().value();
}

function needsDeps(name) {
    return name.charAt(0) === "$" &&
        name !== "$match" &&
        name !== "$error";
}

function directDeps(node) {
    function enter(node) {
        if (node.type === "Identifier" && needsDeps(node.name)) {
            deps.push(node.name.slice(1));
        }
    }
    var deps = [];
    estraverse.traverse(node, {enter: enter});
    return sortUnique(deps);
}

function indirectDeps(deps) {
    if (deps.length === 0) {
        return [];
    } else {
        return L(deps)
            .map(function(d) {
                var ds = needsDeps(d) ?
                    indirectDeps(predef[d].dependencies) :
                    [];
                return [d].concat(ds);
            })
            .flatten()
            .uniq()
            .value();
    }
}

function allDepsFor(node) {
    return indirectDeps(directDeps(node));
}

function helpersFor(node) {
    return L(allDepsFor(node))
        .map(function(d) { return predef[d].code; })
        .map(function(code) { return esprima.parse(code); })
        .map("body")
        .flatten()
        .value();
}

module.exports = helpersFor;
