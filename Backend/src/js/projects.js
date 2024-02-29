console.log("projects.js loaded ...")

/**
 * document selectors
 */
var header = document.querySelector("header");
var tabs = header.querySelectorAll("li");
var projectList = document.querySelector("main");

/**
 * global variables
 */
var currentTab = 0;
var projArray = [];
var userSkills;

/**
 * asynchronous function on page load
 */
$(async () => {
    /** remove demo project */
    document.querySelector("section").remove();

    const userinfo = await API.getMyInfo();
    userSkills = userinfo.data["Skills"];
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
            {
                if (userSkills.includes(skill))
                {
                    //console.log("matched skill " + skill);
                    ++proj.matchedSkills;
                }
            }

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
        console.log(projectIDs);

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
 * @param projObj project object being iterated on page load
 */
function createProjectElement(projObj)
{
    const projElement = document.createElement("section");
    projElement.classList.add("projectlist");

    // append project element to projectList (in main)
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
    if(projObj["Interested Users"].includes(localStorage.getItem("Email"))){
        interestButton.classList.toggle("selected");
        interestButton.textContent="I'm interested";  
    }

    interestButton.addEventListener("click", function() {
        showInterest(interestButton, projObj);
    });

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
    if (index === 1) {
        /** @TODO based on user, show projects that user marked `interested` */
        console.log("showing interested projects");
    }
    else
    {
        /** @TODO only show projects that the user created */
        console.log("showing created projects");
        console.log(projects[0]);
        for (let i = 0; i < projects.length; ++i) {
            if (localStorage.getItem("ProjectsCreated").split(',').indexOf(projectIDs[i]) === -1) {
                projects[i].classList.add("hidden");
            }
        }
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