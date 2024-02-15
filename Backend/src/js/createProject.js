// On page load create event listeners
$(() => {
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
    loadSkillList();
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
 * Updates the meetup time of the preview in realtime (the regex is ugly, and I'm sorry)
 */
const updatePreviewDateTime = () => {
    const previewElement = $("#projectlist #meetup");

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
        previewElement.html(previewElement.html().replace(/(Meetup Time:\s)(.+)(\sLocation:\s.+)/g, `$1${timeResult}$3`));
    }

    // Gather date data
    const dateContent = $("#date").val();
    if (dateContent) {
        const year = parseInt(dateContent.split("-")[0]);
        const month = parseInt(dateContent.split("-")[1]);
        const day = parseInt(dateContent.split("-")[2]);


        const dateResult = `${months[month]} ${day}, ${year}`;

        // Update preview element
        previewElement.html(previewElement.html().replace(/(Meetup Time:\s)(.+)(\sLocation:\s.+)/g, `$1${dateResult} at $2$3`));
    }
}

/**
 * Updates the location of the preview in realtime
 */
const updatePreviewLocation = () => {
    const locationContent = $("#location").val();
    const previewElement = $("#projectlist #meetup");

    if (locationContent.length > 1) {
        previewElement.html(previewElement.html().replace(/(.+Location:\s)(.+)/g, `$1${locationContent}`));
    } else {
        previewElement.html(previewElement.html().replace(/(.+Location:\s)(.+)/g, "$1x"));
    }
}

/**
 * Loads the general index of skills from skills.json
 */
const loadSkillList = () => {
    let skills;
    $.ajax({
        url: "/v1/getSkills",
        type: "GET",
        success:function(response, textStatus, xhr) {
            skills = response.data;
        },
        error:function(xhr, status, error) {
            console.log("god dammit");
        }
    })
}