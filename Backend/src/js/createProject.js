// On page load create event listeners
$(async () => {
    // Create input listener for uploading project image
    $("#photo").on("input", (event) => {
        updatePreviewImage(event);
    });

    // Create key listener for project name
    $("#name").on("keyup", () => {
        updatePreviewName();
    });

    // Create key listener for project description
    $("#description").on("keyup", () => {
        updatePreviewDescription();
    });

    // Create input listener for project time
    $("#time").on("input", () => {
        updatePreviewDateTime();
    });

    // Create input listener for project date
    $("#date").on("input", () => {
        updatePreviewDateTime();
    });

    // Create input listener for project location
    $("#location").on("input", () => {
        updatePreviewLocation();
    });

    // Load skill list
    await loadSkillList();
});

/**
 * Updates the image of the preview display in realtime
 */
const updatePreviewImage = (event) => {
    // Check if there is an image in the upload list
    const images = event.target.files;
    if (images.length < 0) return;

    const image = URL.createObjectURL(images[0]);
    const previewElement = $("#projectlist img");
    previewElement.attr("src", image);

    // Create status message
    const status = $("#uploadstatus");
    status.html("Upload Successful!");
    status.css({
        "color": "green",
        "font-size": "small",
    });
}

/**
 * Updates the title of the preview display in realtime
 */
const updatePreviewName = () => {
    const titleContent = $("#name").val();
    const previewElement = $("article h1");
    if (titleContent.length < 1) {
        previewElement.text("My Project");
    } else {
        previewElement.text(titleContent)
    }
}

/**
 * Updates the description of the preview in realtime
 */
const updatePreviewDescription = () => {
    const descriptionContent = $("#description").val();
    const previewElement = $("p.description");
    if (descriptionContent.length < 1) {
        previewElement.html("Give a detailed explanation of your project");
    } else {
        previewElement.html(descriptionContent);
    }
}

/**
 * Updates the meetup time of the preview in realtime (the regex is ugly, and I'm sorry) <-- its not that bad anymore
 */
const updatePreviewDateTime = () => {
    const previewElement = $("#projectlist #meettime");

    // Number to text month object
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // Gather time data
    const timeContent = $("#time").val();
    if (timeContent) {
        let timeSuffix = "AM";
        let hour = parseInt(timeContent.split(":")[0]);
        let minutes = timeContent.split(":")[1];
        if (hour > 12) { // Account for 24 hour time
            hour -= 12;
            timeSuffix = "PM";
        }

        const timeResult = `${hour}:${minutes} ${timeSuffix}`;

        // Update preview element
        previewElement.html(previewElement.html().replace(/(Meetup Time:\s)(.+)/g, `$1${timeResult}`));
    }

    // Gather date data
    const dateContent = $("#date").val();
    if (dateContent) {
        const year = parseInt(dateContent.split("-")[0]);
        const month = parseInt(dateContent.split("-")[1]);
        const day = parseInt(dateContent.split("-")[2]);


        const dateResult = `${months[month]} ${day}, ${year}`;

        // Update preview element
        previewElement.html(previewElement.html().replace(/(Meetup Time:\s)(.+)/g, `$1${dateResult} at $2`));
    }
}

/**
 * Updates the location of the preview in realtime
 */
const updatePreviewLocation = () => {
    const locationContent = $("#location").val();
    const previewElement = $("#projectlist #meetlocation");

    if (locationContent.length > 1) {
        previewElement.html(previewElement.html().replace(/(Location:\s)(.+)/g, `$1${locationContent}`));
    } else {
        previewElement.html(previewElement.html().replace(/(Location:\s)(.+)/g, "$1x"));
    }
}

/**
 * Loads the general index of skills from skills.json
 */
const loadSkillList = async () => {
    let skills = {};
    await $.ajax({
        url: "/v1/getSkills",
        type: "GET",
        success: function(response, textStatus, xhr) {
            skills = response.data["skillList"];
        },
        error: function(xhr, status, error) {
            console.log("this is bad. very bad");
        }
    });

    // Add all skills to the proper container
    const container = $("#selectskills");
    skills.forEach((skill) => {
        createSkillElement(container, skill, false);
    });
}

/**
 * Creates a skill element in a given container
 * @param {object}container Where to put the skill
 * @param {object}skill What the skill is in format { skillName: "name", skillType: "type"}
 * @param {boolean}isPreview Whether the skill is being appended to the preview view or not
 */
const createSkillElement = (container, skill, isPreview) => {
    const newSkill = $("<div>");
    const newSkillIcon = $("<p>");
    const newSkillName = $("<p>");

    // Add event listener to skills only if it is NOT a preview item
    if (!isPreview) {
        newSkill.click(() => {
            // If the skill exists in the project, remove it
            if (newSkill.hasClass("selected")) {
                newSkill.removeClass("selected");
                removeSkillElement(skill.skillName);
            } else { // Otherwise, add it
                newSkill.addClass("selected");
                const previewContainer = $("#projectlist .skills");
                createSkillElement(previewContainer, skill, true)
            }
        });
    }


    // Add proper classes and content
    newSkill.addClass(`skill ${skill.skillType}`);

    newSkillIcon.addClass("skillicon");
    newSkillIcon.text("•");

    newSkillName.addClass("skillname");
    newSkillName.text(skill.skillName);

    // Create element hierarchy
    newSkill.append(newSkillIcon);
    newSkill.append(newSkillName);
    container.append(newSkill);
}

/**
 * Removes a skill element from the preview based on the name of the skill
 * @param {string}skillName Name of skill
 */
const removeSkillElement = (skillName) => {
    const skills = $("#projectlist .skills").children();
    skills.each((index, skill) => {
        if ($(skill).find(".skillname").html() === skillName) skills.eq(index).remove();
    })
}