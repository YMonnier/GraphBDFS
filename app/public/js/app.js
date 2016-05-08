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
        init: function () {


        }
    }
})();
/**
 Configuration Controller
 This controller car add, remove nodes or links.
 */
graph.app.controller('ConfigController', function ($scope) {
    console.log('OK');
    var previousRootNode = {};
    var previousDisableLink = 0;
    $scope.nodes = [];
    $scope.links = [];

    /**
     * Add a new node
     * @param nodeName, node's name
     */
    $scope.addNode = function (nodeName) {
        //filter same node
        var nf = $scope.nodes.filter(function (node) {
            return node.name == nodeName
        });
        if (nf.length == 0) { //node doesn't exist
            $scope.nodes.push({
                name: nodeName,
                root: $scope.nodes.length == 0,
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
        $scope.nodes.splice(index, 1);
        if ($scope.nodes.length > 0 && index == 0)
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
        $scope.nodes.forEach(function (n) {
            n.disabled.source = false;
            n.disabled.target = false;
        });
        //$scope.nodes[previousDisableLink].disabled.source = false;
        //$scope.nodes[previousDisableLink].disabled.target = false;
    };

    /**
     * Update select boxes
     * Disable or enable the best choices
     * @param select, `select` selected
     * @param index, node's index
     */
    $scope.disabledChange = function (select, index) {
        //$scope.nodes[previousDisableLink].disabled.source = false;
        //$scope.nodes[previousDisableLink].disabled.target = false;
        if (index != -1) {
            console.log('disabledChange function...');
            console.log(select);
            console.log(index);

            switch (select) {
                case 'source':
                    //$scope.target = -1;
                    console.log('$scope.target : ' + $scope.target);
                    if ($scope.target == -1) {
                        $scope.nodes[index].disabled.target = true;
                        $scope.links.forEach(function (l) {
                            if (l.source == $scope.nodes[index] || l.target == $scope.nodes[index]) {
                                l.source.disabled.target = true;
                                l.target.disabled.target = true;
                            } else {
                                l.source.disabled.target = false;
                                l.target.disabled.target = false;
                            }
                        });
                    } else
                        $scope.target = -1;
                    break;
                case 'target':
                    //$scope.source = -1;
                    if ($scope.source == -1) {
                        $scope.nodes[index].disabled.source = true;
                        $scope.links.forEach(function (l) {
                            if (l.source == $scope.nodes[index] || l.target == $scope.nodes[index]) {
                                l.source.disabled.source = true;
                                l.target.disabled.source = true;
                            } else {
                                l.source.disabled.source = false;
                                l.target.disabled.source = false;
                            }
                        });
                    } else
                        $scope.source = -1;
                    break;
            }
            previousDisableLink = $scope.nodes[index];
        }
        //init();

        function init() {
            $scope.nodes.forEach(function (n) {
                n.disabled.source = false;
                n.disabled.target = false;
            })
        }

        function disabledElement(select) {
            $scope.links.forEach(function (link) {

            });
        }
    };
});