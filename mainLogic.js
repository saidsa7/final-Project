const baseUrl = "https://tarmeezacademy.com/api/v1";

// ===== POST REQUESTS ====
function createNewPostClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0];

  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);

  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };

  let url = ``;
  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    url = `${baseUrl}/posts/${postId}`;
    formData.append("_method", "put");
  }
  toggleLoader(true);
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert("the Post has been created ", "success");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}
function editPostBtnClicked(postObject) {
  document.getElementById("post-modal-submit-btn").innerHTML = "update";
  let post = JSON.parse(decodeURIComponent(postObject));
  console.log(post);
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  console.log(post);

  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();
}

function confirmPostDelete() {
  const postId = document.getElementById("delete-post-id-input").value;

  const url = `${baseUrl}/posts/${postId}`;
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };

  axios
    .delete(url, {
      headers: headers,
    })
    .then(function (response) {
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert("the Post has been deleted successfully ", "success");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}

function profileClicked() {
  const user = getCurrentUser();
  const userId = user.id;
  window.location = `profile.html?userId=${userId}`;
}
function setupUi() {
  const token = localStorage.getItem("token");
  const loginDiv = document.getElementById("login-div");
  const logoutDiv = document.getElementById("logout-div");
  // const addCommentUi = document.getElementById("add-comment-ui");

  // ADD BUTTON
  const addBtn = document.getElementById("add-btn");

  if (token == null) {
    //user is a guest ( not logged in)
    if (addBtn != null) {
      addBtn.style.setProperty("display", "none", "important");
    }
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
    // addCommentUi.style.setProperty("display", "none", "important");
  } else {
    // for logged in user
    if (addBtn != null) {
      addBtn.style.setProperty("display", "block", "important");
    }
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    const user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("nav-user-image").src = user.profile_image;
    // addCommentUi.style.setProperty("display", "block", "important");
  }
}

// =========== AUTH FUNCTIONS ==================
function loginBtnClicked() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;

  const params = {
    username: username,
    password: password,
  };

  const url = `${baseUrl}/login`;
  toggleLoader(true);
  axios
    .post(url, params)
    .then(function (response) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("login-modal");

      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setupUi();
      showAlert("logged in successfully", "success");
      setupAddComment();
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function registerBtnClicked() {
  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-password-input").value;
  const image = document.getElementById("register-image-input").files[0];

  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const url = `${baseUrl}/register`;
  toggleLoader(true);
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then(function (response) {
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("register-modal");

      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setupUi();
      showAlert("New User Registered successfully", "success");
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUi();
  showAlert("logged out successfully");
  setupAddComment();
}

function showAlert(costumMessage, type = "success") {
  const alertPlaceholder = document.getElementById("success-alert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  appendAlert(costumMessage, type);

  // todo : Hide the Alert
  setTimeout(() => {
    const alert = bootstrap.Alert.getOrCreateInstance("#success-alert");
    // alert.close();
  }, 2000);
}

function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}
