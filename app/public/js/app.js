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
            });
            console.log(nodes);
            graph.nodes = nodes;
            graph.links = links;
            $('#modal-config').css('display', 'none');
            graph.modules.engin.init();
        }
    }
})();

graph.modules.engin = (function () {
    var w, h, circleWidth, engin, force, link, node;
    var palette = {
        "white": "#FFFFFF",
        "lightgray": "#819090",
        "gray": "#708284",
        "mediumgray": "#536870",
        "darkgray": "#475B62",
        "darkblue": "#0A2933",
        "darkerblue": "#042029",
        "paleryellow": "#FCF4DC",
        "paleyellow": "#EAE3CB",
        "yellow": "#A57706",
        "orange": "#BD3613",
        "red": "#D11C24",
        "pink": "#C61C6F",
        "purple": "#595AB7",
        "blue": "#2176C7",
        "green": "#259286",
        "yellowgreen": "#738A05"
    };
    return {
        init: function () {
            w = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;

            h = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;

            circleWidth = 7;

            engin = d3.select("#app")
                .append("svg:svg")
                .attr("class", "stage")
                .attr("width", w)
                .attr("height", h);

            force = d3.layout.force()
                .nodes(graph.nodes)
                .links([])
                .gravity(0.1)
                .charge(-1000)
                .size([w, h]);

            link = engin.selectAll(".link")
                .data(graph.links)
                .enter().append("line")
                .attr("class", "link")
                .attr("stroke", palette.gray)
                .attr("fill", "none");

            node = engin.selectAll("circle.node")
                .data(graph.nodes)
                .enter().append("g")
                .attr("class", "node")
                .on("mouseover", function (d, i) {    //MOUSEOVER
                    if (!d.root) {
                        //CIRCLE
                        d3.select(this).selectAll("circle")
                            .transition()
                            .duration(250)
                            .style("cursor", "none")
                            .attr("r", circleWidth + 3)
                            .attr("fill", palette.orange);

                        //TEXT
                        d3.select(this).select("text")
                            .transition()
                            .style("cursor", "none")
                            .duration(250)
                            .style("cursor", "none")
                            .attr("font-size", "1.5em")
                            .attr("x", 15)
                            .attr("y", 5)
                    } else {
                        //CIRCLE
                        d3.select(this).selectAll("circle")
                            .style("cursor", "none");

                        //TEXT
                        d3.select(this).select("text")
                            .style("cursor", "none");
                    }
                })
                .on("mouseout", function (d, i) { //MOUSEOUT
                    if (!d.root) {
                        //CIRCLE
                        d3.select(this).selectAll("circle")
                            .transition()
                            .duration(250)
                            .attr("r", circleWidth)
                            .attr("fill", palette.blue);

                        //TEXT
                        d3.select(this).select("text")
                            .transition()
                            .duration(250)
                            .attr("font-size", "1em")
                            .attr("x", 8)
                            .attr("y", 4)
                    }
                })
                .call(force.drag);

            //CIRCLE
            node.append("svg:circle")
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", circleWidth)
                .attr("fill", function (d, i) {
                    if (!d.root) {
                        return palette.blue;
                    } else {
                        return palette.red
                    }
                });

            //TEXT
            node.append("text")
                .text(function (d, i) {
                    return d.name;
                })
                .attr("x", function (d, i) {
                    return circleWidth + 5;
                })
                .attr("y", function (d, i) {
                    if (!d.root) {
                        return circleWidth
                    } else {
                        return circleWidth + 5
                    }
                })
                .attr("font-family", "Bree Serif")
                .attr("fill", function (d, i) {
                    return palette.white;
                })
                .attr("font-size", function (d, i) {
                    return "1em";
                })
                .attr("text-anchor", function (d, i) {
                    if (!d.root) {
                        return "beginning";
                    } else {
                        return "end"
                    }
                });


            force.on("tick", function (e) {
                node.attr("transform", function (d, i) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

                link.attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    })
            });

            force.start();
        }
    }
})();

/**
 * AngularJS
 * Configuration Controller
 * This controller allows to add, remove nodes or links.
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
        if (source !== -1 && target !== -1) {
            $scope.links.push({
                source: $scope.nodes[source],
                target: $scope.nodes[target]
            });
            $scope.source = -1;
            $scope.target = -1;
            initializeDisableItem();
        } else
            alert('Please, select two nodes');
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