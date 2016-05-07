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
                var s = $('#source').find(":selected").text();
                var t = $('#target').find(":selected").text();
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
            console.log(t);
        },
        addLink: function() {

        }
    }
})();


$(document).ready(function () {
    graph.modules.config.init();
});