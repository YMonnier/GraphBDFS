/**
 * Created by Ysee on 07/05/16.
 * Graph and Network Theory Project - University of Lodz - Poland
 */


/**
 * Global variable, module pattern
 * @type {{app, modules, nodes, links}}
 */
var graph = (function () {
    return {
        app: angular.module('GraphBDFS', []),
        modules: {},
        nodes: [],
        links: []
    }
})();

/**
 *  Create the datas structure
 *  Add Neighbours for each nodes
 */
graph.modules.datastruct = (function () {
    return {
        init: function () {
            graph.nodes.forEach(function (node) {
                graph.links.forEach(function (link) {
                    if (link.source === node) {
                        if (!node.neighbours.includes(link.target))
                            node.neighbours.push(link.target)
                    } else if (link.target === node) {
                        if (!node.neighbours.includes(link.source))
                            node.neighbours.push(link.source)
                    }
                })
            });
            graph.modules.engin.repaint();
        }
    }
})();

/**
 * Module engin. initiliaze svg panel, repaint panel
 * Create nodes(handlers, text, circle, node) and links
 * @type {{init, repaint}}
 */
graph.modules.engin = (function () {
    var w, h, circleWidth, svgApp, force;
    var palette = {
        "white": "#FFFFFF",
        "gray": "#708284",
        "yellow": "#FFCB10",
        "red": "#D11C24",
        "blue": "#2176C7"
    };
    return {
        init: function () {
            console.log('graph.modules.engin.INIT......');
            h = $('#content').height();
            w = $('#content').width();

            circleWidth = 7;

            svgApp = d3.select("#content")
                .append("svg:svg")
                .attr("pointer-events", "all")
                .attr("width", w)
                .attr("height", h)
                .attr("viewBox", "0 0 " + w + " " + h)
                .attr("perserveAspectRatio", "xMinYMid");

            force = d3.layout.force();

            graph.nodes = force.nodes();
            graph.links = force.links();

            graph.modules.engin.repaint();
        },
        repaint: function () {
            console.log('update');

            //Get data
            var nodes = force.nodes();
            var links = force.links();

            console.log('BEFORE REPAINT');
            console.log(nodes);
            console.log(links);
            console.log(graph.nodes);
            console.log(graph.links);

            var link = svgApp.selectAll("line.link")
                .data(links);
            var linkEnter = link.enter().append("line")
                .style("position", "absolute")
                .style("z-index", "1")
                .attr("class", "link")
                .attr("stroke", palette.gray)
                .attr("fill", "none");
            link.exit().remove();


            var node = svgApp.selectAll("g.node")
                .data(nodes, function (d) {

                    return d.name;
                });

            //Update existed node
            node.select('circle').attr("fill", function (d, i) {
                console.log('EZFEZFEZGRTGERTERG');
                console.log(d);
                if (!d.root) {

                    return palette.blue;
                } else {
                    return palette.red
                }
            });
            /**
             * Adding node, catch event mouseover and mouseout
             */
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .on("mouseover", function (d, i) {
                    if (!d.root) {
                        d3.select(this).select("circle")
                            .transition()
                            .duration(250)
                            .style("cursor", "none")
                            .attr("r", circleWidth + 3)
                            .attr("fill", palette.yellow);

                        d3.select(this)//.select("text")
                            .transition()
                            .style("cursor", "none")
                            .duration(250)
                            .style("cursor", "none")
                            .attr("font-size", "1.5em")
                            .attr("x", 15)
                            .attr("y", 5)
                    } else {
                        d3.select(this).select("circle")
                            .style("cursor", "none");

                        d3.select(this).select("text")
                            .style("cursor", "none");

                    }
                })
                .on("mouseout", function (d, i) {
                    if (!d.root) {
                        //CIRCLE
                        d3.select(this).select("circle")
                            .transition()
                            .duration(250)
                            .attr("r", circleWidth)
                            .attr("fill", palette.blue);

                        //TEXT
                        d3.select(this)//.select("text")
                            .transition()
                            .duration(250)
                            .attr("font-size", "1em")
                            .attr("x", 8)
                            .attr("y", 4)
                    }
                })
                .call(force.drag);

            /**
             * Adding circle svg
             */
            nodeEnter.append("svg:circle")
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
                }).attr("id", function (d) {
                return "Node-" + d.name;
            });

            /**
             * Adding node's text
             */
            nodeEnter.append("svg:text")
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
            node.exit().remove();

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

            /**
             * Update force
             */
            force.gravity(0.1)
                .charge(-1000)
                .size([w, h])
                .start();

            console.log('AFTER REPAINT');
            console.log(nodes);
            console.log(links);
            console.log(graph.nodes);
            console.log(graph.links);
        }
    }
})();

/**
 * AngularJS
 * Configuration Controller
 * This controller allows to add, remove nodes or links.
 */
graph.app.controller('ConfigController', function ($scope) {
    console.log('ConfigController INIT......');
    graph.modules.engin.init();
    var previousRootNode = {};
    $scope.nodes = graph.nodes;
    $scope.links = graph.links;


    $scope.nextStep = function () {
        console.log('Next Step...');
        /*
         if (graph.nodes.length === 0 || graph.links.length === 0) {
         console.log('HERE??');
         alert('Please, add nodes or edges.');
         } else {
         console.log('INI DATASTRUCT');
         graph.modules.datastruct.init();
         }*/
        graph.modules.engin.repaint();
    };

    /**
     * Add a new node
     * @param nodeName, node's name
     */
    $scope.addNode = function (nodeName) {
        //filter same node
        if (!nodeName) {
            alert('Please, node\' must not be blank');
            return;
        }
        var nf = graph.nodes.filter(function (node) {
            return node.name === nodeName
        });
        if (nf.length !== 0) {
            alert('Node already exists.\nPlease choose another node\'s name');
            return;
        }

        console.log('ADD');
        graph.nodes.push({
            name: nodeName,
            visited: false,
            root: graph.nodes.length === 0,
            neighbours: [],
            disabled: {source: false, target: false}
        });
        $scope.source = -1;
        $scope.target = -1;
        if (graph.nodes.length > 0)
            previousRootNode = graph.nodes[0];
        graph.modules.engin.repaint();
        $scope.nodeName = '';
    };

    /**
     * Remove a node
     * @param index, node's index to remove
     */
    $scope.removeNode = function (index) {
        updateLinks(graph.nodes[index]);
        graph.nodes.splice(index, 1);
        if (graph.nodes.length > 0 && index === 0)
            graph.nodes[0].root = true;
        graph.modules.engin.repaint();
    };


    /**
     * Add a new link
     * @param source, source node's index
     * @param target, targer node's index
     */
    $scope.addLink = function (source, target) {
        if (source !== -1 && target !== -1) {
            graph.links.push({
                source: graph.nodes[source],
                target: graph.nodes[target]
            });
            graph.modules.engin.repaint();
            $scope.source = -1;
            $scope.target = -1;
            initializeDisableItem();
        } else
            alert('Please, select two nodes');
    };


    $scope.removeLink = function (index) {
        graph.links.splice(index, 1);
        graph.modules.engin.repaint();
    };

    /**
     * Update links, remove links which depended on the node
     * @param node, node dependence
     */
    function updateLinks(node) {
        graph.links.forEach(function (l, index) {
            console.log('index...... ' + index);
            if ((l.source.name === node.name) || (l.target.name === node.name)) {
                graph.links.splice(index, 1)
            }
        });
    }


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
        graph.modules.engin.repaint();
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
            previousDisableLink = graph.nodes[index];
        }

        /**
         * Filter source checkbox depending on node target selected
         * @param index, index node target selected
         */
        function filterSource(index) {
            graph.nodes[index].disabled.source = true;
            graph.links.forEach(function (l) {
                if (l.source === graph.nodes[index] || l.target === graph.nodes[index]) {
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
            graph.nodes[index].disabled.target = true;
            graph.links.forEach(function (l) {
                if (l.source === graph.nodes[index] || l.target === graph.nodes[index]) {
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
     * Enable each choices for textBox
     */
    function initializeDisableItem() {
        graph.nodes.forEach(function (n) {
            n.disabled.source = false;
            n.disabled.target = false;
        })
    }
});