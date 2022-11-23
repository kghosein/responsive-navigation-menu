const { toggleIcon, menu } = require('./modules/nav');

toggleIcon();
menu();

//apply margin top to main content based on header height
let headerElement = document.querySelector('.navigation-menu');
function outputSize() {
    // const headerWidth = headerElement.offsetWidth;
    const headerHeight = headerElement.offsetHeight;
    // console.log(headerWidth, headerHeight);
    document.querySelector('main').style.marginTop = `${headerHeight}px`;
}
outputSize();

new ResizeObserver(outputSize).observe(headerElement);

// year in footer
const currentYear = new Date();
document.getElementById("currentYear").innerHTML = currentYear.getFullYear();