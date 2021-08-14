"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
 
  putStoriesOnPage(storyList);
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  

  const hostName = story.getHostName();
  let $html =  $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <i  id = "favIcon"class = "far fa-star" style = "color : #ff6600"></i>
        <i id = 'trash'class="fas fa-trash-alt"></i>
        
      </li>
    `);

  
  
  return $html
  
}
 
/** Gets list of stories from server, generates their HTML, and puts on page. */
//manipulated a bit to allow any list to be passed through in order to append favorites to page with easy
function putStoriesOnPage(List) {
  console.debug("putStoriesOnPage");
  
  $allStoriesList.empty();
  
  // loop through all of our stories and generate HTML for them
  
  for (let story of List.stories) {
    
      if(List === storyList){
       var $story = generateStoryMarkup(story)
  }   
      else {
     $story = generateFavMarkup(story)
  }

    $allStoriesList.append($story);
  }
$allStoriesList.show();
 
$('.story-user').each(function(index,user){
    if(currentUser === undefined){
      return $(this).next().next().remove()
      
    }
   
   if(currentUser.username !== undefined){
      if(user.innerText !==  `posted by ${currentUser.username}`){
        
        return $(this).next().next().remove()
        
      }
   }
})
  
}


async function submitNewStory(evt){
  console.debug(submitNewStory)
  evt.preventDefault()
  // gets values from form sets in ready object
  let title = $('#story-title').val()
  let author = $('#author').val()
  let url = $('#url').val()
  let data = {title,author,url}
  // add's new story to api list, creates new story markup 
  const story = await storyList.addStory(currentUser,data)
  await generateStoryMarkup(story)
  // refreshes page showing new story 
  window.location.reload()
}
// sets function above to submit button
$('#submit-button').on('click',submitNewStory)




function generateFavMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  

  const hostName = story.getHostName();
  let $html =  $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <i  id = "favIcon"class = "fas fa-star" style = "color : #ff6600" value = 'favorited'></i>
        
        
      </li>
    `);
  
   
  return $html
  
}











