const IntervalSearch = require('./IntervalSearch.js');
const IntervalSearchTree = require('./IntervalSearchTree.js');

module.exports = function createSearcher(type) {
    switch (type) {
        case 'tree':
            return new IntervalSearchTree();
        default:
            return new IntervalSearch();
    }
}