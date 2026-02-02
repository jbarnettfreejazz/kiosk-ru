const routes = {
    "/": "./index.html",
    "/english": "./page2min.html",
    "/russian": "/page3test.html"
};

function router() {
    const path = window.location.pathname;
    const page = routes[path] || "home.html";

    fetch(page)
        .then(response => response.text())
        .then(html => {
            document.getElementById("root").innerHTML = html;

            // TRIGGER VIDEO AUTOPLAY HERE - after content is loaded
            if (path === "/english" || path === "/russian") {
                const video = document.getElementById("myVideo");
                if (video) {
                    console.log("Found video, attempting autoplay");
                    setTimeout(() => {
                        video.play().catch(err => {
                            console.log("Autoplay failed:", err);
                        });
                    }, 1500);
                }
            }
        })
        .catch(err => console.error("Routing error:", err));
}

// Handle navigation
window.addEventListener("popstate", router);

// Navigate function
function navigate(path) {
    window.history.pushState({}, "", path);
    router();
}

// Initialize
document.addEventListener("DOMContentLoaded", router);