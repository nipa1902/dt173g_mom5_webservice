"use strict"

// Loading courses
let outputEl = document.getElementById("courseoutput");
window.addEventListener('load', getCourses);

// Adding courses
let createButton = document.getElementById("createButton");
createButton.addEventListener('click', addCourse);

let codeInput = document.getElementById("courseCode");
let nameInput = document.getElementById("courseName");
let progressionInput = document.getElementById("courseProgression");
let courseplanInput = document.getElementById("courseplan");


// Read courses via fetch
function getCourses() {

    // Wipe anything in the output
    outputEl.innerHTML = "";

    fetch('http://studenter.miun.se/~nipa1902/writeable/dt173g/moment5_api/courses.php')
    .then(res => res.json())

    .then(data => {
        data.forEach(course => {

            // Store object properties as variables
            let a = course.code.toUpperCase();
            let b = course.name;
            let c = course.progression;
            let d = "<a href='" + course.courseplan + "' title='Kursplan för " + a +  " 'target='_blank''>Kursplan</a>"

            // Store html string
            let spanopen = "<span>";
            let spanclose = "</span>";
            
            // Make divs and set class, append to output element
            let p = document.createElement("div");
            p.setAttribute('class', "grid-item");
            outputEl.appendChild(p);
            
            //Print spans inside grid
            p.innerHTML =   spanopen + a + spanclose +
                            spanopen + b + spanclose +
                            spanopen + c + spanclose +
                            spanopen + d + spanclose + 

                            // Trying the other way of printing properties and adding delete function
                            spanopen + `<button id="${course.id}" onClick="deleteCourse(${course.id})">Radera</button>` + spanclose;
        })
    })
    
};

function deleteCourse(id) {
    fetch('http://studenter.miun.se/~nipa1902/writeable/dt173g/moment5_api/courses.php?id=' + id, {
        method: 'DELETE',
    })

    .then(res => res.json())
    .then(data => {
        getCourses();
    })
    .catch(error => {
        console.log("Error deleting course: ", error);
    })
}

function addCourse() {

    let code = codeInput.value;
    let name = nameInput.value;
    let progression = progressionInput.value;
    let courseplan = courseplanInput.value;

    // Create the new course through inputs
    let newCourse = {'code': code, 'name': name, 'progression': progression, 'courseplan': courseplan};

    // Send it by POST as a string
    fetch('http://studenter.miun.se/~nipa1902/writeable/dt173g/moment5_api/courses.php', {
        method: 'POST',
        body: JSON.stringify(newCourse)
    })

    .then(res => res.json()) 
    .then(data => {
        getCourses();
    })
    .catch(error => {
        console.group("Error creating course: ", error);
    })

    
}


