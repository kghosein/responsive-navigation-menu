exports.toggleIcon = () => {
    document.querySelector('#check-open').addEventListener('click', () => {
        document.querySelector('.navigation').classList.toggle('open-nav');
    });
};

exports.menu = () => {
    const getMenu = document.querySelector('.menu').children; // get main menu (li)

    // get main menu (li) html elements
    for (i = 0; i < getMenu.length; i++) {

        // don't apply event listener to elements (li) which has a dropdown in main menu
        if (getMenu[i].className == 'has-dropdown') {
            const getDropdown = getMenu[i].children; // get dropdown (li) elements
            // console.log(getDropdown);

            for (j = 0; j < getDropdown.length; j++) {
                // console.log(getDropdown[j]);
                // get ul.dropdown html elements
                if (getDropdown[j].classList == 'dropdown-menu') {
                    // console.log(getDropdown[j])

                    const getDropdownLi = getDropdown[j].children // get ul.dropdown (li) elements
                    // console.log(getDropdownLi);

                    // get (li) html elements
                    for (k = 0; k < getDropdownLi.length; k++) {
                        // console.log(getDropdownLi[k]);

                        // don't apply event listener to elements (li) which has a dropdown
                        if (getDropdownLi[k].className == 'has-dropdown') {
                            // console.log(getDropdownLi[k]);

                            // get ul.side-drop-menu
                            const getSideDrop = getDropdownLi[k].children;
                            // console.log(getSideDrop);
                            // get ul.side-drop-menu html elements
                            for (l = 0; l < getSideDrop.length; l++) {
                                // console.log(getSideDrop[l]);
                                if (getSideDrop[l].classList == 'side-drop-menu') {
                                    // console.log(getSideDrop[l]);

                                    // get ul.side-drop-menu (li) elements
                                    const getSideDropLi = getSideDrop[l].children;
                                    // console.log(getSideDropLi);
                                    // get ul.side-drop-menu (li) html elements
                                    for (m = 0; m < getSideDropLi.length; m++) {
                                        // console.log(getSideDropLi[m]);

                                        // reached end here, apply event listener to all (li) elements; repeat process if there are more nested dropdowns
                                        getSideDropLi[m].addEventListener('click', () => {
                                            document.querySelector('.navigation').classList.toggle('open-nav');
                                            document.querySelector('#check-open').checked = false;
                                        });
                                    }
                                    // reached end here, apply event listener to all (li) elements; if there are more dropdown menus, repeat process

                                }
                            }
                        } else { // apply event listener
                            getDropdownLi[k].addEventListener('click', () => {
                                document.querySelector('.navigation').classList.toggle('open-nav');
                                document.querySelector('#check-open').checked = false;
                            });
                        }
                    }
                }
            } // else apply event listener to main menu (li)
        } else {
            getMenu[i].addEventListener('click', () => {
                document.querySelector('.navigation').classList.toggle('open-nav');
                document.querySelector('#check-open').checked = false;
            });
        }
    }
};