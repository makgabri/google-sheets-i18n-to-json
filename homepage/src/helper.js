/**
 * Navigates to a link
 * - home: Homepage
 * - docs: Getting-Started
 * - privacy-policy: Privacy Policy
 * - git: Git repo of project
 * - gabrian-git: Creator's github
 * @param {'home'|'docs'|'git'|'gabrian-git'|privacy-policy} location 
 */
export const navigateTo = (location) => {
    switch (location) {
        case "home":
            window.location.href = '/';
            break;

        case "docs":
            window.location.href = '/getting-started';
            break;

        case "git":
            window.location.href = 'https://github.com/makgabri/google-sheets-i18n-to-json'; 
            break;
        
        case "gabrian-git":
            window.location.href = 'https://github.com/makgabri';
            break;
        
        case "privacy-policy":
            window.location.href = '/privacy-policy';
            break;
    
        default:
            window.location.href = '/';
            break;
    }
}