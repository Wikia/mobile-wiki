// Todo
// 

function makeResponsive($el) {
	// Move first row into <thead>
	$first = $el.find('tbody tr:first-child').detach();
	$el.find('tbody').before('<thead></thead>');
	$first.appendTo($el.find('thead'));

	// Add: class="tablesaw tablesaw-stack" data-mode="stack"
	$el.addClass("tablesaw tablesaw-stack");
	$el.data("mode", "stack");

	// Tablesaw refresh
	$el.table("refresh");

}

function unmakeResponse($el) {
	//todo
}

function addToggleUI($el) {

	var $toggler = $('<ul class="saw-toggle"> \
		<li class="opt-table selected">Table</li> \
		<li class="opt-card">Card</li> \
		</ul>');

	$toggler.data('table', $el);

	$el.before($toggler);

	$toggler.find('.opt-card').on('click', function() {
		makeResponsive($(this).parent().data("table"));
	});
	$toggler.find('.opt-table').on('click', function() {
		unmakeResponsive($(this).parent().data("table"));
	});

}

function initHack() {
	$('table.wikitable').each(function() { addToggleUI($(this)) });
}

$(document).ready(function () {
	initHack();
});