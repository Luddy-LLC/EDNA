import { GraphAPI } from './auth/ms-auth.js';
const graph = new GraphAPI();

// document.querySelectorAll([msgraph]).forEach((el) => {
// });

document.querySelectorAll('[msgraph][graphrsc="users"][graphendp="photo"][graphvalue]').forEach(async (el) => {
    const user = el.getAttribute('graphvalue');
    if (user === "me") {
        el.src = await graph.myPhoto();
    } else {
        el.src = await graph.userPhoto(user);
    }
});