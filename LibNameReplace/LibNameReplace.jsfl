/*
	LibNameReplace v1.01
	Does a find and replace on user-input text on all names in the library.
	
	E.g.
	If inputs are:
		Find: 		DOG
		Replace:	PIG
	
	Results are:		結果
		DOG15.png →	PIG15.png
		DOG15 Movie Clip → PIG15 Movie Clip
	
	Copyright 30 January 2014, Joseph Jacir. 
*/

fl.outputPanel.clear();

fl.trace("This will find and replace all item names matching a regular expression in the library with a replacement string.");

//File utility functions
function upOne(path) {
	//Returns the path of the path argument's parent folder (or containing folder if a file)
	//Returns null if not possible
	if (!path || path.substr(0,8) != "file:///") { return null; }
	
	var parent = path.substr(0,path.lastIndexOf("/")); //chops off the last /
	    parent = path.substr(0,path.lastIndexOf("/")); //same line but this time chops off everything after the new last /
	
	if (parent.length < 10) { return null; } // minimum for file protocol and drive
	return parent;
}

function winPath(path) {
	//Returns a path that Windows can use from a given path that Flash can use.
	return decodeURIComponent(path.split("///")[1].replace("|",":").replace(/\//g,"\\"));
}

function flashURI (windir) {
	//Converts a Windows directory path to a Flash-usable URI.
	var fpath = windir;
	if(fpath) {
		fpath = FLfile.platformPathToURI(unescape(fpath));
		if(fpath.substr(fpath.length-1,1) != "/") {
			fpath += "/";
		}
		return fpath;
	}
	return null;
}

function findAndRepl(find, repl, hits) {
	//hits is for recursion, the number of hits when called. Should be 0 for a non-recursed call. This could be done more elegantly but just need to git 'er done for now.
	//This is recursive because for some reason Flash does not record the replacements every time. So run until the match doesn't work anymore.
	
	var lib = fl.getDocumentDOM().library;
	var findrx = new RegExp(find, "g");
	
	
	for (var i in lib.items) {
		//Check each name
		var name = lib.items[i].name;
		var path = name.substr(0,name.lastIndexOf("/"))
		name = name.substr(name.lastIndexOf("/")+1, name.length);
		if(name.search(findrx) != -1) {
		//Replace name if matching
			fl.trace(++hits + ")	" + name);
			name = name.replace(findrx, repl);
			fl.trace(" →\t" + name + "\n");
			lib.items[i].name = name;
			hits = findAndRepl(find, repl, hits); //Recurse because JSFL sux
		} else {
			//fl.trace("・	" + name);
		} /**/
	}
	
	return hits;
}


//Entry point
var find = prompt("Find and Replace library item names (RegExp):");

if (find != "" && find != null) {
	var repl = prompt("Replace string:");
	
	if (repl != "" && repl != null) {
		fl.trace("Please wait...");
		fl.trace("\nReplaced " + findAndRepl(find, repl, 0, null));
	} else {
		fl.trace("User did not provide a replacement string; quitting.");
	}
} else {
	fl.trace("User did not provide search expression; quitting.");
}

