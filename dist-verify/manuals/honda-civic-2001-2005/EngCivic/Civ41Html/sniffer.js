function SupportsDHTML () {

	var 	agent;
	var		version;

	agent = navigator.userAgent.toLowerCase ();
	version = parseInt (navigator.appVersion);

	if (agent.indexOf ("msie") != -1 || agent.indexOf ("mozilla") != -1 || 
		agent.indexOf ("spoofer") != -1 || agent.indexOf ("compatible") != -1) {

		if (version >= 4)
			return 1;
		}

	return 0;
	};


function FullDHTML () {

	var 	agent;
	var	version;

	agent = navigator.userAgent.toLowerCase ();
	version = parseInt (navigator.appVersion);

	if (agent.indexOf ("msie") != -1) {

		if (version >= 4)
			return 1;
		}

	return 0;
	};


function PartialDHTML () {

	var 	agent;
	var		version;

	agent = navigator.userAgent.toLowerCase ();
	version = parseInt (navigator.appVersion);

	if (agent.indexOf ("mozilla") != -1 || agent.indexOf ("spoofer") != -1 || 
		agent.indexOf ("compatible") != -1) {

		if (version >= 4)
			return 1;
		}

	return 0;
	};


function GetBrowser () {

	var 	agent;
	var	version;

	agent = navigator.userAgent.toLowerCase ();
	version = parseInt (navigator.appVersion);

	if (agent.indexOf ("msie") != -1)
		return 1;

	return 0;
	};


function IsOldBrowser () {

	var 	agent;
	var		version;

	version = parseInt (navigator.appVersion);

	if (version < 4)
		return 1;

	return 0;
	};
	
	
