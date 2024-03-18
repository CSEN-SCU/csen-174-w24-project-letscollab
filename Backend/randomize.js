const fs = require('fs')

//randomize the project CreatedAt field for all projects to a random date in epoch time (ms) in the last 10 days
async function randomizeCreatedAt(){
    let projects = {}
    await fs.readFile('./projectstest.json', (err, data) => {
        if (err) throw err;
        projects = JSON.parse(data);
        let keys = Object.keys(projects);
        keys.forEach(key => {
            let project = projects[key];
            project.CreatedAt = randomDate();
            project.Meetup.Time = randomMeetingDate();
            console.log(`Project ${key} created at: ${timeSince(project.CreatedAt)} and meeting time: ${timeSince(project.Meetup.Time)} `)
            projects[key] = project;
        });
        fs.writeFile('./projectstest1.json', JSON.stringify(projects, null, 4), (err) => {
            if (err) throw err;
            console.log('Projects have been randomized');
        });
    })
    

}

let randomDate = () => {
    let date = new Date();
    date.setDate(date.getDate() - (Math.random() * 10));
    return date.getTime();
}
//Setting the meeting time for all projects to a random date in the next 10 days
let randomMeetingDate = () => {
    let currentDate = new Date();
    let minDate = new Date(currentDate.getTime() + (5 * 24 * 60 * 60 * 1000)); // 5 days from now
    let maxDate = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now
    let randomTime = Math.random() * (maxDate.getTime() - minDate.getTime()) + minDate.getTime();
    return Math.floor(randomTime/1000);
}
// Setting the meeting time for all projects to a random date in the next 10 days
// Function to calculate the time since a given date
const timeSince = (date) => {
    const seconds = Math.floor((new Date() - date));
    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        return `${interval} year${interval === 1 ? '' : 's'} ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return `${interval} month${interval === 1 ? '' : 's'} ago`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return `${interval} day${interval === 1 ? '' : 's'} ago`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    }
    return `${Math.floor(seconds)} second${seconds === 1 ? '' : 's'} ago`;
};


randomizeCreatedAt();