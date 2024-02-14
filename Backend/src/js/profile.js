$(function() {
    const LISTS = ["#skills", "#addskills"];
    const STATES = ["removable", "selectable"];

    function createSkill(skill, category) {
        const newSkill = document.createElement("div");
        const dot = document.createElement('p');
        const skillName = document.createElement('p');
        dot.classList.add("skillicon");
        dot.textContent = "•";
        skillName.classList.add("skillname");
        skillName.textContent = skill;
        newSkill.classList.add("skill");
        newSkill.classList.add(category);
        newSkill.classList.add(STATES[1]);
        //newSkill.classList.add("skill cs removable");
        newSkill.appendChild(dot);
        newSkill.appendChild(skillName);
        const skillContainer = document.querySelector(LISTS[1]);/*"#skills" is the top list*/
        skillContainer.appendChild(newSkill);
        newSkill.addEventListener("click", () => {
            transferSkill(1, skill, category);
        });
    }
    function transferSkill(from, skill, category) {
        // Add to top list
        const newSkill = document.createElement("div");
        const dot = document.createElement('p');
        const skillName = document.createElement('p');
        dot.classList.add("skillicon");
        dot.textContent = "•";
        skillName.classList.add("skillname");
        skillName.textContent = skill;
        newSkill.classList.add("skill");
        newSkill.classList.add(category);
        newSkill.classList.add(STATES[1 - from]);
        //newSkill.classList.add("skill cs removable");
        newSkill.appendChild(dot);
        newSkill.appendChild(skillName);
        const skillContainer = document.querySelector(LISTS[1 - from]);/*"#skills" is the top list*/
        skillContainer.appendChild(newSkill);
        newSkill.addEventListener("click", () => {
            transferSkill(1 - from, skill, category);
        });
        // Remove from bottom list
        const addableSkills = document.querySelector(LISTS[from]);/*"#addskills" is the bottom list*/
        const skillArray = addableSkills.querySelectorAll(".skill");
        for (let i = 0; i < skillArray.length; ++i) {
            let div = skillArray.item(i);
            if (div.querySelector(".skillname").textContent === skill) { // Remove
                addableSkills.removeChild(div);
                break;
            }
        }
    }
    createSkill("Python", "cs");
    createSkill("C++", "cs");
    createSkill("Java", "cs");
    createSkill("Business Stuff", "business");
    createSkill("Accounting", "business");
})