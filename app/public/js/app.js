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
graph.modules.algos = (function () {
    var execStep, queue, stack;
    return {
        init: function () {
            execStep = [];
            queue = [];
            stack = [];
            graph.nodes.map(function (n) {
                n.visited = false;
                n.neighbours = [];
            });
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
        },
        bfs: function () {
            graph.modules.algos.init();
            var indexRoot = graph.modules.algos.findRootNode(),
                rootNode = graph.nodes[indexRoot];
            rootNode.visited = true;

            queue.push(rootNode);
            execStep.push([indexRoot]);

            while (queue.length != 0) {
                var n = queue.shift();
                var tmp = [];
                n.neighbours.forEach(function (neighbour) {
                    if (!neighbour.visited) {
                        neighbour.visited = true;
                        var i = graph.modules.algos.findIndexNode(neighbour);
                        tmp.push(i);
                        queue.push(neighbour);
                    }
                });
                if (tmp.length !== 0)
                    execStep.push(tmp);
            }
            graph.nodes.map(function (n) {
                n.visited = false
            });
            console.log(execStep);
            console.log(execStep.length);
            graph.modules.algos.next(0);
        },
        dfs: function () {
            graph.modules.algos.init();
            var indexRoot = graph.modules.algos.findRootNode(),
                rootNode = graph.nodes[indexRoot];

            stack.push(rootNode);

            while (stack.length != 0) {
                var n = stack.pop();
                if (!n.visited) {
                    n.visited = true;
                    var i = graph.modules.algos.findIndexNode(n);
                    execStep.push([i]);
                    n.neighbours.forEach(function (neighbour) {
                        stack.push(neighbour);
                    });
                }
            }
            graph.nodes.map(function (n) {
                n.visited = false
            });
            console.log(execStep);
            console.log(execStep.length);
            graph.modules.algos.next(0);
        },
        findRootNode: function () {
            console.log('FINDROOTNODE...');
            return graph.nodes.findIndex(function (node) {
                return node.root;
            });
        },
        findIndexNode: function (node) {
            return graph.nodes.indexOf(node);
        },
        next: function (step) {
            console.log('NExt Function ... INDEX :: ' + step);
            if (step < execStep.length) {
                setTimeout(function () {
                    execStep[step].forEach(function (i) {
                        graph.nodes[i].visited = true;
                    });
                    graph.modules.engin.repaint();
                    step += 1;
                    graph.modules.algos.next(step);
                }, 2000);
            }
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
        "blue": "#2176C7",
        "blueh": "#1b4c8c"
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
            console.log('Repaint::');

            //Get data
            var nodes = force.nodes();
            var links = force.links();

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
                if (d.visited)
                    return palette.yellow;
                if (!d.root)
                    return palette.blue;
                else
                    return palette.red;
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
                            .attr("fill", !d.visited ? palette.blueh : palette.yellow);

                        d3.select(this)
                            .transition()
                            .style("cursor", "none")
                            .duration(250)
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
                        d3.select(this).select("circle")
                            .transition()
                            .duration(250)
                            .attr("r", circleWidth)
                            .attr("fill", !d.visited ? palette.blue : palette.yellow);

                        d3.select(this)
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
                    if (!d.root)
                        return palette.blue;
                    else
                        return palette.red;
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
                    if (!d.root)
                        return circleWidth;
                    else
                        return circleWidth + 5
                })
                .attr("font-family", "Avenir")
                .attr("fill", function (d, i) {
                    return palette.white;
                })
                .attr("font-size", function (d, i) {
                    return "1em";
                })
                .attr("text-anchor", function (d, i) {
                    if (!d.root)
                        return "beginning";
                    else
                        return "end";
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
        }
    }
})();

/**
 * AngularJS
 * Configuration Controller
 * This controller allows to add, remove nodes or links and execute an algorithm.
 */
graph.app.controller('ConfigController', function ($scope) {
    console.log('ConfigController INIT......');
    graph.modules.engin.init();
    var previousRootNode = {};
    $scope.nodes = graph.nodes;
    $scope.links = graph.links;


    /**
     * Execute the Breadth First Algorithm on the current graph
     */
    $scope.BFS = function () {
        console.log('BFS...');
        if (graph.nodes.length === 0 || graph.links.length === 0) {
            alert('Please, add nodes or edges.');
        } else {
            graph.modules.algos.bfs();
        }
    };

    /**
     * Execute the Depth First Algorithm on the current graph
     */
    $scope.DFS = function () {
        console.log('DFS...');
        if (graph.nodes.length === 0 || graph.links.length === 0) {
            alert('Please, add nodes or edges.');
        } else {
            graph.modules.algos.dfs({});
        }
    };

    /**
     * Disable all
     */
    $scope.refreshGraph = function () {
        graph.modules.algos.init();
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

        //Add node
        graph.nodes.push({
            name: nodeName,
            visited: false,
            root: graph.nodes.length === 0,
            neighbours: [],
            disabled: {source: false, target: false}
        });

        //Put index -1 to checkBox
        $scope.source = -1;
        $scope.target = -1;

        //Update root node
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

    /**
     * Remove link
     * @param index, link's index to remove
     */
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
     * Update all checkBox, put false to previous selected node
     * and true to selected node
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
     * Construct a random graph and display
     * it on the canvas div
     */
    $scope.randomGraph = function () {
        var i;
        graph.nodes.splice(0,graph.nodes.length);
        graph.links.splice(0,graph.links.length);

        var name = [], g = 'A'.charCodeAt(0), j = 'Z'.charCodeAt(0);
        for (; g <= j; ++g) {
            name.push(String.fromCharCode(g));
        }
        var n = getRandomInt(6, 10);
        var minLinks = n - 1;
        var maxLinks = (n * (n - 1)/2) - 2;
        var l = getRandomInt(minLinks, maxLinks);

        console.log('Node\'s number :: ' + n);
        console.log('Link\'s number :: ' + l);
        $scope.addNode(name[0]);

        for(i=1;i<n;i++){
            console.log('add :: ' + name[i]);
            $scope.addNode(name[i]);

            $scope.addLink(graph.nodes.length-1, getRandomInt(0, graph.nodes.length - 2))
        }

        console.log('NODES :: ' + graph.nodes.length);

        for(i=0;i<n;i++){
            //$scope.
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

    /**
     * Random int
     * @param min, min of random range
     * @param max, maximum of random range
     * @returns random interger
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});

/**
 * This method has been added to the ECMAScript 6 specification and
 * may not be available in all JavaScript implementations yet
 */

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}