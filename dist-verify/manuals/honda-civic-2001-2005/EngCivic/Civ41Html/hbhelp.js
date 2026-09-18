
// global variables
var		wndCount = 0;
var		curXPos = 0;
var 	curYPos = 0;
var		wnd = null;
var		ht_loc = "";
var		curr_frames = new Array (5);

// functions


function OpenWindow (file, width, height, x_pos, y_pos, wndname) {

	var		name, cc, temp = "";

	if (width == 0)
		width = 250;
	
	if (height == 0)
		height = 100;

	// adjust x and y to fit on screen
	if (SupportsDHTML ()) {
		if (x_pos < screen.width) {
			if (x_pos + width > (screen.width - 15))
				x_pos -= (x_pos + width) - (screen.width - 15)
			}
		else {	// assume 2nd monitor
			if (x_pos + width > ((screen.width * 2) - 15))
				x_pos -= (x_pos + width) - ((screen.width * 2) - 15)
			}

		if (y_pos + height > (screen.height - 60))
			y_pos -= (y_pos + height) - (screen.height - 60)
		}

	if (wndname == "") {
		name = file.substring (0, file.indexOf ("."));
		name += wndCount;
		wndCount++;
		}
	else
		name = wndname;
	
	// take all invalid chars out of name
	for (i = 0; i < name.length; i++) {
		cc = name.substring (i, i+1);
		if ((cc >= 'a' && cc <= 'z') || (cc >= 'A' && cc <= 'Z') && (cc >= '0' && cc <= '9'))
			temp += cc;
		else {
			val = parseInt (cc);
			if (val >= 0 || val <= 9)
				temp += cc;
			else
				temp += "_";
			}
		}

	name = temp;

	if (FullDHTML () == 1)
		wnd = open (file, name, 'width=' + width + ',height=' + height + ',left=' + x_pos + ',top=' + y_pos + ',resizable=1,scrollbars=1')		
	else if (PartialDHTML () == 1)
		wnd = open (file, name, 'width=' + width + ',height=' + height + ',screenX=' + x_pos + ',screenY=' + y_pos + ',resizable=1,scrollbars=1')		
	else
		wnd = open (file, name, 'width=' + width + ',height=' + height + ',resizable=1,scrollbars=1')

	if (wndname != "") {
		if (GetBrowser () == 0)	// netscape
			wnd.focus ();
		else {
			if (FullDHTML ()) {
				test = wnd.location;	// this seems to make the window available
				wnd.focus ();
//				setTimeout ("wnd.focus ()", 1000);
				}
			}
		}
	}


function SaveMousePos (evnt) {

	if (FullDHTML ()) {
		curXPos = window.event.screenX;
		curYPos = window.event.screenY;
		}
	else if (PartialDHTML ()) {
		curXPos = evnt.screenX;
		curYPos = evnt.screenY;
		}
	else
		curXPos = curYPos = 0;
	}


function ShowPopup (file, width, height) {
	OpenWindow (file, width, height, curXPos, curYPos, "");
	}


function ShowSecWindow (file, wndname) {

	var 	width, height;
	var		x_pos, y_pos;
	var		data, caption;
	var		i, str;

	// parse window data to caption, x, y, width, height
	data = windows[wndname];

	// first parse off caption
	i = data.indexOf (',');
	caption = data.substring (0, i);
	data = data.substring (i + 1);

	// parse off x pos
	i = data.indexOf (',');
	str = data.substring (0, i);
	x_pos = parseInt (str);
	data = data.substring (i + 1);

	// parse off y pos
	i = data.indexOf (',');
	str = data.substring (0, i);
	y_pos = parseInt (str);
	data = data.substring (i + 1);

	// parse off width
	i = data.indexOf (',');
	str = data.substring (0, i);
	width = parseInt (str);
	data = data.substring (i + 1);

	// height is left
	height = parseInt (data);

	OpenWindow (file, width, height, x_pos, y_pos, wndname);
	}


function ShowHideObject (val) {

	var		e;

	if (FullDHTML ()) {
		e = eval (val);
		if (e.style.visibility == "hidden")
			e.style.visibility = "visible";
		else
			e.style.visibility = "hidden";
		}
	else if (PartialDHTML ()) {
		e = eval ("document." + val);
		if (e.visibility == "hide")
			e.visibility = "show";
		else
			e.visibility = "hide";
		}
	}



function SetPopupDuration (val) {

	if (val == 0)
		val = 120000;
	else
		val = val * 1000;
	
	if (SupportsDHTML () == 0 && GetBrowser () == 1)	// ie3.0
		setTimeout ("self.close ()", val);		// 2 minutes by default
	}


function SaveSubFrames () {

	for (i = 0; i < 5; i++) {
		if (parent.frames['subframe'].frames.length > i) {
			if (parent.frames['subframe'].frames[i].document) {
				curr_frames[i] = parent.frames['subframe'].frames[i].name;
				}
			else
				curr_frames[i] = "";
			}
		else
			curr_frames[i] = "";
		}
	}


function FindFrame (name) {

	for (i = 0; i < curr_frames.length; i++)  {
		if (curr_frames[i] == name)
			return i;
		}

	return -1;
	}


function ShowNavPane () {

	SaveSubFrames ();

	if (IsHidden ()) {
		if (IsOldBrowser ())
			return 0;

		ToggleNavPane ();
		return 1;
		}

	return 1;
	}


function IsHidden () {

	if (FindFrame ("hlptopics") == -1)
		return 1;
	return 0;
	}


function Back () {
	
	var			num;

	SaveSubFrames ();

	num = FindFrame ("content");
	if (num != -1)			
		parent.frames['subframe'].frames[num].history.back ();
	}


function Forward () {
	
	var			num;

	SaveSubFrames ();

	num = FindFrame ("content");
	if (num != -1)
		parent.frames['subframe'].frames[num].history.forward ();
	}

