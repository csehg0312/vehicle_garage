if (screentype=="1"){//Contents Screen
max=16;
}
else if (screentype=="2"){//Index no Wire diagrams
max=17;
}
else if (screentype=="3"){//Index with Wire diagrams
max=18;
}

function checkrez(){
	if (navigator.appName.indexOf("M")==0){
		if (screen.width<=640){
			document.pic1.src="xhonda_logo.jpg";
			p2=document.pic2.src;
			p2=p2.replace("civic","xcivic");
			document.pic2.src=p2;
			for (i=1; i<max;){
				eval("z=document.button"+i+".src");
				z=z.replace("IB/","IB/x");
				eval("document.button"+i+".src=z");
				i++;
			}
		}
	}
}

if (location.href.indexOf("CivContents.htm")>=1){
}
else{
	parent.frames('navbar').location.href="navbar.htm";
}