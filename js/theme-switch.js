// document.addEventListener('DOMContentLoaded', init, false);
// function init(){

    // console.log('Content loaded');

    // const mql = window.matchMedia('(prefers-color-scheme: dark)');

    // function theme (query) {
    //     const userOption = localStorage.getItem('t');

    //     document.body.id = userOption === null
    //         ? (query.matches ? 'dark' : '')
    //         : (userOption === 'd' ? 'dark' : '');
    // }

    // function toggleT (to) {
    //     localStorage.setItem('t', to);
    //     theme(mql);
    //     // console.log('Clicked! ' + to);
    // }

    // // document.getElementById('dark-switch').classList.add('TESTING');

    // document.getElementById('dark-switch').addEventListener('click', toggleT("d"));
    // document.getElementById('light-switch').addEventListener('click', toggleT("l"));

    // mql.addListener(theme);
    // theme(mql);

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

const themeSwitches = document.querySelectorAll('[data-color-theme-toggle]');

function removeColorThemeLocalStorage() {
    localStorage.removeItem('color-theme');
}

function saveColorTheme(colorTheme) {
    if (colorTheme === 'system') {
        removeColorThemeLocalStorage();
        return;
    }
    localStorage.setItem('color-theme', colorTheme);
}

function applyColorTheme() {
    const localStorageColorTheme = localStorage.getItem('color-theme');
    const colorTheme = localStorageColorTheme || null;
    if (colorTheme) {
        document.documentElement.setAttribute('data-color-theme', colorTheme);
    }
}

function themeSwitchHandler() {
    themeSwitches.forEach(themeSwitch => {
        const el = themeSwitch;
        if (el.value === localStorage.getItem('color-theme')) {
            el.checked = true;
        }

        el.addEventListener('change', () => {
            if (el.value !== 'system') {
                saveColorTheme(el.value);
                applyColorTheme(el.value);
            } else {
                removeColorThemeLocalStorage();
                document.documentElement.removeAttribute('data-color-theme');
            }
        });
    });
    applyColorTheme();
}
document.addEventListener('DOMContentLoaded', () => {
    themeSwitchHandler();
    applyColorTheme();
});
