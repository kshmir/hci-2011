/*
EASY TABS 1.1 Produced and Copyright by Koller Juergen
www.kollermedia.at | www.austria-media.at
You can use this Script for private and commercial Projects, 
but just leave the two credit lines, thank you.
*/


//EASY TABS 1.1 - MENU SETTINGS
//Set the id names of your tablink (without a number at the end)
var tablink_idname = new Array("tablink")
//Set the id name of your tabcontentarea (without a number at the end)
var tabcontent_idname = new Array("tabcontent") 
//Set the number of your tabs
var tabcount = new Array("2")
//Set the Tab wich should load at start (In this Example:Tab 2 is visible on load)
var loadtabs = new Array("1")  


/*Swich EasyTabs Functions - no need to edit something here*/
function easytabs(menunr, active) {
menunr = menunr-1;
for (i=1; i <= tabcount[menunr]; i++)
{
document.getElementById(tablink_idname[menunr]+i).className='tab'+i;
document.getElementById(tabcontent_idname[menunr]+i).style.display = 'none';
}
document.getElementById(tablink_idname[menunr]+active).className='tab'+active+' tabactive';
document.getElementById(tabcontent_idname[menunr]+active).style.display = 'block';
}
window.onload=function(){
var menucount=loadtabs.length; var a = 0; var b = 1; do {easytabs(b, loadtabs[a]); a++; b++;}while (b<=menucount);
}