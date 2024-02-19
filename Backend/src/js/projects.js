console.log("projects.js loaded ...")

/**
 * document selectors
 */
var header = document.querySelector("header");
var tabs = header.querySelectorAll("li");
var projectList = document.querySelector("main");
var currentTab = 0;

/**
 * on page load
 */
$(async () => {
    console.log("loading projects asynchronously ...");

    // remove the demo project
    const demoProject = document.querySelector("section");
    demoProject.remove();

    let projects = {};
    await $.ajax({
        url: "/v1/getAllProjects",
        type: "GET",
        success: function (response, textStatus, xhr) {
            projects = response.data;
            console.log(response);
        },
        error: function (xhr, status, error) {
            console.log ("error loading project list ...")
        }
    })

    /**
     * iterate through each project in projects.json
     */
    for (project in projects)
    {
        createProjectElement(projects[project]);
    }
});

/**
 * createProjectElement ()
 * 
 * create a `section` element for each project
 * 
 * @param projObj project object being iterated on page load
 */
function createProjectElement(projObj)
{
    // log
    console.log(projObj);

    const projElement = document.createElement("section");
    projElement.classList.add("projectlist");
    // append our new project element to the project list (in main)
    projectList.append(projElement);

    // making the different parts of the section
    const figure = document.createElement("figure");
    const article = document.createElement("article");

    // TODO make this the project's image
    const image = document.createElement("img");
    image.src = "../images/background.jpeg";
    image.alt = "project icon";

    const projName = document.createElement("h1");
    projName.innerHTML = projObj.Name;

    const desc = document.createElement("p");
    desc.classList.add("description");
    desc.innerHTML = projObj.Description;

    const meetTime = document.createElement("h3"); 
    meetTime.classList.add("meettime");
    meetTime.innerHTML = "Meetup Time: " + projObj.Meetup.Time;

    const meetLoc = document.createElement("h3");
    meetLoc.classList.add("meetlocation");
    meetLoc.innerHTML = "Location: " + projObj.Meetup.Location;

    const desiredSkills = document.createElement("h3");
    desiredSkills.innerHTML = "Desired Skills:";

    // TODO place skills
    const skills = document.createElement("div");
    skills.classList.add("skills");
    for (skill in projObj["Skills Desired"])
    {
        console.log(skill);
    }

    const aside = document.createElement("aside");

    const interestButton = document.createElement("p");
    interestButton.classList.add("interestButton");
    interestButton.onclick = "showInterest(this)";
    interestButton.innerHTML = "Show Interest";

    const peopleInterested= document.createElement("p");
    peopleInterested.classList.add("peopleInterested");
    peopleInterested.innerHTML = projObj.PeopleRequired + " people are interested";

    projElement.append(figure);
    figure.append(article);
    article.append(image);
    article.append(projName);
    figure.append(desc);
    figure.append(meetTime);
    figure.append(meetLoc);
    figure.append(desiredSkills);
    figure.append(skills);
    projElement.append(aside);
    aside.append(interestButton);
    aside.append(peopleInterested);

    // TODO add event listener for the section
}

/**
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