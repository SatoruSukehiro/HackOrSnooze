"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories");
  hidePageComponents();
  putStoriesOnPage(storyList);
  $newStory.hide()
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $newStory.hide();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $newStory.hide()
}
function navSubmitClick(evt){
  console.debug("navSubmitClick");
  hidePageComponents();
  
  $newStory.show()
  
}

$navSubmit.on('click',navSubmitClick)

//click event and function for favorites in nav

function navFavorites(evt){
hidePageComponents()
let favList = new StoryList(currentUser.favorites)

putStoriesOnPage(favList)

}


$navFavs.on('click',navFavorites)



