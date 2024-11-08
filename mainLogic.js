const baseUrl = "https://tarmeezacademy.com/api/v1";

function setupUi() {
  const token = localStorage.getItem("token");
  const loginDiv = document.getElementById("login-div");
  const logoutDiv = document.getElementById("logout-div");

  // ADD BUTTON
  const addBtn = document.getElementById("add-btn");

  if (token == null) {
    //user is a guest ( not logged in)
    if (addBtn != null) {
      addBtn.style.setProperty("display", "none", "important");
    }
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
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

  axios.post(url, params).then(function (response) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("login-modal");

    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    setupUi();
    showAlert("logged in successfully", "success");
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
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUi();
  showAlert("logged out successfully");
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
