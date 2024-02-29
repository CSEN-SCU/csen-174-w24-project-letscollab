$(() => {
    loadSkillList();
});

const loadSkillList = async () => {
    let skills = {};
    await $.ajax({
        url: "/v1/getSkills",
        type: "GET",
        success: function(response, textStatus, xhr) {
            skills = Object.values(response.data);
        },
        error: function(xhr, status, error) {
            console.log("this is bad. very bad");
        }
    });

    // Add all skills to the proper container
    const container = $(".skills");
    skills.forEach((skill) => {
        createSkillElement(container, skill);
    });
}

const createSkillElement = (container, skill) => {
    const newSkill = $("<div>");
    const newSkillIcon = $("<p>");
    const newSkillName = $("<p>");

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