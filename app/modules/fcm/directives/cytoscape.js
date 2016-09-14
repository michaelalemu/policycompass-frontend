angular.module('pcApp.fcm.directives.cytoscapes', [])

    .directive('cytoscape', function ($rootScope) {
        // graph visualisation by - https://github.com/cytoscape/cytoscape.js
        return {
            restrict: 'E',
            template: '<div id="cy"></div>',
            replace: true,
            scope: {
                // data objects to be passed as an attributes - for nodes and edges
                cyData: '=',
                cyEdges: '=', // controller function to be triggered when clicking on a node
                cyClick: '&',
                cyMouseup: '&',
                cyMouseover: '&', //adding mouseover functionality
                cyMouseout: '&'//adding mouseour functionality
            },
            link: function (scope, element, attrs, fn) {
                // dictionary of colors by types. Just to show some design options
                scope.typeColors = {
                    'ellipse': '#992222',
                    'triangle': '#222299',
                    'rectangle': '#661199',
                    'roundrectangle': '#772244',
                    'pentagon': '#990088',
                    'hexagon': '#229988',
                    'heptagon': '#118844',
                    'octagon': '#335577',
                    'star': '#113355'
                };

                // graph  build
                scope.doCy = function () { // will be triggered on an event broadcast
                    // initialize data object
                    scope.elements = {};
                    scope.elements.nodes = [];
                    scope.elements.edges = [];

                    // parse data and create the Nodes array
                    // object type - is the object's group
                    for (i = 0; i < scope.cyData.length; i++) {
                        // get id, name and type  from the object
                        var dId = "n" + scope.cyData[i].id;
                        var dName = scope.cyData[i].name.substring(0, 24);
                        var dType = 'roundrectangle';
                        var posX = scope.cyData[i].posX;
                        var posY = scope.cyData[i].posY;
                        // get color from the object-color dictionary
                        var typeColor = scope.typeColors[4];
                        // build the object, add or change properties as you need - just have a name and id
                        var elementObj = {
                            data: {
                                id: dId,
                                name: dName,
                                typeColor: typeColor,
                                typeShape: dType,
                                type: dType
                            },
                            position: {
                                x: posX,
                                y: posY
                            }
                        };
                        // add new object to the Nodes array
                        scope.elements.nodes.push(elementObj);
                    }

                    // parse edges
                    // you can build a complete object in the controller and pass it without rebuilding it in the directive.
                    // doing it like that allows you to add options, design or what needed to the objects
                    // doing it like that is also good if your data object/s has a different structure
                    for (i = 0; i < scope.cyEdges.length; i++) {
                        // get edge source
                        var eSource = "n" + scope.cyEdges[i].source;
                        // get edge target
                        var eTarget = "n" + scope.cyEdges[i].target;
                        // get edge id
                        var eId = "e" + scope.cyEdges[i].id;
                        // get edge weight
                        var eLabel = scope.cyEdges[i].weighted;
                        // Change arrows colors against the weight value.
                        var edgecolor = 'grey';
                        if (eLabel > 0)
                            edgecolor = 'green';
                        else if (eLabel < 0)
                            edgecolor = 'red';

                        // build the edge object
                        var edgeObj = {
                            data: {
                                id: eId,
                                source: eSource,
                                target: eTarget,
                                label: eLabel,
                                edgecolor: edgecolor

                            }
                        };
                        // adding the edge object to the edges array
                        scope.elements.edges.push(edgeObj);
                    }

                    // graph  initialization
                    // use object's properties as properties using: data(propertyName)
                    // check Cytoscapes site for much more data, options, designs etc
                    // http://cytoscape.github.io/cytoscape.js/
                    // here are just some basic options
                    $('#cy').cytoscape({
                        showOverlay: false,
                        zoom: 1,
                        layout: {
                            name: 'preset',
                            positions: undefined,
                            zoom: undefined,
                            pan: undefined,
                            fit: false,
                            padding: 30,
                            animate: false,
                            animationDuration: 500,
                            ready: undefined,
                            stop: undefined,
                        },
                        style: cytoscape.stylesheet().selector('node').css({
                            'shape': 'roundrectangle',
                            'width': '300', //https://github.com/policycompass/policycompass/issues/646
                            'height': '40',
                            'background-color': 'data(typeColor)',
                            'content': 'data(name)',
                            'text-valign': 'center',
                            'color': 'white',
                            'text-outline-color': 'data(typeColor)'
                        }).selector('edge').css({
                            'target-arrow-shape': 'triangle',
                            'content': 'data(label)',
                            'text-outline-color': '#FFFFFF',
                            'text-outline-opacity': '1',
                            'text-outline-width': 2,
                            'text-valign': 'center',
                            'color': '#777777',
                            'width': '2px',
                            'line-color': 'data(edgecolor)',
                            'target-arrow-color': 'data(edgecolor)'
                        }).selector(':selected').css({
                            'background-color': '#C50C44',
                            'line-color': 'black',
                            'target-arrow-color': 'black',
                            'source-arrow-color': 'black'
                        }).selector('.faded').css({
                            'opacity': 0.65,
                            'text-opacity': 0.65
                        }),
                        ready: function () {
                            window.cy = this;

                            // giddy up...
                            cy.elements().unselectify();
                            // ##MOBA## this is to calculate the doubleClick trigger over a node in the Edit mode.
                            var tappedBefore;
                            var tappedTimeout;
                            cy.on('tap', function (event) {

                                var tappedNow = event.cyTarget;
                                if (tappedTimeout && tappedBefore) {
                                    clearTimeout(tappedTimeout);
                                }
                                if (tappedBefore === tappedNow) {
                                    tappedNow.trigger('doubleTap');
                                    tappedBefore = null;
                                } else {
                                    tappedTimeout = setTimeout(function () { tappedBefore = null; }, 300);
                                    tappedBefore = tappedNow;
                                }
                            });

                            // Event listeners
                            // with sample calling to the controller function as passed as an attribute
                            cy.on('unselect', 'node', function (e) {
                                var nodes = cy.elements('node');
                                nodes.css('background-color', 'gray');
                            });

                            cy.on('doubleTap', 'node', function (e) {
                                var nodes = cy.elements('node');
                                nodes.css('background-color', 'gray');
                                var evtTarget = e.cyTarget;
                                var nodeId = evtTarget.id();
                                var edgesFrom = cy.elements('edge[source="' + nodeId + '"]');
                                var edgesTo = cy.elements('edge[target="' + nodeId + '"]');
                                evtTarget.css('background-color', '#C50C44');
                                for (i = 0; i < edgesFrom.length; i++) {
                                    var nodeChild = edgesFrom[i].target();
                                    nodeChild.css('background-color', 'blue');
                                }
                                for (i = 0; i < edgesTo.length; i++) {
                                    var nodeParent = edgesTo[i].source();
                                    nodeParent.css('background-color', 'green');
                                }
                                scope.cyClick({ value: nodeId });
                            });

                            cy.on('mouseup', 'node', function (e) {
                                var evtTarget = e.cyTarget;
                                var nodeId = evtTarget.id();
                                var posX = evtTarget.position("x");
                                var posY = evtTarget.position("y");
                                scope.cyMouseup({
                                    value: nodeId,
                                    x: posX,
                                    y: posY
                                });
                            });

                            //Binding mouseover event
                            cy.on('mouseover', 'node', function (e) {
                                var evtTarget = e.cyTarget;
                                var nodeId = evtTarget.id();
                                var posX = evtTarget.renderedPosition("x") + $('#cy').position().left;
                                var posY = evtTarget.renderedPosition("y") + $('#cy').position().top;
                                scope.cyMouseover({
                                    value: nodeId,
                                    x: posX,
                                    y: posY
                                });
                                console.log(evtTarget.position("y") + '-' + $('#cy').position().top + '-' + posY);
                            });

                            //Binding mouseout event
                            cy.on('mouseout', 'node', function (e) {
                                var evtTarget = e.cyTarget;
                                var nodeId = evtTarget.id();
                                var posX = evtTarget.position("x");
                                var posY = evtTarget.position("y");
                                scope.cyMouseout({
                                    value: nodeId,
                                    x: posX,
                                    y: posY
                                });
                            });

                            cy.on('doubleTap', 'edge', function (e) {
                                var evtTarget = e.cyTarget;
                                var nodeId = evtTarget.id();
                                scope.cyClick({ value: nodeId });
                            });
                            cy.panzoom({
                                // options go here
                            });
                            // load the objects array
                            // use cy.add() / cy.remove() with passed data to add or remove nodes and edges without rebuilding the graph
                            // sample use can be adding a passed variable which will be broadcast on change
                            cy.load(scope.elements);


                            if (scope.elements.nodes.length > 5) {
                                cy.fit(window.defaults.fitPadding);
                            }
                        }
                    });

                }; // end doCy()

                // When the app object changed = redraw the graph
                // you can use it to pass data to be added or removed from the object without redrawing it
                // using cy.remove() / cy.add()
                $rootScope.$on('appChanged', function (e) {
                    scope.doCy();
                });
            }
        };
    })
    .directive('pcFcm', function ($rootScope) {
        var controller = function ($scope, $attrs, $controller, $routeParams) {
            $routeParams.fcmId = $scope.fcmId;
            $controller('CytoscapeCtrl', { $scope: $scope });
        };
        return {
            restrict: 'E',
            template: '<div id="cy"></div>',
            replace: true,
            scope: {
                // data objects to be passed as an attributes - for nodes and edges
                fcmId: '='
            },
            controller: ['$scope', '$attrs', '$controller', '$routeParams', controller],
            link: function (scope, element, attrs, fn) {
                // dictionary of colors by types. Just to show some design options
                scope.typeColors = {
                    'ellipse': '#992222',
                    'triangle': '#222299',
                    'rectangle': '#661199',
                    'roundrectangle': '#772244',
                    'pentagon': '#990088',
                    'hexagon': '#229988',
                    'heptagon': '#118844',
                    'octagon': '#335577',
                    'star': '#113355'
                };

                // graph  build
                scope.doCy = function () { // will be triggered on an event broadcast
                    if (scope.mapData != null && scope.edgeData != null) {
                        // initialize data object
                        scope.elements = {};
                        scope.elements.nodes = [];
                        scope.elements.edges = [];

                        // parse data and create the Nodes array
                        // object type - is the object's group
                        for (i = 0; i < scope.mapData.length; i++) {
                            // get id, name and type  from the object
                            var dId = "n" + scope.mapData[i].id;
                            var dName = scope.mapData[i].name.substring(0, 24);
                            var dType = 'roundrectangle';
                            var posX = scope.mapData[i].posX;
                            var posY = scope.mapData[i].posY;
                            // get color from the object-color dictionary
                            var typeColor = scope.typeColors[4];
                            // build the object, add or change properties as you need - just have a name and id
                            var elementObj = {
                                data: {
                                    id: dId,
                                    name: dName,
                                    typeColor: typeColor,
                                    typeShape: dType,
                                    type: dType
                                },
                                position: {
                                    x: posX,
                                    y: posY
                                }
                            };
                            // add new object to the Nodes array
                            scope.elements.nodes.push(elementObj);
                        }

                        // parse edges
                        // you can build a complete object in the controller and pass it without rebuilding it in the directive.
                        // doing it like that allows you to add options, design or what needed to the objects
                        // doing it like that is also good if your data object/s has a different structure
                        for (i = 0; i < scope.edgeData.length; i++) {
                            // get edge source
                            var eSource = "n" + scope.edgeData[i].source;
                            // get edge target
                            var eTarget = "n" + scope.edgeData[i].target;
                            // get edge id
                            var eId = "e" + scope.edgeData[i].id;
                            // get edge weight
                            var eLabel = scope.edgeData[i].weighted;
                            // Change arrows colors against the weight value.
                            var edgecolor = 'grey';
                            if (eLabel > 0)
                                edgecolor = 'green';
                            else if (eLabel < 0)
                                edgecolor = 'red';

                            // build the edge object
                            var edgeObj = {
                                data: {
                                    id: eId,
                                    source: eSource,
                                    target: eTarget,
                                    label: eLabel,
                                    edgecolor: edgecolor

                                }
                            };
                            // adding the edge object to the edges array
                            scope.elements.edges.push(edgeObj);
                        }

                        // graph  initialization
                        // use object's properties as properties using: data(propertyName)
                        // check Cytoscapes site for much more data, options, designs etc
                        // http://cytoscape.github.io/cytoscape.js/
                        // here are just some basic options
                        $('#cy').cytoscape({
                            showOverlay: false,
                            zoom: 1,
                            layout: {
                                name: 'preset',
                                positions: undefined,
                                zoom: undefined,
                                pan: undefined,
                                fit: false,
                                padding: 30,
                                animate: false,
                                animationDuration: 500,
                                ready: undefined,
                                stop: undefined,
                            },
                            style: cytoscape.stylesheet().selector('node').css({
                                'shape': 'roundrectangle',
                                'width': '300', //https://github.com/policycompass/policycompass/issues/646
                                'height': '40',
                                'background-color': 'data(typeColor)',
                                'content': 'data(name)',
                                'text-valign': 'center',
                                'color': 'white',
                                'text-outline-color': 'data(typeColor)'
                            }).selector('edge').css({
                                'target-arrow-shape': 'triangle',
                                'content': 'data(label)',
                                'text-outline-color': '#FFFFFF',
                                'text-outline-opacity': '1',
                                'text-outline-width': 2,
                                'text-valign': 'center',
                                'color': '#777777',
                                'width': '2px',
                                'line-color': 'data(edgecolor)',
                                'target-arrow-color': 'data(edgecolor)'
                            }).selector(':selected').css({
                                'background-color': '#C50C44',
                                'line-color': 'black',
                                'target-arrow-color': 'black',
                                'source-arrow-color': 'black'
                            }).selector('.faded').css({
                                'opacity': 0.65,
                                'text-opacity': 0.65
                            }),
                            ready: function () {
                                window.cy = this;

                                // giddy up...
                                cy.elements().unselectify();
                                // ##MOBA## this is to calculate the doubleClick trigger over a node in the Edit mode.
                                var tappedBefore;
                                var tappedTimeout;
                                cy.on('tap', function (event) {

                                    var tappedNow = event.cyTarget;
                                    if (tappedTimeout && tappedBefore) {
                                        clearTimeout(tappedTimeout);
                                    }
                                    if (tappedBefore === tappedNow) {
                                        tappedNow.trigger('doubleTap');
                                        tappedBefore = null;
                                    } else {
                                        tappedTimeout = setTimeout(function () { tappedBefore = null; }, 300);
                                        tappedBefore = tappedNow;
                                    }
                                });

                                // Event listeners
                                // with sample calling to the controller function as passed as an attribute
                                cy.on('unselect', 'node', function (e) {
                                    var nodes = cy.elements('node');
                                    nodes.css('background-color', 'gray');
                                });

                                cy.on('mouseup', 'node', function (e) {
                                    var evtTarget = e.cyTarget;
                                    var nodeId = evtTarget.id();
                                    var posX = evtTarget.position("x");
                                    var posY = evtTarget.position("y");
                                    scope.doMouseUp(nodeId, posX, posY);
                                });

                                //Binding mouseover event
                                cy.on('mouseover', 'node', function (e) {
                                    var evtTarget = e.cyTarget;
                                    var nodeId = evtTarget.id();
                                    var posX = evtTarget.renderedPosition("x") + $('#cy').position().left;
                                    var posY = evtTarget.renderedPosition("y") + $('#cy').position().top;
                                    scope.doMouseOver(nodeId, posX, posY);
                                    //console.log(evtTarget.position("y") + '-' + $('#cy').position().top + '-' + posY);
                                });

                                //Binding mouseout event
                                cy.on('mouseout', 'node', function (e) {
                                    var evtTarget = e.cyTarget;
                                    var nodeId = evtTarget.id();
                                    var posX = evtTarget.position("x");
                                    var posY = evtTarget.position("y");
                                    scope.doMouseOut(nodeId, posX, posY);
                                });

                                cy.panzoom({
                                    // options go here
                                });
                                // load the objects array
                                // use cy.add() / cy.remove() with passed data to add or remove nodes and edges without rebuilding the graph
                                // sample use can be adding a passed variable which will be broadcast on change
                                cy.load(scope.elements);


                                if (scope.elements.nodes.length > 5) {
                                    cy.fit(window.defaults.fitPadding);
                                }
                            }
                        });
                    }
                }; // end doCy()

                // When the app object changed = redraw the graph
                // you can use it to pass data to be added or removed from the object without redrawing it
                // using cy.remove() / cy.add()
                $rootScope.$on('appChanged', function (e) {
                    scope.doCy();
                });
            }
        };
    });
