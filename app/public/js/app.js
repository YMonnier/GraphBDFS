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
    var index = 0;
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
                var s = $('#source').find(":selected");
                var t = $('#target').find(":selected");
                console.log(s.text());
                console.log(t.text());
                if (s.val() != t.val()) {
                    graph.modules.config.addLink(s, t);
                } else {

                }
            });
        },
        addNode: function(inputName) {
            var name = inputName.val()
            var t = $('#nodes span').text() + (graph.nodes.length != 0 ? ', ' : '') + name;
            $('#nodes span').text(t);

            $("select[name='target-picker']").append($('<option></option>').val(index).html(name));
            $("select[name='source-picker']").append($('<option></option>').val(index).html(name));

            graph.nodes.push({
                'name': inputName.val()
            });
            inputName.val('');
            index++;
            console.log(graph.nodes);
        },
        addLink: function(s, t) {
            $('#source').append("<tr><td>" + s.text() + "</td><td>-></td><td>" + t.text() + "</td></tr>");
            $('#links').append("<tr><td>" + s.text() + "</td><td>-></td><td>" + t.text() + "</td></tr>");
            console.log('s: ' + s.val() + ' t: ' + t.val());
            console.log(graph.nodes[s.val()]);
            console.log(graph.nodes[t.val()]);
            graph.links.push({
                source: graph.nodes[s.val()], target: graph.nodes[t.val()]
            });
            console.log(graph.links);
        }
    }
})();


$(document).ready(function () {
    graph.modules.config.init();
});