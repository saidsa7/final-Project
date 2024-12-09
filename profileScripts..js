setupUi();

function profileClicked(event) {
  user = getCurrentUser();
  if (user != null) {
    event.preventDefault();
    document.getElementById("profile-email").innerHTML = user.email;
    document.getElementById("profile-name").innerHTML = user.name;
    document.getElementById("profile-username").innerHTML = user.username;
    document.getElementById("profile-posts-count").innerHTML = user.posts_count;
    document.getElementById("profile-comments-count").innerHTML =
      user.comments_count;
    console.log(user);
  }
}
