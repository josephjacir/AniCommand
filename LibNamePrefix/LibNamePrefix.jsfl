/*
	LibNamePrefix 
	Prompts the user for a string, which is prepended onto the names of all selected library items.
	Copyright Joseph Jacir 24 February 2014
	v1.01
*/

fl.outputPanel.clear();
var sel = document.library.getSelectedItems();

if (!sel.length) {
	fl.trace("Please select library items to prefix before running.");
} else {
	var prefix = prompt("Enter prefix");
	if (prefix == null || prefix == "") {
		fl.trace("No string input. Exiting.");
	} else {
		for (var i in sel) {
			if (sel[i].itemType != "folder" && sel[i].itemType != "undefined") {
				var repl = sel[i].name.split("/");
				repl = prefix + repl[repl.length-1];
				sel[i].name = repl;
				//At first I tried to handle the directory structures by naming the items with a slash, but Flash handles this automatically and replaces the slashes with dashes. So just adjust the names while disregarding the folder structure and Flash will keep track of their parent folders.
			}
		}
	}
}



