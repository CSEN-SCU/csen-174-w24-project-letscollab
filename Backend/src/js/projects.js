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
var userInfo;
var userSkills;

/**
 * asynchronous function on page load
 */
$(async () => {
    /** remove demo project */
    document.querySelector("section").remove();

    /** fetch user's info from the API */
    await API.getMyInfo().then(response => {
        console.log(response.data);
        userInfo = response.data;
    }).catch(err => {
        console.log("error fetching user info: " + err);
    })

    /** extract user skills */
    userSkills = userInfo["Skills"];
    console.log(userSkills);
    
    /** fetch object of all projects from API */
    await API.getAllProjects().then(response => {
        console.log(response.data);
        let projects = response.data;

        /** proj == projects[project] is an object */
        for (project in projects)
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
    /** each project has a `section` element with id _`projectID` */
    const projElement = document.createElement("section");
    projElement.classList.add("projectlist");
    projElement.setAttribute("id", "_" + projObj["ID"]);

    /** append section to projectList (main) */
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

    /** disable interest button for your own projects */
    if (userInfo["ProjectsCreated"].includes(projObj["ID"]))
    {
        interestButton.classList.add("dis");
        interestButton.innerHTML = "your project";
    }
    /** other people's projects -> add click listener */
    else
    {
        interestButton.addEventListener("click", function() {
            showInterest(interestButton, projObj);
        });

        /** properly display if you are already interested in this project */
        if (userInfo["ProjectsInterested"].includes(projObj["ID"]))
        {
            interestButton.classList.add("selected");
            interestButton.innerHTML = "I'm interested";
        }
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
    if(index == 3){
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
    }

    /** @TODO call API function that display/hide projects according to currentTab */
    if (index == 1) {
        /** @TODO based on user, show projects that user marked `interested` */
        console.log("showing interested projects");

        for (project of projects)
        {
            projID = project.getAttribute("ID").substring(1);
            if (!userInfo["ProjectsInterested"].includes(projID))
            {
                console.log("hiding " + projID);
                project.classList.add("hidden");
            }
        }
    }
    else if (index == 2)
    {
        /** @TODO only show projects that the user created */
        console.log("showing created projects");

        for (project of projects)
        {
            projID = project.getAttribute("ID").substring(1);
            console.log(projID);
            if (!userInfo["ProjectsCreated"].includes(projID))
            {
                console.log("hiding " + projID);
                project.classList.add("hidden");
            }
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
    let interestText = button.nextSibling;

    /** update userProfiles and projects json files with API call */
    await API.setProjectInterest(projObj.ID, !isSelected).then(response => {
        console.log(response);

        /** at the time of pressing button, if it's selected */
        if (!isSelected)
        {
            button.innerHTML = "I'm interested!";

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
        if (num == 1)
            interestText.innerHTML = num + " student is interested";
        else
            interestText.innerHTML = num + " students are interested";

    }).catch(err => {
        console.log("error marking interest in project: " + err);
    })


    /** UPDATE user's info from the API */
    await API.getMyInfo().then(response => {
        console.log(response.data);
        userInfo = response.data;
    }).catch(err => {
        console.log("error updating user info: " + err);
    })
}