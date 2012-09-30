/*jslint browser: true*/
/*global $, self*/

var getUrlFor = function (file) {
	"use strict";
	var dataUri = "resource://jid1-QpHD8URtZWJC2A-at-jetpack/proxmate/data/";
	return dataUri + file;
};

var randomString = function (length) {
	"use strict";
	var alphabet = "", chars = [], str = "", i = 0;
	alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
	chars = alphabet.split("");

	if (!length) {
		length = Math.floor(Math.random() * chars.length);
	}

	str = '';
	for (i = 0; i < length; i += 1) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}
	return str;
};

var addListener = function (event, defer) {
	"use strict";
	self.port.on(event, function (data) {
		defer.response = data;
		defer.resolve();
	});
};

var sendAction = function (actionString, param) {
	"use strict";
	if (param === undefined) {
		param = null;
	}

	var defer = $.Deferred(), hash = randomString();

	self.port.emit(actionString,
		{
			param: param,
			hash: hash
		});

	addListener(hash, defer);

	return defer;
};

var loadResource = function (url) {
	"use strict";
	return sendAction("loadResource", url);
};

var proxifyUri = function (uri, reload) {
	"use strict";
	if (reload === undefined) {
		reload = false;
	} else {
		reload = true;
	}
	var promise = sendAction("setproxy", encodeURI(window.location.href));
	promise.done(function () {
		if (reload) {
			document.location = uri;
			document.location.reload();
		} else {
			document.location = uri;
		}
	});
};

var resetProxy = function () {
	"use strict";
	var promise = sendAction("resetproxy");
};

var getUrlParam = function (name) {
	"use strict";
	return decodeURI(
		(new RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [,null])[1]
	);
};

var checkStatus = function (module) {
	"use strict";
	return sendAction("checkStatus", module);
};

var bool = function (str) {
	"use strict";
	if (str.toLowerCase() === 'false') {
		return false;
	} else if (str.toLowerCase() === 'true') {
		return true;
	} else {
		return undefined;
	}
};

var loadOverlay = function (callback) {
	"use strict";
	// Load the overlay
	$('<link>').attr('rel', 'stylesheet')
	    .attr('type', 'text/css')
	    .attr('href', getUrlFor("elements/overlay.css"))
	    .appendTo('head');

	var resource = loadResource(getUrlFor("elements/overlay.html"));
	resource.done(function () {
		var data = resource.response.response;
		$("body").prepend(data);
		$("#pmOverlay").fadeIn("slow");
		$("#pmOverlay").click(function () {
			callback();
		});
	});
};

var loadBanner = function (callback) {
	"use strict";
	(function () {
	    var s = document.createElement('script'), t = document.getElementsByTagName('script')[0];
	    s.type = 'text/javascript';
	    s.async = true;
	    s.src = 'http://api.flattr.com/js/0.6/load.js?mode=auto';
	    t.parentNode.insertBefore(s, t);
	}());

	// Load the overlay
	$('<link>').attr('rel', 'stylesheet')
	    .attr('type', 'text/css')
	    .attr('href', getUrlFor("elements/overlay.css"))
	    .appendTo('head');

	var resource = loadResource(getUrlFor("elements/banner.html"));
	resource.done(function () {
		var data = resource.response.response;
		$("body").append(data);
		$("#pmBanner").fadeIn("slow");
		$("#pmBannerClose").click(function () {
			$("#pmBanner").fadeOut("slow", function () {
				$("#pmPusher").slideUp("slow");
			});
		});

		setTimeout(function () {
			$("#pmBanner").addClass("smallBanner");
		}, 5000);
	});
};