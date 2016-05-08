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
        if (nf.length == 0 && nodeName) { //node doesn't exist
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
        updateLinks($scope.nodes[index]);
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

            if($scope.source == $scope.target) {
                initializeDisableItem();
                $scope.source = -1;
                $scope.target = -1;
                return;
            }

            switch (select) {
                case 'source':
                    console.log('$scope.target : ' + $scope.target);
                    if ($scope.target == -1) {
                        filterTarget(index);
                    }
                    break;
                case 'target':
                    //$scope.source = -1;
                    if ($scope.source == -1) {
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
                if (l.source == $scope.nodes[index] || l.target == $scope.nodes[index]) {
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
                if (l.source == $scope.nodes[index] || l.target == $scope.nodes[index]) {
                    l.source.disabled.target = true;
                    l.target.disabled.target = true;
                } else {
                    l.source.disabled.target = false;
                    l.target.disabled.target = false;
                }
            });
        }
    };

    function updateLinks(node) {
        console.log('updateLinks...');
        console.log($scope.links.length);

        var tmp = $scope.links.filter(function (l) {
            console.log(l.source.name != node.name && l.target.name != node.name);
            if(l.source.name !== node.name && l.target.name !== node.name)
                return true;
            else
                return false;
            //return l.source.name == node.name || l.target.name != node.name
        });
        console.log('TMP :: ' + tmp.length);
        $scope.links = tmp;
        console.log($scope.links.length);
    }

    function initializeDisableItem() {
        $scope.nodes.forEach(function (n) {
            n.disabled.source = false;
            n.disabled.target = false;
        })
    }
});