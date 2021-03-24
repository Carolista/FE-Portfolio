


// Event listener for page load
window.addEventListener("load", function() {
    console.log('Page loaded.');
    init();
});

// DOM code for page elements
function init() {


    /** TAB TITLE **/

    // Tack on to end of <title> content specified in html doc
    document.title += " Caroline Jones | Front End Developer";


    /** STYLE SHEETS & FONTS **/

    const head = document.querySelector("head");
    head.innerHTML += `
        <link rel="stylesheet" type="text/css" href="styles.css">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Oleo+Script+Swash+Caps&family=Barlow:wght@200;400;600;800&display=swap" rel="stylesheet">
    `


    /** HEADER & FOOTER **/

    let page = location.href.split('\\').pop().split('/').pop();
    if (page.length > 1) { // if anything other than index.html
        const header = document.querySelector("header");
        header.innerHTML = `
            <nav class="nav-container">
                <p id="navbar-name"><a class="inverted" href="/">Caroline R. Jones</a></p>
                <button type="button" class="nav-button" aria-label="Open dropdown nav">
                    <span class="tri-bar"></span>
                    <span class="tri-bar"></span>
                    <span class="tri-bar"></span>
                </button>
                <div class="nav-menu">
                    <ul class="nav-links">
                        <li class="nav-item"><a class="nav-link" id="projects" href="/projects.html">Projects</a></li>
                        <li class="nav-item"><a class="nav-link" id="experience" href="/experience.html">Experience</a></li>
                        <li class="nav-item"><a class="nav-link" id="education" href="/education.html">Education</a></li>
                        <li class="nav-item"><a class="nav-link" id="skills" href="/skills.html">Skills</a></li>
                        <li class="nav-item"><a class="nav-link" id="recommendations" href="/recommendations.html">Recommendations</a></li>
                        <li class="nav-item"><a class="nav-link" id="contact" href="/contact.html">Contact</a></li>
                    </ul>
                </div>
            </nav>
        `;

        const footer = document.querySelector("footer");
        footer.innerHTML = `
            <span class="off-white-text text-center">
                <p>&copy; 2021&nbsp; Caroline R. Jones &nbsp;&bull;&nbsp;
                    St. Louis, MO</p>
                <p><a class="inverted" href="https://www.linkedin.com/in/carolinerjones/" target="_blank">LinkedIn</a> &nbsp;|&nbsp; 
                    <a class="inverted" href="https://www.hackerrank.com/Carolina49a" target="_blank">HackerRank</a> &nbsp;|&nbsp; 
                    <a class="inverted" href="https://github.com/Carolista" target="_blank">GitHub</a></p>
            </span>
        `;  

        /** NAV BAR **/

        const navbar = document.getElementById("navbar");
        const navButton = navbar.querySelector(".nav-button");
        const allNavLinks = document.getElementsByClassName("nav-link");

        function openDropdown() {
            navbar.classList.add("opened");
            navButton.setAttribute("aria-label", "Close dropdown nav");
        }

        function closeDropdown() {
            navbar.classList.remove("opened");
            navButton.setAttribute("aria-label", "Open dropdown nav");
        }

        navButton.addEventListener("click", () => {
            if (navbar.classList.contains("opened")) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        const navMenu = navbar.querySelector(".nav-menu");
        const navLinksContainer = navbar.querySelector(".nav-links");

        navLinksContainer.addEventListener("click", (clickEvent) => {
            clickEvent.stopPropagation();
        });

        navMenu.addEventListener("click", closeDropdown);

        // set background for nav link of current page
        for (let i=0; i < allNavLinks.length; i++) {
            if (page.includes(allNavLinks[i].id)) {
                allNavLinks[i].style.backgroundColor = "#671414";
            } else {
                allNavLinks[i].style.backgroundColor = "#320d21";
            }
        }

        // temporarily change bkg of nav links when hovered over
        document.addEventListener("mouseover", function(event) {
            if (event.target.matches(".nav-link")) {
                event.target.style.backgroundColor = "#a42d19";
            } 
        });
        document.addEventListener("mouseout", function(event) {
            if (event.target.matches(".nav-link")) {
                if (page.includes(event.target.id)) {
                    event.target.style.backgroundColor = "#671414";
                } else {
                    event.target.style.backgroundColor = "#320d21";
                }
                
            } 
        });
    }   

    /** MAIN **/

    /*
        Everything below controls the contents with the <main> element of each page, but data from JSON will only load for the matching page.
    */

    // Arrays to hold any data loaded
    let projectData = [];
    let experienceData = [];
    let educationData = [];
    let skillsData = {
        generalKnowledge: [],
        generalStrengths: [],
        generalTools: [],
        generalValues: [],
        techFrameworks: [],
        techKnowledge: [],
        techLanguages: [],
        techTools: []
    };
    let recommendationData = [];
    
    // DOM elements for each page where content should be displayed
    const projectArea = document.querySelector("#project-area");
    const detailArea = document.querySelector("#detail-area");
    const expArea = document.querySelector("#exp-area");
    const edArea = document.querySelector("#ed-area");
    const techSkillsArea = document.querySelector("#tech-skills-area");
    const generalSkillsArea = document.querySelector("#general-skills-area");
    const recArea = document.querySelector("#rec-area");

    // Determine which data should be loaded, if any
    function loadAndDisplayData() {
        if (document.title.toLowerCase().includes("project")) { // for both gallery & detail pages
            loadProjects();
        } else if (document.title.toLowerCase().includes("experience")) {
            loadExperience();
        } else if (document.title.toLowerCase().includes("education")) {
            loadEducation();
        } else if (document.title.toLowerCase().includes("skills")) {
            loadSkills();
        } else if (document.title.toLowerCase().includes("recommendations")) {
            loadRecommendations();
        }
    }

    // For Projects page
    function loadProjects() {
        fetch('/data/projects.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(obj => {
                    let project = {
                        id: obj.id,
                        title: obj.title,
                        subtitle: obj.subtitle,
                        desc: obj.desc,
                        tech: obj.tech,
                        noteworthy: obj.noteworthy,
                        demo: { type: obj.demo.type, url: obj.demo.url},
                        code: { type: obj.code.type, url: obj.code.url},
                        images: obj.images,
                        inProgress: obj.inProgress
                    }
                    projectData.push(project);
                });     
        });
        // Determine which information to display (full gallery or detail)
        if (document.title.toLowerCase().includes("projects")) {
            displayProjects();
        } else {
            displayProjectDetail();
        }
        
    }

    function displayProjects() {
        setTimeout(function() {
            for (let i=0; i < projectData.length; i++) {
                // TODO: add second responsive gallery of all projects still in progress
                if (! projectData[i].inProgress) {
                    projectArea.innerHTML += `
                            <div class="gallery-item">
                                <div class="project-content">
                                    <a href="project-details.html?id=${projectData[i].id}"><img class="project-image" src="images/${projectData[i].images[0].fileName}"></a>
                                    <h3>${projectData[i].title}</h3>
                                    <p>${projectData[i].subtitle}</p>
                                    <p class="text-right view-details"><a href="project-details.html?id=${projectData[i].id}" target="_blank">View Details &gt;</a></p>
                                </div>
                            </div>
                    `;
                }
            }
        }, 200); // only needs a slight delay
    }

    function displayProjectDetail() {
        setTimeout(function() {
            // Get query parameter to get id number (index)
            let param = new URLSearchParams(window.location.search);
            let projectId = param.get('id');
            let projectIndex;
            //Get index from array based on project id
            for (let j=0; j < projectData.length; j++) {
                if (projectData[j].id === Number(projectId)) {
                    projectIndex = j;
                }
            }

            let currentProject = projectData[projectIndex];
            
            // Update browser tab with specific project name
            document.title = currentProject.title + " - " + document.title;

            // Create bullet points from noteworthy array
            let bullets = "";
            for (let i=0; i<currentProject.noteworthy.length; i++) {
                bullets += `
                    <li>${currentProject.noteworthy[i]}</li>
                `
            }
            // Create links
            let links = "";
            if (currentProject.demo.url !== "") {
                links += `<b>Demo:</b> <a href="${currentProject.demo.url}" target="_blank">${currentProject.demo.type}</a>`;
            }
            if (currentProject.demo.url !== "" && currentProject.code.url !== "") {
                links += ` &nbsp;&#124;&nbsp; `;
            }
            if (currentProject.code.url !== "") {
                links += `<b>Code:</b> <a href="${currentProject.code.url}" target="_blank">${currentProject.code.type}</a>`;
            }
            // Create images
            let images = "";
            for (let i=0; i<currentProject.images.length; i++) {
                // TODO: add CSS for hover behavior
                // TODO: create popup slideshow of images
                images += `
                    <a href="images/${currentProject.images[i]}"><img class="project-detail-image" src="images/${currentProject.images[i]}" /></a>
                `
            }
            // Assemble all HTML for project details
            // TODO: add translucent white block behind this content similar to other pages
            detailArea.innerHTML = `
                <div class="project-details-container">
                    <h1 class="project-title" class="page-title">${currentProject.title}</h1>
                    <h3 class="project-subtitle">${currentProject.subtitle}</h3>
                    <div class="details-container">
                        <p>${currentProject.desc}</p>
                        <h4 class="project-section">Tech Stack</h4>
                        <p>${currentProject.tech}</p>
                        <h4 class="project-section">Noteworthy</h4>
                        <ul>${bullets}</ul>
                        <p class="project-links">${links}</p>
                    </div>
                    <p><a href='projects.html'>&lt; Back to Projects Gallery</a></p>
                </div>
                <div class="project-images-container">
                ${images}
                </div>
            `
        }, 200); // only needs a slight delay
    }

    // For Experience page
    function loadExperience() {
        fetch('/data/experience.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(obj => {
                    let job = {
                        id: obj.id,
                        employer: obj.employer,
                        period: obj.period,
                        title: obj.title,
                        type: obj.type,
                        location: obj.location,
                        desc: obj.desc,
                        image: obj.image,
                        website: obj.website
                    }
                    experienceData.push(job);
                });     
        });
        displayExperience();
    }

    function displayExperience() {
        setTimeout(function() {
            for (let i=0; i < experienceData.length; i++) {
                expArea.innerHTML += `
                    <div class="content-item">
                        <div class="content-block"> 
                            <div>  
                                <a href="${experienceData[i].website}" target="_blank"><img class="job-ed-logo" src="images/${experienceData[i].image}" /></a>                      
                                <p><span class="employer">${experienceData[i].employer}</span><br />
                                ${experienceData[i].type} &nbsp;&bull;&nbsp; ${experienceData[i].location} &nbsp;&bull;&nbsp; ${experienceData[i].period}</p>
                            </div>
                            <p class="job-title">${experienceData[i].title}</p>
                            <p>${experienceData[i].desc}</p>
                        </div>
                    </div>
                `;
            }
        }, 200); // only needs a slight delay
    }

    // For Education page
    function loadEducation() {
        fetch('/data/education.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(obj => {
                    let ed = {
                        id: obj.id,
                        institution: obj.institution,
                        gradDate: obj.gradDate,
                        degree: obj.degree,
                        desc: obj.desc,
                        image: obj.image,
                        website: obj.website
                    }
                    educationData.push(ed);
                });     
        });
        displayEducation();
    }

    function displayEducation() {
        setTimeout(function() {
            for (let i=0; i < educationData.length; i++) {
                // TODO: gather images of certificates/degrees
                edArea.innerHTML += `
                <div class="content-item">
                    <div class="content-block">
                        <div>
                            <a href="${educationData[i].website}" target="_blank"><img class="job-ed-logo" src="images/${educationData[i].image}" /></a>                      
                            <p><span class="institution">${educationData[i].institution}</span><br />
                            ${educationData[i].gradDate}</p>    
                        </div>
                        <p class="degree">${educationData[i].degree}</p>
                        <p>${educationData[i].desc}</p>
                    </div>
                </div>
                `;
            }
        }, 200); // only needs a slight delay
    }

    // For Skills page
    function loadSkills() {
        fetch('/data/skills.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(obj => {
                    let skill = {
                        id: obj.id,
                        skillName: obj.skillName,
                        category: obj.category,
                        type: obj.type
                    }
                    if (skill.type === "General") {
                        if (skill.category === "Knowledge") {
                            skillsData.generalKnowledge.push(skill);
                        } else if (skill.category === "Strengths") {
                            skillsData.generalStrengths.push(skill);
                        } else if (skill.category === "Tools") {
                            skillsData.generalTools.push(skill);
                        } else if (skill.category === "Values") {
                            skillsData.generalValues.push(skill);
                        }
                    } else { // Tech
                        if (skill.category === "Frameworks") {
                            skillsData.techFrameworks.push(skill);
                        } else if (skill.category === "Knowledge") {
                            skillsData.techKnowledge.push(skill); 
                        } else if (skill.category === "Languages") {
                            skillsData.techLanguages.push(skill);
                        } else if (skill.category === "Tools") {
                            skillsData.techTools.push(skill);
                        }
                    }
                });     
        });
        buildSkillsHTML();
        displaySkills();
    }

    // Data structures to hold everything needed to display lists on Skills page
    let techSkillsCategories = {
        tools: { category: "Tools", list: "", count: 0 },
        frameworks: { category: "Frameworks", list: "", count: 0 },
        languages: { category: "Languages", list: "", count: 0 },
        knowledge: { category: "Knowledge", list: "", count: 0 }
    }
    let generalSkillsCategories = {
        tools: { category: "Tools", list: "", count: 0 },
        strengths: { category: "Strengths", list: "", count: 0 },
        knowledge: { category: "Knowledge", list: "", count: 0 },
        values: { category: "Values", list: "", count: 0 }
    }

    function buildSkillsHTML() {
        setTimeout(function() {
            for (group in skillsData) {
                skillsData[group].sort((a, b) => a.skillName > b.skillName ? 1 : -1);
                for (let i=0; i < skillsData[group].length; i++) {
                    if (skillsData[group][i].type === "Tech") {
                        if (skillsData[group][i].category === "Frameworks") {
                            techSkillsCategories.frameworks.list += `<p class='skill-name'>${skillsData[group][i].skillName}</p>`;
                            techSkillsCategories.frameworks.count += 1;
                        } else if (skillsData[group][i].category === "Languages") {
                            techSkillsCategories.languages.list += `<p class='skill-name'>${skillsData[group][i].skillName}</p>`;
                            techSkillsCategories.languages.count += 1;
                        } else if (skillsData[group][i].category === "Tools") {
                            techSkillsCategories.tools.list += `<p class='skill-name'>${skillsData[group][i].skillName}</p>`;
                            techSkillsCategories.tools.count += 1;
                        } else if (skillsData[group][i].category === "Knowledge") {
                            techSkillsCategories.knowledge.list += `<p class='skill-name'>${skillsData[group][i].skillName}</p>`;
                            techSkillsCategories.knowledge.count += 1;
                        }
                    } else if (skillsData[group][i].type === "General") {
                        if (skillsData[group][i].category === "Tools") {
                            generalSkillsCategories.tools.list += `<p class='skill-name'>${skillsData[group][i].skillName}</p>`;
                            generalSkillsCategories.tools.count += 1;
                        } else if (skillsData[group][i].category === "Strengths") {
                            generalSkillsCategories.strengths.list += `<p class='skill-name'>${skillsData[group][i].skillName}</p>`;
                            generalSkillsCategories.strengths.count += 1;
                        } else if (skillsData[group][i].category === "Knowledge") {
                            generalSkillsCategories.knowledge.list += `<p class='skill-name'>${skillsData[group][i].skillName}</p>`;
                            generalSkillsCategories.knowledge.count += 1;
                        } else if (skillsData[group][i].category === "Values") {
                            generalSkillsCategories.values.list += `<p class='skill-name'>${skillsData[group][i].skillName}</p>`;
                            generalSkillsCategories.values.count += 1;
                        }
                    }
                }
            }
        }, 200); // only needs a slight delay
    }

    function displaySkills() {
        setTimeout(function() {
            // Tech subsection
            let allTechSkills = "";
            for (techCategory in techSkillsCategories) {
                allTechSkills += `
                    <div class="content-block skills-list">
                        <h3>${techSkillsCategories[techCategory].category}</h3>
                        <div>${techSkillsCategories[techCategory].list}</div> 
                    </div>
                `
            }
            techSkillsArea.innerHTML = allTechSkills;
            // General subsection
            let allGeneralSkills = "";
            for (generalCategory in generalSkillsCategories) {
                allGeneralSkills += `
                    <div class="content-block skills-list">
                        <h3>${generalSkillsCategories[generalCategory].category}</h3>
                        <div>${generalSkillsCategories[generalCategory].list}</div> 
                    </div>
                `
            }
            generalSkillsArea.innerHTML = allGeneralSkills;

        }, 200); // only needs a slight delay
    }

    // For Recommendations page
    function loadRecommendations() {
        fetch('/data/recommendations.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(obj => {
                    let rec = {
                        id: obj.id,
                        author: obj.author,
                        relationship: obj.relationship,
                        recText: obj.recText
                    }
                    recommendationData.push(rec);
                });     
        });
        displayRecommendations();
    }

    function displayRecommendations() {
        setTimeout(function() {
            for (let i=0; i < recommendationData.length; i++) {
                recArea.innerHTML += `
                    <div class="content-item">
                        <div class="content-block">
                            <p>${recommendationData[i].recText}</p>
                            <p class="text-right"><span class="rec-name">${recommendationData[i].author}</span><br />
                            <span class="rec-role">${recommendationData[i].relationship}</span></p>
                        </div>
                    </div>
                `;
            }
        }, 200); // only needs a slight delay
    }

    // Call function to utilize any required code above
    loadAndDisplayData();
    


}