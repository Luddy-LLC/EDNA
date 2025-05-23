import { GraphAPI } from './auth/graph-api.js';
const graph = new GraphAPI();

// document.querySelectorAll([msgraph]).forEach((el) => {
// });

document.querySelectorAll('[msgraph][graphrsc="users"][graphendp="photo"][graphvalue]').forEach(async (el) => {
    const user = el.getAttribute('graphvalue');
    console.log(user);
    if (user === "me") {
        console.log('there me!')
         const photoUrl = await graph.myPhoto();
         el.src = photoUrl;
        console.log(photoUrl);
    } else {
        const photoUrl = await graph.userPhoto(user);
        el.src = photoUrl;
        console.log(photoUrl);
    }
});