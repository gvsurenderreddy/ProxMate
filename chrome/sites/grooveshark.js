$(window).unload(resetProxy);

$(document).ready(function() {
	// Check for the broken heart
	var broken = $("#heartbroken");
	if (broken.length > 0) {

		// Change text
		$("#content h2").html("ProxMate will unblock Grooveshark now!");

		proxifyUri(window.location, true);
	} else {
		loadBanner();
	}
});	
