document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(link => {
    link.addEventListener("mouseenter", function () {
      this.style.opacity = "0.7";
    });

    link.addEventListener("mouseleave", function () {
      this.style.opacity = "1";
    });
  });
});

$(document).ready(function () {

    console.log("jQuery loaded successfully");

    $("#toggleCourses").click(function () {

        console.log("Toggle button clicked");

        $("#courseList").slideToggle();

    });

});

document.addEventListener("DOMContentLoaded", function () {

    const currentPath = window.location.pathname;

    document.querySelectorAll(".navbar a").forEach(link => {

        if (link.getAttribute("href") === currentPath) {

            link.classList.add("active-link");

        }

    });

});