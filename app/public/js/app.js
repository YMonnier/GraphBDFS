/**
 * Created by Ysee on 07/05/16.
 */
var graph  = (function() {
    return {
        modules: {},
        nodes: [],
        links: []
    }
})();

graph.modules.config = (function() {
    return {
        init: function() {
            //                    modal.css("display", "none");//.style.display = "none";
            var modal = $('#modal-config');

            $('#add-node').click(function(e) {
                e.preventDefault();
                console.log('Click add node');
                if($('#input-node').val() != '') {
                    graph.modules.config.addNode($('#input-node'));
                }
            });

            $('#add-link').click(function(e) {
                console.log('Click add link');
            });
        },
        addNode: function(inputName) {
            graph.nodes.push({
                'name': inputName.val()
            })
            inputName.val('');
        }
    }
})();


$(document).ready(function () {
    graph.modules.config.init();
});