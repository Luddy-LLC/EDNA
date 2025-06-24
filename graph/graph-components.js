import { GraphAPI } from './graph-api.js';
const graph = new GraphAPI();

// document.querySelectorAll([msgraph]).forEach((el) => {
// });

document.querySelectorAll('[msgraph][graphrsc="users"][graphendp="photo"][graphvalue]').forEach(async (el) => {
    const user = el.getAttribute('graphvalue');
    
    if (user === "me") {
        const photoUrl = await graph.myPhoto();
        el.src = photoUrl;

    } else {
        const photoUrl = await graph.userPhoto(user);
        el.src = photoUrl;
    }
});