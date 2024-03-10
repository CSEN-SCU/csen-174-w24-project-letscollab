console.log("projects.js loaded ...")
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
$(async () => {
    /** remove demo project */
    document.querySelector("section").remove();

    userInfo = await API.getMyInfo();
    userInfo = userInfo.data;
    console.log(userInfo);
    userSkills = userInfo["Skills"];
    console.log(userSkills);
    
    if (userSkills.includes("C++"))
        console.log("hi");

    /** get object of all projects from API call */
    await API.getAllProjects().then(response => {
        let projects = response.data;
        console.log(projects);

        /** proj == projects[project] is an object */
        for (project in projects)
        {
            let proj = projects[project];
            proj.matchedSkills = 0;

            /** match skills on each project */
            for (skill of proj["Skills Desired"])
                if (userSkills.includes(skill))
                    ++proj.matchedSkills;

            projArray.push(proj);
        }

        /** sort projArray descending by # of matching skills */
        projArray.sort((a, b) => b.matchedSkills - a.matchedSkills);
        console.log(projArray);

        /** `proj` is an object */
        for (proj of projArray)
        {
            createProjectElement(proj);
        }

        console.log("loaded all projects");
    }).catch(err => {
        console.log('error' + err);
    })
})

/**
 * createProjectElement ()
 *
 * create a `section` element for each project
 *
 * @projObj project object being iterated on page load
 */
function createProjectElement(projObj)
{
    const projElement = document.createElement("section");
    projElement.classList.add("projectlist");
    projElement.setAttribute("id", "_" + projObj["ID"]);

    // Project should go to project management page after click
    projElement.addEventListener("click", () => {
       window.location.href = `/manageProject?id=${projObj.ID}`
    });

    // append project element to projectList (in main)
    projectList.append(projElement);

    // construct section elements
    const figure = document.createElement("figure");
    const article = document.createElement("article");

    /** @TODO make this the project's image */
    const image = document.createElement("img");
    if (projObj.CoverImage.length > 0) {
        image.src = "data:image/png;base64," + projObj.CoverImage;
    } else {
        image.src = "../images/background.jpeg";
    }
    image.alt = "project icon";

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

    const desiredSkills = document.createElement("h3");
    desiredSkills.innerHTML = "Desired Skills:";

    // place skills
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
    console.log(projObj["Interested Users"]);

    interestButton.addEventListener("click", function(event) {
        showInterest(interestButton, projObj);
        event.stopPropagation();
    });
    /** separate behavior if its your project */
    if (userInfo["ProjectsCreated"].includes(projObj["ID"]))
    {
        interestButton.classList.add("dis");
        interestButton.innerHTML = "your project";
    }
    else if (userInfo["ProjectsInterested"].includes(projObj["ID"]))
    {
        interestButton.classList.add("selected");
        interestButton.innerHTML = "I'm interested";
    }
    else
    {
        interestButton.addEventListener("click", function() {
            showInterest(interestButton, projObj);
        });
    }

    const peopleInterested = document.createElement("p");
    peopleInterested.classList.add("peopleInterested");
    let num = projObj["Interested Users"].length;
    if (num == 1)
        peopleInterested.innerHTML = num + " student is interested";
    else
        peopleInterested.innerHTML = num + " students are interested";



    // display number of interested students

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
    if (index === 1) {
        /** @TODO based on user, show projects that user marked `interested` */
        console.log("showing interested projects");

        for (project of projects) {
            let projID = project.getAttribute("ID").substring(1);
            if (!userInfo["ProjectsInterested"].includes(projID)) {
                console.log("hiding " + projID);
                project.classList.add("hidden");
            }
        }
    } else if (index === 2) {
        /** @TODO only show projects that the user created */
        console.log("showing created projects");

        for (project of projects) {
            let projID = project.getAttribute("ID").substring(1);
            console.log(projID);
            if (!userInfo["ProjectsCreated"].includes(projID)) {
                console.log("hiding " + projID);
                project.classList.add("hidden");
            }
        }
    }
}

/**
 * showInterest ()
 * @button was pressed
 *
 * @TODO add to studentprofiles.json that user is interested in ___ project,
 * @TODO add to projects.json that another student was interested
 *
 * @TODO removing interest
 */
function showInterest (button, projObj)
{
    /** @TODO add the user to the project's interested users? */
    let isSelected = button.classList.contains("selected");
    API.setProjectInterest(projObj.ID,!isSelected).then(data=>{
        console.log(data);
        if(data.status){
            if(data.data.ProjectsInterested.includes(projObj.ID)){
                button.classList.toggle("selected",true);
                button.innerHTML = "I'm interested!";
            }else{
                button.classList.toggle("selected",false);
                button.innerHTML = "Show Interest";
            }
        }
    }).catch(err=>{
        console.log(err);
    })
}

searchBar.addEventListener('input', function() {
    if (searchBar.value.length > 0) {
        for (let i = 0; i < projectHTMLs.length; ++i) {
            if (!projArray[i].Name.toLowerCase().includes(searchBar.value.toLowerCase())) {
                projectHTMLs[i].classList.add("hidden");
            }
        }
    } else {
        for (let i = 0; i < projectHTMLs.length; ++i) {
            projectHTMLs[i].classList.remove("hidden");
        }
    }
});