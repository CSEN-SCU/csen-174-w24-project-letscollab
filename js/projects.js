console.log("projects.js loaded ...")

var header = document.querySelector("header");
var tabs = header.querySelectorAll("li");
var currentTab = 0;

/*
 * selectTab ()
 * @param index denotes which tab was pressed
 * 
 * changes selected tab in header
 */
function selectTab (index)
{
    // trivial case: active tab clicked on
    if (currentTab == index)
        return;

    // update `currentTab`
    currentTab = index;

    // go through each tab and remove `active` class selector
    for (let i=0; i<tabs.length; ++i)
    {
        tabs[i].classList.remove("active")
    }

    // add `active` class selector to the tab that was clicked on
    tabs[index].classList.add("active");

    // TODO call function that determines which projects to display based on the given tab
}

/*
 * showInterest ()
 * @param button button that was pressed
 * 
 * should add to the database that user is interested in ___ project,
 * and should also add to the project database that another student was interested
 * 
 * vice versa
 */
function showInterest (button)
{
    console.log(button + " clicked on" + typeof(Array.from(button.classList)));

    // TODO LOGIC FOR PUTTING INTEREST IN DATABASE
    button.classList.toggle("selected");
    
    // edit the text below the button
    let tag = button.nextElementSibling.querySelector("mark");
    let num = Number(tag.innerHTML);

    // if we have now shown interest ...
    if (button.classList.contains("selected"))
    {
        button.innerHTML = "I'm interested!";
        tag.innerHTML = num+1;
    }
    else
    {
        button.innerHTML = "Show Interest";
        tag.innerHTML = num-1;
    }
}