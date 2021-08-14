"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    // UNIMPLEMENTED: complete this function!
    return "hostname.com";
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;

  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
      
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory( user, {title,author,url}) {
    // 
    // needed to add story data to api notice the post request!
    const token = user.loginToken
    const response = await axios({
      method: 'POST',
      url: `${BASE_URL}/stories`,
      data: {token,story: {title,author,url}}
    })
    // Makes Story Instance and adds story to 
    let story = new Story(response.data.story);
   
    
    return story
    
  }
async removeStory(user, storyId){
  const token = user.loginToken
  
   await axios({
    method: 'DELETE',
    url : `${BASE_URL}/stories/${storyId}`,
    method: 'DELETE',
    data: {token : user.loginToken}

  
  })
}

}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  //add story to list of users favorites
   async addFavorites(story){
    currentUser.favorites.push(story)
    await this.updateFavorites('ADD',story)
  
  }
  async removeFavorites(story){
    await this.updateFavorites('remove',story)
    currentUser.favorites = currentUser.favorites.filter(function(s){
     if(s.storyId !== story.storyId){
       return s
     }
   })
    
   return currentUser.favorites
  
  }
  async updateFavorites(newState,story){
    const token = this.loginToken
    const method = newState === 'ADD' ? 'POST' : 'DELETE'
    
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
      method: method,
      params: {token},
    })
    
  }
  

}



//Click event for favorite button

$('body').on('click','ol i', async function(evt){
    evt.preventDefault()
   let  target = $(evt.target)
  let storyId = target.closest('li').attr('id')
  let story = storyList.stories.find(function(s){
      if(s.storyId === storyId){
      return s
    }
 });
 
  if(target.hasClass('far fa-star')){
      target.toggleClass('fas')
      
      target.toggleClass('far')
    target[0].id = 'checked'
    currentUser.addFavorites(story)
  
  } 
  
 else {
  
   $(evt.target).toggleClass('far')
  
  
   $(evt.target).toggleClass('fas')
   if(target.attr('value') === 'favorited'){
     currentUser.removeFavorites(story);
     target.closest('li').remove()
   }
  

   
 }
 
 
  
})
// currently only allows me to delete things that I myself have put there. I believe its because the currentUser
// token that I need to Delete actually keeps me from deleting things I never posted.

$('ol').on('click', 'i',async function(evt){
    if(evt.target.id === 'trash'){
      let storyId = $(evt.target).closest('li').attr('id')
      let story = storyList.stories.find(function(s){
        if(s.storyId === storyId){
          return s
        }
      })

       $(evt.target).closest('li').remove() 
        storyList.removeStory(currentUser,story.storyId)
      
    }
})




