//i cut baseUrl and paste it in mainLogic.js
let currentPage = 1;
let lastPage = 1;

//===================== INFINITE SCROLL (pagination)============================= //
window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.scrollY >= document.body.scrollHeight;
  if (endOfPage && currentPage < lastPage) {
    // c equivalent a if(endofpage == true)
    currentPage = currentPage + 1;
    getPosts(false, currentPage);
  }
});
//=====================// INFINITE SCROLL (pagination) // ======================= //

setupUi();

function userClicked(userId) {
  window.location = `profile.html?userId=${userId}`;
}
getPosts();

function getPosts(reload = true, page = 1) {
  toggleLoader(true);
  axios.get(`${baseUrl}/posts?limit=6&page=${page}`).then(function (response) {
    toggleLoader(false);
    const posts = response.data.data;

    lastPage = response.data.meta.last_page;

    if (reload) {
      document.getElementById("posts").innerHTML = "";
    }

    for (let post of posts) {
      const author = post.author;
      let postTitle = "";

      // show or hide (edit + delete) button
      let user = getCurrentUser();
      let isMyPost = user != null && user.id == post.author.id;
      let editBtnContent = ``;
      if (isMyPost) {
        editBtnContent = `
         <button class=" btn btn-danger " style=" ; margin-left : 5px; float: right" onclick="deletePostBtnClicked('${encodeURIComponent(
           JSON.stringify(post)
         )}')" >delete</button>

         <button class=" btn btn-secondary " style="  float: right " onclick="editPostBtnClicked('${encodeURIComponent(
           JSON.stringify(post)
         )}')" >edit</button>`;
      }
      //  //show or hide (edit + delete) button //

      if (post.title != null) {
        postTitle = post.title;
      }

      let content = `
        <div class="card shadow ">
                 <div class="card-header"  >
                   <span onclick="userClicked(${author.id})" style = "cursor: pointer"  >
                      <img class="rounded-circle border border-2" style="width: 40px; height: 40px;" src="${author.profile_image}" alt="">
                      <b>${author.username}</b> 
                   </span>
                   ${editBtnContent}
                 </div>
                 <div class="card-body" onclick="postClicked(${post.id})" style = "cursor : pointer">
                   <img class="w-100" src="${post.image}" alt="" >
                   <h6 style="color: rgb(193, 193, 193);" class="mt-1" > ${post.created_at}</h6>
                   <h5>${postTitle}</h5>
                   <p>${post.body}</p>
                   <hr>
                   <div>
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                       <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                     </svg>
                     <span>
                       ${post.comments_count} comments
                         <span id="post-tags-${post.id}">
                         </span>
                       </span> 
                    
                   </div>
                   
                 </div>
           </div>   
   `;
      document.getElementById("posts").innerHTML += content;

      let currentPostTagsId = `post-tags-${post.id}`;
      document.getElementById(currentPostTagsId).innerHTML = "";
      for (tag of post.tags) {
        let tagsContent = `
         <button class= "btn btn-sm  rounded-5" style="background-color : gray ; color : white" >
              ${tag.name}
         </button> 
     `;
        document.getElementById(currentPostTagsId).innerHTML += tagsContent;
      }
    }
  });
}

// cut function loginBtnClicked and paste it in file mainLogic.js

// cut function registerBtnClicked and paste it in file mainLogic.js

// cut function logOut and paste it in file mainLogic.js

// cut function setupUi and paste it in file mainLogic.js

// cut function getCurrentUser and paste it in file mainLogic.js
function postClicked(postId) {
  window.location = `postDetails.html?postId=${postId}`;
}

// i cut the function createNewPostClicked and paste it in mainLogic.js

// cut function showAlert and paste it in file mainLogic.js

// i cut 3 func : editP...deleteP... confirmD...and paste it in mainLogic.js

function addBtnClicked() {
  document.getElementById("post-modal-submit-btn").innerHTML = "create";

  document.getElementById("post-id-input").value = "";
  document.getElementById("post-modal-title").innerHTML = "Ceate A New Post";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";

  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}
