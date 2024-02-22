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
window.onload = async function () {
    console.log("loading projects asynchronously ...");

    // remove the demo project
    const demoProject = document.querySelector("section");
    demoProject.remove();

    let projects = {};
    await API.getAllProjects().then(response => {
        projects = response.data;
        console.log(response.data);

        // iterate through each project in projects.json, creating html elements
        /** @TODO matching by skills? */
        for (project in projects)
        {
            createProjectElement(projects[project]);
        }

        console.log("loaded all projects");
    }).catch(err => {
        console.log('error' + err);
    })

    console.log("done");
}

/**
 * createProjectElement ()
 *
 * create a `section` element for each project
 *
 * @param projObj project object being iterated on page load
 */
function createProjectElement(projObj)
{
    // log project object
    console.log(projObj);

    const projElement = document.createElement("section");
    projElement.classList.add("projectlist");
    // append our new project element to the project list (in main)
    projectList.append(projElement);

    // construct section elements
    const figure = document.createElement("figure");
    const article = document.createElement("article");

    /** @TODO make this the project's image */
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
    // projObj.Meetup.Time is saved as a unix timestamp
    let date = new Date(projObj.Meetup.Time * 1000);
    meetTime.innerHTML = "Meetup Time: " + projObj.Meetup.Time;
    meetTime.innerHTML = "Meetup Time: " + date.toLocaleString();

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
        /** @TODO highlight skills if they match user */
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

    // add mouse click event listener for interest button
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
 * @param index which tab was pressed
 *
 * changes selected tab in header
 * displays/hides projects accordingly
 */
function selectTab (index)
{
    // trivial case: active tab clicked on
    if (currentTab == index)
        return;

    // change active tab
    tabs[currentTab].classList.remove("active");
    currentTab = index;
    tabs[index].classList.add("active");

    const projects = document.getElementsByClassName("projectlist");
    // initially unhide all projects
    for (project of projects)
    {
       project.classList.remove("hidden");
    }

    /** @TODO call API function that display/hide projects according to currentTab */
    if (index == 1) {
        /** @TODO based on user, show projects that user marked `interested` */
        console.log("showing interested projects");
    }
    else
    {
        /** @TODO only show projects that the user created */
        console.log("showing created projects");
    }
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
    const peopleInterested = button.parentElement.getElementsByClassName("peopleInterested");
    let num = projObj["Interested Users"].length;
    if (num == 1)
        peopleInterested.innerHTML = num + " student is interested";
    else
        peopleInterested.innerHTML = num + " students are interested";
    /*
    // edit the text below the button
    let tag = button.nextElementSibling.querySelector("mark");
    let num = Number(tag.innerHTML);
    */
}