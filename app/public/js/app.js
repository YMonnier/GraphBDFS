/**
 * Created by Ysee on 07/05/16.
 *
 */


var graph = (function () {
    return {
        app: angular.module('GraphBDFS', []),
        modules: {},
        nodes: [],
        links: []
    }
})();

graph.modules.datastruct = (function () {
    return {
        init: function (nodes, links) {
            //graph.nodes = nodes;
            //graph.links = links;

            nodes.forEach(function (node) {
                links.forEach(function (link) {
                    if (link.source === node) {
                        if (!node.neighbours.includes(link.target))
                            node.neighbours.push(link.target)
                    } else if (link.target === node) {
                        if (!node.neighbours.includes(link.source))
                            node.neighbours.push(link.source)
                    }
                })
            })
            console.log(nodes);
        }
    }
})();
/**
 Configuration Controller
 This controller allows to add, remove nodes or links.
 */
graph.app.controller('ConfigController', function ($scope) {
    var previousRootNode = {};
    $scope.nodes = [];
    $scope.links = [];

    $scope.nextStep = function () {
        console.log($scope.nodes.length === 0);
        console.log($scope.links.length === 0);
        console.log($scope.nodes.length === 0 || $scope.links.length === 0);
        if ($scope.nodes.length === 0 || $scope.links.length === 0) {
            console.log('HERE??');
            alert('Please, add nodes or edges.');
        } else {
            console.log('INI DATASTRUCT');
            graph.modules.datastruct.init($scope.nodes, $scope.links);
        }
    };

    /**
     * Add a new node
     * @param nodeName, node's name
     */
    $scope.addNode = function (nodeName) {
        //filter same node
        var nf = $scope.nodes.filter(function (node) {
            return node.name === nodeName
        });
        if (nf.length == 0 && nodeName) { //node doesn't exist
            $scope.nodes.push({
                name: nodeName,
                visited: false,
                root: $scope.nodes.length === 0,
                neighbours: [],
                disabled: {source: false, target: false}
            });
            if ($scope.nodes.length > 0)
                previousRootNode = $scope.nodes[0];
        } else {
            alert('Node already exists.\nPlease choose another node\'s name');
        }

        $scope.nodeName = '';
    };

    /**
     * Remove a node
     * @param index, node's index to remove
     */
    $scope.removeNode = function (index) {
        updateLinks($scope.nodes[index]);
        $scope.nodes.splice(index, 1);
        if ($scope.nodes.length > 0 && index === 0)
            $scope.nodes[0].root = true
    };

    /**
     * Update all textBox, put false to previous selected node
     * @param node, object node
     */
    $scope.rootChange = function (node) {
        if (previousRootNode != node) {
            previousRootNode.root = false;
            node.root = true
        }
        previousRootNode = node;
    };

    /**
     * Add a new link
     * @param source, source node's index
     * @param target, targer node's index
     */
    $scope.addLink = function (source, target) {
        console.log('addLink');
        console.log(source);
        console.log(target);
        $scope.links.push({
            source: $scope.nodes[source],
            target: $scope.nodes[target]
        });
        $scope.source = -1;
        $scope.target = -1;
        initializeDisableItem();
    };

    /**
     * Update select boxes
     * Disable or enable the best choices
     * @param select, `select` selected
     * @param index, node's index
     */
    $scope.disabledChange = function (select, index) {
        if (index != -1) {

            if ($scope.source === $scope.target) {
                initializeDisableItem();
                $scope.source = -1;
                $scope.target = -1;
                return;
            }

            switch (select) {
                case 'source':
                    console.log('$scope.target : ' + $scope.target);
                    if ($scope.target === -1) {
                        filterTarget(index);
                    }
                    break;
                case 'target':
                    //$scope.source = -1;
                    if ($scope.source === -1) {
                        filterSource(index);
                    }
                    break;
            }
            previousDisableLink = $scope.nodes[index];
        }

        /**
         * Filter source checkbox depending on node target selected
         * @param index, index node target selected
         */
        function filterSource(index) {
            $scope.nodes[index].disabled.source = true;
            $scope.links.forEach(function (l) {
                if (l.source === $scope.nodes[index] || l.target === $scope.nodes[index]) {
                    l.source.disabled.source = true;
                    l.target.disabled.source = true;
                } else {
                    l.source.disabled.source = false;
                    l.target.disabled.source = false;
                }
            });
        }

        /**
         * Filter target checkbox depending on node source selected
         * @param index, index node source selected
         */
        function filterTarget(index) {
            $scope.nodes[index].disabled.target = true;
            $scope.links.forEach(function (l) {
                if (l.source === $scope.nodes[index] || l.target === $scope.nodes[index]) {
                    l.source.disabled.target = true;
                    l.target.disabled.target = true;
                } else {
                    l.source.disabled.target = false;
                    l.target.disabled.target = false;
                }
            });
        }
    };

    /**
     * Update links, remove links which depended on the node
     * @param node, node dependence
     */
    function updateLinks(node) {
        console.log('updateLinks...');
        console.log($scope.links.length);

        var tmp = $scope.links.filter(function (l) {
            return l.source.name !== node.name && l.target.name !== node.name
        });
        console.log('TMP :: ' + tmp.length);
        $scope.links = tmp;
        console.log($scope.links.length);
    }

    /**
     * Enable each choices for textBox
     */
    function initializeDisableItem() {
        $scope.nodes.forEach(function (n) {
            n.disabled.source = false;
            n.disabled.target = false;
        })
    }
});