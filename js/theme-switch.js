// document.addEventListener('DOMContentLoaded', init, false);
// function init(){

    const mql=window.matchMedia('(prefers-color-scheme: dark)');
    function toggleT(){
        var value = this.id;
        if(value == 's') {
            localStorage.removeItem('t');
        } else {
            localStorage.setItem('t', value);
        }
        theme(mql);
        // console.log('ToggleT: ' + value);
    }
    function theme(query){
        const userOption=localStorage.getItem('t');
        document.body.id=userOption===null?(query.matches?'dark':''):(userOption==='d'?'dark':'');
    }
    mql.addListener(theme);
    theme(mql);

    // document.getElementById('dark').classList.add('TESTING');

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('s').addEventListener('click', toggleT, false);
        document.getElementById('d').addEventListener('click', toggleT, false);
        document.getElementById('l').addEventListener('click', toggleT, false);
    });

    //////////////////////////////////////////////////////////////////////////////////////

    // const toggleSwitch = document.getElementById('theme-switch-checkbox');
    // const currentTheme = localStorage.getItem('theme');

    // if (currentTheme) {
    //     document.documentElement.setAttribute('data-theme', currentTheme);

    //     if (currentTheme === 'dark') {
    //         toggleSwitch.checked = true;
    //     }
    // }

    // function switchTheme(e) {
    //     if (e.target.checked) {
    //         document.documentElement.setAttribute('data-theme', 'dark');
    //         localStorage.setItem('theme', 'dark');
    //     }
    //     else {
    //         document.documentElement.setAttribute('data-theme', 'light');
    //         localStorage.setItem('theme', 'light');
    //     }
    // }

    // toggleSwitch.addEventListener('change', switchTheme, false);

    ///////////////////////////////////////////////////////////////////////////////////////

// const themeSwitches = document.querySelectorAll('[data-color-theme-toggle]');

// function removeColorThemeLocalStorage() {
//     localStorage.removeItem('color-theme');
// }

// function saveColorTheme(colorTheme) {
//     if (colorTheme === 'system') {
//         removeColorThemeLocalStorage();
//         return;
//     }
//     localStorage.setItem('color-theme', colorTheme);
// }

// function applyColorTheme() {
//     const localStorageColorTheme = localStorage.getItem('color-theme');
//     const colorTheme = localStorageColorTheme || null;
//     if (colorTheme) {
//         document.documentElement.setAttribute('data-color-theme', colorTheme);
//     }
// }

// function themeSwitchHandler() {
//     themeSwitches.forEach(themeSwitch => {
//         const el = themeSwitch;
//         if (el.value === localStorage.getItem('color-theme')) {
//             el.checked = true;
//         }

//         el.addEventListener('change', () => {
//             if (el.value !== 'system') {
//                 saveColorTheme(el.value);
//                 applyColorTheme(el.value);
//             } else {
//                 removeColorThemeLocalStorage();
//                 document.documentElement.removeAttribute('data-color-theme');
//             }
//         });
//     });
//     applyColorTheme();
// }
// document.addEventListener('DOMContentLoaded', () => {
//     themeSwitchHandler();
//     applyColorTheme();
// });

/////////////////////////////////////////////////////////////////////////////////////////

// this checks whether system dark mode is set
// let systemInitiatedDark = window.matchMedia("(prefers-color-scheme: dark)");
// // this checks for session storage telling to override
// // the system preferences
// let theme = sessionStorage.getItem('theme');

// if (systemInitiatedDark.matches) {
// 	document.getElementById("theme-toggle").innerHTML = "Light Mode";
// } else {
// 	document.getElementById("theme-toggle").innerHTML = "Dark Mode";
// }

// function prefersColorTest(systemInitiatedDark) {
//     if (systemInitiatedDark.matches) {
//         document.documentElement.setAttribute('data-theme', 'dark');
//         document.getElementById("theme-toggle").innerHTML = "Light Mode";
//         // this clears the session storage
//         sessionStorage.setItem('theme', '');
//     } else {
//         document.documentElement.setAttribute('data-theme', 'light');
//         document.getElementById("theme-toggle").innerHTML = "Dark Mode";
//         sessionStorage.setItem('theme', '');
//     }
// }
// systemInitiatedDark.addListener(prefersColorTest);

// function modeSwitcher() {
//     // it's important to check for overrides again
//     let theme = sessionStorage.getItem('theme');
//     // checks if reader selected dark mode
//     if (theme === "dark") {
//         document.documentElement.setAttribute('data-theme', 'light');
//         sessionStorage.setItem('theme', 'light');
//         document.getElementById("theme-toggle").innerHTML = "Dark Mode";
//     // checks if reader selected light mode
//     }	else if (theme === "light") {
//         document.documentElement.setAttribute('data-theme', 'dark');
//         sessionStorage.setItem('theme', 'dark');
//         document.getElementById("theme-toggle").innerHTML = "Light Mode";
//     // checks if system set dark mode
//     } else if (systemInitiatedDark.matches) {
//         document.documentElement.setAttribute('data-theme', 'light');
//         sessionStorage.setItem('theme', 'light');
//         document.getElementById("theme-toggle").innerHTML = "Dark Mode";
//     // the only option left is system set light mode
//     } else {
//         document.documentElement.setAttribute('data-theme', 'dark');
//         sessionStorage.setItem('theme', 'dark');
//         document.getElementById("theme-toggle").innerHTML = "Light Mode";
//     }
// }

// document.getElementById('theme-toggle').addEventListener('click', modeSwitcher, false);
