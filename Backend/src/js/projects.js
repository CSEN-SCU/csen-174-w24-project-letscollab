/**
 * document selectors
 */
const header = document.querySelector("header");
const tabs = header.querySelectorAll("li");
const projectList = document.querySelector("main");

/**
 * Search bar functionality
 */
const searchBar = document.getElementById("searchprojects");
const projectHTMLs = document.getElementsByClassName("projectlist");

/**
 * global variables
 */
let currentTab = 0;
const projArray = [];
let userInfo;
let userSkills;

/**
 * asynchronous function on page load
 */


function timeSince(epoch) {
    const seconds = Math.floor((Date.now() - epoch) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        return "Posted " + Math.floor(interval) + "yr" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return "Posted " + Math.floor(interval) + "mo" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return "Posted " + Math.floor(interval) + "d" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return "Posted " + Math.floor(interval) + "hr" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return "Posted " + Math.floor(interval) + "min" + (Math.floor(interval) > 1 ? "s" : "") + " ago";
    }
    return "Posted " + Math.floor(seconds) + "sec" + (Math.floor(seconds) > 1 ? "s" : "") + " ago";
}


$(async () => {
    /** remove demo project */
    document.querySelector("section").remove();

    /** fetch user info from the API */
    await API.getMyInfo().then(response => {
        userInfo = response.data;
    }).catch(err => {
        console.error("error fetching user info: " + err);
    })

    /** extract user skills */
    userSkills = userInfo["Skills"];
    
    /** fetch object of all projects from API */
    await API.getAllProjects().then(response => {
        let projects = response.data;

        /** proj == projects[project] is an object */
        for (let project in projects)
        {
            let proj = projects[project];
            /** track number of skills that user matches */
            proj.matchedSkills = 0;

            /** match skills on each project */
            for (skill of proj["Skills Desired"])
                if (userSkills.includes(skill))
                    ++proj.matchedSkills;

            /** push projects to array */
            projArray.push(proj);
        }

        /** sort projArray descending by # of matching skills */
        projArray.sort((a, b) => b.matchedSkills - a.matchedSkills);

        /** `proj` is an object -> create it's HTML element */
        for (let proj of projArray)
        {
            createProjectElement(proj);
        }
    }).catch(err => {
        console.error("error" + err);
    })
})

/**
 * Hide an element with a fade out effect using setTimeout
 * @param {*} element element to pass to function 
 */
function hideElement(element){
    element.classList.add("opacityfadein");
    setTimeout(()=>{
        element.classList.add("hidden");
    },250)
}

function unhideElement(element){
    element.classList.remove("hidden");
    element.classList.add("opacityfadein");
    setTimeout(()=>{
        element.classList.remove("opacityfadein");
    },250)
}

/**
 * createProjectElement ()
 *
 * create a `section` element for each project
 *
 * @projObj project object being iterated on page load
 */
function createProjectElement(projObj)
{
    /** each project has a `section` element with id _`projectID` */
    const projElement = document.createElement("section");
    projElement.classList.add("projectlist","opacityfadein");
    projElement.setAttribute("id", "_" + projObj["ID"]);

    /** append section to projectList (main) */
    projectList.append(projElement);
    setTimeout(()=>{
        projElement.classList.remove("opacityfadein");
    },250)
    /** construct section elements */
    const figure = document.createElement("figure");
    const article = document.createElement("article");

    /** display the project image if it exists */
    const image = document.createElement("img");
    if (projObj["CoverImage"].length > 0){
        if(projObj["CoverImage"].startsWith("https://")){
            image.src = projObj["CoverImage"];
        }else{
            image.src = "data:image/png;base64," + projObj["CoverImage"];
        }
    }
    else
        image.src = "https://cdn-icons-png.flaticon.com/512/2103/2103930.png"

    image.alt = "project icon";

    /** display project details */
    const projName = document.createElement("h1");
    projName.innerHTML = projObj.Name;

    const desc = document.createElement("p");
    desc.classList.add("description");
    desc.innerHTML = projObj.Description;

    const meetTime = document.createElement("h3");
    meetTime.classList.add("meettime");
    /** projObj.Meetup.Time is saved as a unix timestamp */
    let date = new Date(projObj.Meetup.Time * 1000);
    meetTime.innerHTML = "Meetup Time: " + projObj.Meetup.Time;
    meetTime.innerHTML = "Meetup Time: " + date.toLocaleString();

    const meetLoc = document.createElement("h3");
    meetLoc.classList.add("meetlocation");
    meetLoc.innerHTML = "Location: " + projObj.Meetup.Location;

    const meetOrganizerDiv = document.createElement("div");
    meetOrganizerDiv.id = "organizerDiv";
    
    const meetOrganizer = document.createElement("h3");
    meetOrganizer.classList.add("organizer");
    meetOrganizer.innerHTML = "Organizer:"

    const meetOrganizerName = document.createElement("button");
    meetOrganizerName.classList.add("organizername");
    meetOrganizerName.id = "organizername";
    meetOrganizerName.innerHTML = projObj.AuthorEmail;
    meetOrganizerDiv.append(meetOrganizer);
    meetOrganizerDiv.append(meetOrganizerName);

    meetOrganizerName.addEventListener("click", function(event) {
        event.stopPropagation();
        window.location.href = `/viewProfile?id=${projObj.AuthorEmail}`;
    })
    const desiredSkills = document.createElement("h3");
    desiredSkills.innerHTML = "Desired Skills:";

    /** place skills related to project */
    const skills = document.createElement("div");
    skills.classList.add("skills");
    for (skill of projObj["Skills Desired"])
    {
        const skillDiv = document.createElement("div");
        skillDiv.classList.add("skill");

        /** highlight matched skills */
        if (userSkills.includes(skill))
            skillDiv.style.backgroundColor = "green";

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
    
    const timeSinceP = document.createElement("p");
    timeSinceP.classList.add("timeSince");
    timeSinceP.innerHTML = timeSince(projObj.CreatedAt);
    /** boolean - is the user interested in this project */
    const USERINTERESTED = userInfo["ProjectsInterested"].includes(projObj["ID"]);

    /** disable interest button for your own projects */
    if (userInfo["ProjectsCreated"].includes(projObj["ID"]))
    {
        interestButton.classList.add("myproject");
        interestButton.innerHTML = "Manage Project";
        interestButton.addEventListener("click", function(event) {
            event.stopPropagation();
            window.location.href = `/manageProject?id=${projObj.ID}`
        });
    }
    /** disable button if project is full and user is not already interested */
    else if ((projObj["Interested Users"].length == projObj["PeopleRequired"]) && !USERINTERESTED)
    {
        interestButton.classList.add("dis");
        interestButton.innerHTML = "Project is full";
    }
    /** other people's projects -> add click listener */
    else
    {
        interestButton.addEventListener("click", function(event) {
            showInterest(interestButton, projObj);
            /** don't trigger the event listener of the underlying `section` */
            event.stopPropagation();
        });

        /** properly display if you are already interested in this project */
        if (USERINTERESTED)
        {
            interestButton.classList.add("selected");
            interestButton.innerHTML = "I'm interested";
        }
    }

    /** display number of interested students */
    const peopleNav = document.createElement("nav");
    const people1 = document.createElement("p");
    const people2 = document.createElement("p");
    const people3 = document.createElement("p");

    /** `Interested Users` is an array of emails */
    let num = projObj["Interested Users"].length;
    let num2 = projObj["PeopleRequired"];
    people1.innerHTML = num ;
    people2.innerHTML = " of " + num2;

    if (num === 1)
        people3.innerHTML = " students are interested";
    else
        people3.innerHTML = " students are interested";

    // Project should go to project management page after click
    projElement.addEventListener("click", () => {
        event.preventDefault();
        window.location.href = `/manageProject?id=${projObj.ID}`
    });

    /** project redirects to `manageProject` page on click */
    // projElement.addEventListener("click", () => {
    //     window.location.href = `/manageProject?id=${projObj.ID}`;
    // });

    const interestSection = document.createElement("div");
    interestSection.classList.add("interestSection");

    /** construct project section */
    projElement.append(figure);
    figure.append(article);
    article.append(image);
    article.append(projName);
    figure.append(desc);
    figure.append(meetTime);
    figure.append(meetLoc);
    figure.append(meetOrganizerDiv);
    figure.append(desiredSkills);
    figure.append(skills);
    projElement.append(aside);
    peopleNav.append(people1);
    peopleNav.append(people2);
    peopleNav.append(people3);
    interestSection.append(interestButton);
    interestSection.append(peopleNav);
    aside.append(timeSinceP)
    aside.append(interestSection);
}

/**
 * selectTab ()
 * @index which tab was pressed
 *
 * changes selected header tab 
 * display/hide projects accordingly
 */
function selectTab (index)
{
    // trivial case: active tab clicked on
    if (currentTab == index)
        return;

    if(index == 3)
    {
        window.location.href = '/createProject'
        return;
    }

    // change active tab
    tabs[currentTab].classList.remove("active");
    currentTab = index;
    tabs[index].classList.add("active");

    const projects = document.getElementsByClassName("projectlist");
    // initially unhide all projects
    for (project of projects)
    {   
       project.classList.remove("hidden");
       project.classList.add("opacityfadein");
    }

    /** only show projects the user is interested in */
    if (index === 1) {
        /** show projects that user marked `interested` */
        for (project of projects)
        {
            let projID = project.getAttribute("ID").substring(1);
            if (!userInfo["ProjectsInterested"].includes(projID)){
                hideElement(project);
            }else{
                unhideElement(project);
            }
        }
    /** only show projects created by the user */
    } else if (index === 2) {
        for (project of projects)
        {
            let projID = project.getAttribute("ID").substring(1);
            if (!userInfo["ProjectsCreated"].includes(projID)){
                hideElement(project)
            }else{
                unhideElement(project);
            }
        }
    }else{
        for(project of projects){
            unhideElement(project);
        }
    }
}

/**
 * showInterest ()
 * @button was pressed
 * @projObj project object we are marking (dis)interest in
 * 
 */
async function showInterest (button, projObj)
{
    let isSelected = button.classList.contains("selected");

    /** text under the button */
    let peopleNav = button.nextSibling;
    let people1 = peopleNav.childNodes[0];
    let people3 = peopleNav.childNodes[2];

    /** update userProfiles and projects json files with API call */
    await API.setProjectInterest(projObj.ID, !isSelected).then(response => {

        /** at the time of pressing button, if it's selected */
        if (!isSelected)
        {
            button.innerHTML = "I'm Interested!";

            /** (statically) add user to project `interested users` array */
            projObj["Interested Users"].push(userInfo["Email"]);
        }
        else
        {
            button.innerHTML = "Show Interest";

            /** (statically) remove user from project's `interested users` array */
            let index = projObj["Interested Users"].indexOf(userInfo["Email"]);
            if (index != -1)
                projObj["Interested Users"].splice(index, 1);
        }

        /** update button */
        button.classList.toggle("selected");

        /** update interest text */
        let num = projObj["Interested Users"].length;
        people1.innerHTML = num;
        if (num == 1)
            people3.innerHTML = "student is interested";
        else
            people3.innerHTML = "students are interested";

    }).catch(err => {
        console.error("error marking interest in project: " + err);
    })

    /** UPDATE user info from the API */
    await API.getMyInfo().then(response => {
        userInfo = response.data;
    }).catch(err => {
        console.error("error updating user info: " + err);
    })
}

/**
 * event listener for the search bar
 */
searchBar.addEventListener('input', function() {
    /** sanitize user input */
    let input = searchBar.value.toLowerCase();

    /** filter if user added input */
    if (input.length > 0)
    {
        for (let i = 0; i < projectHTMLs.length; ++i)
        {
            if (projArray[i].Name.toLowerCase().includes(input))
                projectHTMLs[i].classList.remove("hidden");
            else
                projectHTMLs[i].classList.add("hidden");
        }
    } else
        for (html of projectHTMLs)
            html.classList.remove('hidden');
});