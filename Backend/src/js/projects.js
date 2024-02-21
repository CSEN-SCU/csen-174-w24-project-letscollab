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
    API.getAllProjects().then(response => {
        projects = response.data;
        console.log(response.data);

        // iterate through each project in projects.json, creating html elements
        for (project in projects)
        {
            createProjectElement(projects[project]);
        }
    }).catch(err => {
        console.log('error' + err);
    })

    /* outdated ajax call */
    // await $.ajax({
    //     url: "/v1/getAllProjects",
    //     type: "GET",
    //     success: function (response, textStatus, xhr) {
    //         // projects = response.data;
    //         console.log(response.data);
    //     },
    //     error: function (xhr, status, error) {
    //         console.log ("error loading project list ...")
    //     }
    // })
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

    // place skills
    const skills = document.createElement("div");
    skills.classList.add("skills");
    for (skill of projObj["Skills Desired"])
    {
        /** @TODO highlight skills */
        console.log(skill);

        const skillDiv = document.createElement("div");
        skillDiv.classList.add("skill");

        const skillIcon = document.createElement("p");
        skillIcon.classList.add("skillicon");
        skillIcon.innerHTML = "•";
        
        const skillName = document.createElement("p");
        skillName.classList.add("skillname");
        skillName.innerHTML = skill;

        skills.append(skillDiv);
        skillDiv.append(skillIcon);
        skillDiv.append(skillName);
    }

    const aside = document.createElement("aside");

    const interestButton = document.createElement("p");
    interestButton.classList.add("interestButton");
    interestButton.innerHTML = "Show Interest";
    
    // add event listener for the interest button
    interestButton.addEventListener("click", function() {
        showInterest(interestButton, projObj);
    });

    // display number of interested students
    const peopleInterested = document.createElement("p");
    peopleInterested.classList.add("peopleInterested");
    let num = projObj["Interested Users"].length;
    if (num == 1)
        peopleInterested.innerHTML = num + " student is interested";
    else
        peopleInterested.innerHTML = num + " students are interested";

    // construct the section
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

/**
 * showInterest ()
 * @param button button that was pressed
 * 
 * @TODO add to studentprofiles.json that user is interested in ___ project,
 * @TODO add to projects.json that another student was interested
 * 
 * @TODO removing interest
 */
function showInterest (button, projObj)
{
    console.log(projObj);
    /** @TODO add the user to the project's interested users? */
    button.classList.toggle("selected");

    // if we have now shown interest ...
    if (button.classList.contains("selected"))
    {
        button.innerHTML = "I'm interested!";
    }
    else
    {
        button.innerHTML = "Show Interest";
    }

    // API.updateProject();

    /*
    // edit the text below the button
    let tag = button.nextElementSibling.querySelector("mark");
    let num = Number(tag.innerHTML);
    */
}