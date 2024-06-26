const fetchAndDisplayPosts = async () => {
    const response = await fetch("http://localhost:8000/api/posts?page=1");
    const postList = await response.json();
    const postListElement = document.getElementById("post-list");
    postListElement.innerHTML = "";

    postList.forEach((post) => {
        const paraElement1 = document.createElement("div");
        paraElement1.innerHTML = post.question;

        const paraElement2 = document.createElement("div");
        paraElement2.innerHTML = post.Date;

        const postElement = document.createElement("div");
        postElement.appendChild(paraElement1);
        postElement.appendChild(paraElement2);

        postListElement.appendChild(postElement);
    });
};
document.addEventListener("DOMContentLoaded", fetchAndDisplayPosts);