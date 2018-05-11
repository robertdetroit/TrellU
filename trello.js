/*
 *  A simple todo list app.
 *
 * @author Robbie
 */
// Initialize Firebase


var filters = {
    all: function (listObjects) {
        return listObjects;
    },
    card: function (cards, listObjects) {
        return cards.filter(listName => listObjects['key']);
    },
    completed: function (listObjects) {
        return listObjects.filter(todo => todo.completed);
    }
}

var config = {
    apiKey: "AIzaSyD3rZhOAUyU34lYrdJAcKEz0IJ9lBtD3mc",
    authDomain: "trellurobbie.firebaseapp.com",
    databaseURL: "https://trellurobbie.firebaseio.com",
    projectId: "trellurobbie",
    storageBucket: "trellurobbie.appspot.com",
    messagingSenderId: "967729518581"
};
// global access to initialized app database
var db = firebase.initializeApp(config).database();
// global reference to remote data
var userRef = db.ref('users');
var counterRef = db.ref('counter');

var listRef = db.ref('lists');
var cardRef = db.ref('cards');
var todoRef = db.ref('todo');
var imagesRef = db.ref('images');
var profileRef = db.ref('profiles');
var categoryRef = db.ref('categories');
var backgroundRef = db.ref('background');
var activityRef = db.ref('activities');
var commentsRef = db.ref('comments');
var cardUsersRef = db.ref('cardUser');
var backgroundImageRef
var storageRef = firebase.storage().ref();
// connect Firebase to Vue
Vue.use(VueFire);

//var latestIndex;
//counterRef.once('value').then(snapshot => {
//    latestIndex = snapshot.val();
//}).catch(err => console.log(err));


var app = new Vue({
    // app initial state
    data: {
        todos: [],
        newUsername: '',
        newEmail: '',
        currentUsername: '',
        currentEmail: '',
        //dateTodo: '',
        visibility: 'all',
        userSignin: false,
        newTitle: '',
        //newDescription: '',
        newColor: '#000000',
        //newDeadline: "2015-03-25",
        //newStartline: '',
        newCategory: '',
        categories: [],
        //cards: [],
        //newCardTitle: '',
        backgroundColor: "#ffffff",
        customize: false,
        newUser: true,
        show: true,
        create: true,
        maximize: true,
        uploadComplete: false,
        activityView: false,
        expanded: true
        //newTodoTitle: ''
        
    },
    firebase: {
        counter: counterRef,
        users: userRef,
        lists: listRef.orderByChild('indexer'),
        cards: cardRef,
        todos: todoRef,
        profiles: profileRef,
        images: imagesRef,
        background: backgroundRef,
        categories: categoryRef,
        comments: commentsRef,
        activities: activityRef,
        cardUsers: cardUsersRef
        //listLength: listRef.orderByChild('indexer').length
    },
    
    computed: {
        // return todos that match the currently selected filter
        userList () {
            return this.users;
        },
        
        //cardsOfList (listObjects) {
        //    return this.cards.filter(listName => listObjects['key']);
        //
        //},
        
        
        
        listList() {
            return this.lists;
        }
    
    },
    

    methods: {
        //update firebase with new background color    
        backgroundUpdater () {
            backgroundRef.child(this.background[0]['.key']).update({ src: this.backgroundColor,
                                                             picture: false });
            
        },
        //what happens when you press enter - toggles newUser to false and sets background to photo/color
        enterSetter() {
            this.newUser = false;
            this.backgroundSetter();
        },
        //function for two functions - updating firebase with background data and then setting it for color
        submitColorSetter () {
            this.backgroundUpdater();
            this.backgroundSetter();
        },
        // function for updating firebase with photo background data and then settinng it
        submitImageSetter () {
            var orderer = 0;
            if(orderer == 0) {
                this.storeBackgroundImage();
            }
            while(this.uploadComplete == false) {
                alert("still uploading")
                this.backgroundSetter();
            }
            
        },
        
        //the function that actually sets the background
        backgroundSetter () {
            var backgrounder = this.background[0];
            //alert(backgrounder.picture);
            if(backgrounder.picture == false){
                $("body").css({
                    'background-color': ""+backgrounder.src+"",
                    'background-image': "",
                    'background-repeat': ""
                });
            } else {
                $("body").css({
                    'background-image': "url("+backgrounder.src+")",
                    'background-repeat': "repeat"
                });
            }
            
        },
        //changes the categoryRef for color
        categoryColorSetter () {
            //alert("arrived");
            //alert("categoryName:"+categoryName);
            
            categoryRef.orderByChild("name").once('value').then(snapshot => {
                var categoryObject;
                snapshot.forEach(function(child){
                    categoryObject = child.val();
                    if(categoryObject.name) {
                        $("."+categoryObject.name).css({
                            'background-color': ""+categoryObject.color+"",
                            'height': "10px"
                        });
                    }
                    //alert(categoryObject.name);
                    //alert(categoryObject.color);
                    //alert(thinker);
                });        
            }).catch(err => console.log(err));
            
        },
        //returns cards of a particular list
        cardsOfList (listObjects) {
            return this.cards.filter(card => card.listName == listObjects['.key']);
        },
        //returns todos of a particular card
        todoOfCard (card) {
            return this.todos.filter(todo => todo.cardName == card['.key']);
        },
        //returns users of a particular card
        cardUsersOfCard (card) {
            return this.cardUsers.filter(cardUser => cardUser.cardName == card['.key']);
        },
        //returns comments of a particular card
        commentsOfCard (card) {
            return this.comments.filter(comment => comment.cardName == card['.key']);
        },
        
        //returns images of a particular card
        imagesOfCard (card) {
            return this.images.filter(image => image.cardName == card['.key']);
        },
        //returns profile pic of current user
        profilePic () {
            var name = this.currentUsername;
            return this.profiles.filter(profile => profile.username === name);
        },
    
        
        //adds user at log in and checks whether they already exist
        //logs them in if they and creates new account if not
        addUser () {
            this.newUsername = this.newUsername.trim();
            this.newEmail = this.newEmail.trim();
            var usernameCheck = this.newUsername;
            var emailCheck = this.newEmail;
            var alreadyThere = false;
            var loggedIn = false;
            //this.currentUsername = this.newUsername;
            //this.currentEmail = this.newEmail;
            this.users.forEach(function(currentValue) {
                //alert(currentValue.username);
                //alert("does it equal "+usernameCheck);
                //alert(currentValue.username === usernameCheck);
                if (currentValue.username === usernameCheck && currentValue.email === emailCheck){
                    alert("Welcome Back, "+currentValue.username+", you're logged in");
                    alreadyThere = true;
                    loggedIn = true;
                } else if (currentValue.username === usernameCheck && currentValue.email !== emailCheck){
                    alert("Your email is incorrect, "+currentValue.username+". Try again.");
                    alreadyThere = true;

                } else if (currentValue.username !== this.newUsername && currentValue.email === this.newEmail){
                    alert("Your username is incorrect, "+currentValue.email+". Try again.");
                    alreadyThere = true;
                }
            });
            if(alreadyThere == false) {
                alert("You are a new user, a new account has been made for you");
                if (this.newUsername) {
                    userRef.push({
                        username: this.newUsername,
                        email: this.newEmail,
                        completed: false
                    }).then((data, err) => { if (err) { console.log(err) }});
                    // text input displays this value, so clear it to indicate ready to type a new one
                }
                loggedIn = true;  
            }
            if(loggedIn ==true) {
                this.currentUsername = usernameCheck;
                this.currentEmail = emailCheck;
            }
            this.newUsername = '';
            this.newEmail = '';
           
        },
        
        //adds a list
        addList () {

            var indexValue = 0;
            var currentCount =0;
            var cardCount = this.lists.length;
            //alert(cardCount);
            this.newTitle = this.newTitle.trim();
            if (this.newTitle) {
                listRef.push({
                    username: this.currentUsername,
                    email: this.currentEmail,
                    title: this.newTitle,
                    startLine: Date(),
                    //activityList: [],
                    show: true,
                    create: true,
                    indexer: cardCount,
                    edit: false,
                    newDeadline: "2015-03-25",
                    newCardTitle: '',
                    newDescription: '',
                    newCardUser: '',
                    newCategory: '',
                    newColor: '#000000',
                    completed: false
                }).then((data, err) => { if (err) { console.log(err) }});
            }
            
            this.newTitle = '';
            listRef.orderByChild("indexer")
                    .once('value')
                    .then(snapshot => {
                        snapshot.forEach(function(child){
                            listRef.child(child.key).update({ indexer: indexValue++ });
                            counterRef.set(currentCount++);
                            //latestIndex=otherCount++;
                        });
                        
                     })
                    .catch(err => console.log(err));
            
        },
        //adds cards
        addCard (listObjects) {
            listObjects.newCardTitle = listObjects.newCardTitle.trim();
            listObjects.newDescription = listObjects.newDescription.trim();
            listObjects.newCategory = listObjects.newCategory.trim();
            var listKey = listObjects['.key'];
            ///if (this.categories.indexOf(listObjects.newCategory) <= 0) {
            ///    this.categories.push({
            ///        title: listObjects.newCategory,
            ///        color: listObjects.newColor,
            ///    })
            ///}
            if (listObjects.newCardTitle) {
                cardRef.push({
                    listName: listKey,
                    cardTitle: listObjects.newCardTitle,
                    category: listObjects.newCategory,
                    description: listObjects.newDescription,
                    deadline: listObjects.newDeadline,
                    startline: Date(),
                    newTodoTitle: '',
                    newImageTitle: '',
                    //newCardUser: '',
                    newComment: '',
                    color: "#ff0000",
                    //todoList: [],
                    
                    show: true,
                    maximize: true
                })
            }
            activityRef.push({
                activity: "new card added with title, "+listObjects.newCardTitle,
                time: Date()
                
            }).then((data, err) => { if (err) { console.log(err) }});
            listObjects.newCardTitle = '';
            listObjects.newDescription = '';
            listObjects.newCategory = '';
            listObjects.create = true;
            


        },
        //adds todos
        addToDoList (card) {
            var cardKey = card['.key'];
            card.newTodoTitle = card.newTodoTitle.trim();
            if (card.newTodoTitle) {
                todoRef.push({
                    title: card.newTodoTitle,
                    cardName: cardKey
                })   
            }
            activityRef.push({
                activity: "new todo added with title, "+card.newTodoTitle,
                time: Date()
                
            }).then((data, err) => { if (err) { console.log(err) }});

            card.newTodoTitle = '';
            
            
        },
        //adds users to a particular card
        addCardUser (card, username) {
            var cardKey = card['.key'];
            if (username) {
                cardUsersRef.push({
                    title: username,
                    cardName: cardKey
                })   
            }
            activityRef.push({
                activity: "new user added to card, "+username,
                time: Date()
                
            }).then((data, err) => { if (err) { console.log(err) }});
            cardRef.child(actualCard['.key']).update({ show: true});
            
        },
        //adds comments to a particular card
        addComments (card) {
            var cardKey = card['.key'];
            card.newComment = card.newComment.trim();
            if (card.newComment) {
                commentsRef.push({
                    title: card.newComment,
                    cardName: cardKey
                })   
            }
            activityRef.push({
                activity: "new comment added",
                time: Date()
                
            }).then((data, err) => { if (err) { console.log(err) }});
            card.newComment = '';
            
            
        },
        //removes comment
        removeComment (comment) {
            activityRef.push({
                activity: "comment removed with title",
                time: Date()
                
            }).then((data, err) => { if (err) { console.log(err) }});
            commentsRef.child(comment['.key']).remove();
        },
        //removes todos
        removeTodoItem (todoItem) {
            activityRef.push({
                activity: "todo removed with title, "+todoItem.title,
                time: Date()
                
            }).then((data, err) => { if (err) { console.log(err) }});
            todoRef.child(todoItem['.key']).remove();
        },
        //removes card user
        removeCardUser (cardUser) {
            activityRef.push({
                activity: "user removed from card, "+cardUser.title,
                time: Date()
                
            }).then((data, err) => { if (err) { console.log(err) }});
            cardUsersRef.child(cardUser['.key']).remove();
        },
        //adds new categories
        addCategory () {
            this.newCategory = this.newCategory.trim();
            if (this.newCategory) {
                //alert("this comes first");

                categoryRef.push({
                    name: this.newCategory,
                    color: this.newColor
                })
                
            }
            //this.coloredCategory(this.newCategory,this.newColor);
            //document.getElementById(this.newCategory).style.color = this.newColor;
            this.newCategory = '';
            
            
        },
        //edits category with new color
        editCategory(newColor, category) {
            categoryRef.child(category['.key']).update( { color: newColor });
            this.categoryColorSetter();
        
        },
        //edits list with new name
        editListTitle(list) {
            var newTitle = list.newCardTitle.trim();
            listRef.child(list['.key']).update( { title: newTitle, edit: false });
            list.newCardTitle = '';
        
        },
        // edits cards for all its attributes
        editActualCard (actualCard, listObjects) {
            listObjects.newCardTitle = listObjects.newCardTitle.trim();
            listObjects.newDescription = listObjects.newDescription.trim();
            listObjects.newCategory = listObjects.newCategory.trim();
            listObjects.newCardUser = listObjects.newCardUser.trim();
            //alert(listObjects.newCategory);
            if (listObjects.newCardTitle.length != 0) {
                cardRef.child(actualCard['.key']).update({ cardTitle: listObjects.newCardTitle });
                activityRef.push({
                    activity: "card title changed",
                    time: Date()

                }).then((data, err) => { if (err) { console.log(err) }});
                //actualCard.cardTitle = listObject.newCardTitle;
            }
            if (listObjects.newDescription.length != 0) {
                cardRef.child(actualCard['.key']).update({ description: listObjects.newDescription });
                activityRef.push({
                    activity: "card description changed",
                    time: Date()

                }).then((data, err) => { if (err) { console.log(err) }});
                //actualCard.description = listObject.newDescription;
            }
            if (listObjects.newCardUser.length != 0) {
                //alert("sleepynp");
                this.addCardUser(actualCard,listObjects.newCardUser);
                activityRef.push({
                    activity: "card user added",
                    time: Date()
                }).then((data, err) => { if (err) { console.log(err) }});
                
            }
            if (listObjects.newCategory.length != 0) {
                cardRef.child(actualCard['.key']).update({ category: listObjects.newCategory });
                if(listObjects.newCategory){
                    this.categoryColorSetter();
                }
                activityRef.push({
                    activity: "card category changed",
                    time: Date()

                }).then((data, err) => { if (err) { console.log(err) }});
                //alert(listObjects.newCategory);
                //this.categoryColorSetter(listObjects.newCategory);
                //actualCard.category = listObject.newCategory;
            }
            if (listObjects.newDeadline != actualCard.deadline) {
                cardRef.child(actualCard['.key']).update({ deadline: listObjects.newDeadline });
                //actualCard.category = listObject.newCategory;
                activityRef.push({
                    activity: "card deadline changed",
                    time: Date()

                }).then((data, err) => { if (err) { console.log(err) }});
            }
            cardRef.child(actualCard['.key']).update({ show: true});
            
            //actualCard.deadline = listObject.newDeadline;
            //actualCard.show = true;
            //this.categoryColorSetter(listObjects.newCategory);
            listObjects.newCardUser='';
            listObjects.newDescription = '';
            listObjects.newCategory = '';
            listObjects.newCardTitle = '';
        },
        // removes card
        removeCard (actualCard) {
            activityRef.push({
                activity: "card removed with title, "+actualCard.cardTitle,
                time: Date()
                
            }).then((data, err) => { if (err) { console.log(err) }});
            cardRef.child(actualCard['.key']).remove();
            

        },
        //removes category
        removeCategory (category) {
            categoryRef.child(category['.key']).remove();
        },
        // moves card left
        moveCardLeft (actualCard, listObjects) {
            var beforeListIndexer = listObjects.indexer;
            //alert(beforeListIndexer);
            var afterListIndexer = beforeListIndexer -1;
            listRef.orderByChild("indexer")
                    .equalTo(afterListIndexer)
                    .once('value')
                    .then(snapshot => {
                        snapshot.forEach(function(child){
                            if (beforeListIndexer != 0) {
                                //alert("going");
                                //this.categoryColorSetter ();
                                cardRef.child(actualCard['.key']).update({ listName: child.key });
                                activityRef.push({
                                    activity: "card moved left",
                                    time: Date()
                
                                }).then((data, err) => { if (err) { console.log(err) }});
                            } 
                            //this.categoryColorSetter ();
                            //latestIndex=otherCount++;
                        });
                        
                     })
                    .catch(err => console.log(err));
            if (beforeListIndexer == 0) {
                    alert("Cannot go further left");
            }
            
            ///this.categoryColorSetter ();
            
        },
        // moves card right
        moveCardRight (actualCard, listObjects) {
            var counterQuery = db.ref("counter");
            var beforeListIndexer = listObjects.indexer;
            //alert(beforeListIndexer);
            //alert(beforeListIndexer);
            var afterListIndexer = beforeListIndexer+1;
            counterQuery.once("value").then(snapshot => {
                //alert("first");
                currentTopIndex = snapshot.val();
                //alert(currentTopIndex);
                if (beforeListIndexer == currentTopIndex) {
                    alert("Cannot go further right");

                } else {
                    //alert("second");
                    listRef.orderByChild("indexer").equalTo(afterListIndexer).once('value').then(snapshot => {
                        
                        snapshot.forEach(function(child){
                            cardRef.child(actualCard['.key']).update({ listName: child.key });
                            activityRef.push({
                                activity: "card moved right",
                                time: Date()
            
                            }).then((data, err) => { if (err) { console.log(err) }});
                            
                    
                        });

                    }).catch(err => console.log(err));
                }
            });
            
        },
        // removes list item
        removeListItem (listObjects) {
            var indexValue = 0;
            var currentCount =0;
            var otherCount=0;
            //var toDeleteCards = [];
            listRef.child(listObjects['.key']).remove();
            listRef.orderByChild("indexer")
                    .once('value')
                    .then(snapshot => {
                        snapshot.forEach(function(child){
                            listRef.child(child.key).update({ indexer: indexValue++ });
                            counterRef.set(currentCount++);
                            //latestIndex=otherCount++;
                        });
                        
                     })
                    .catch(err => console.log(err));
            
        },
        // moves list item left
        moveLeftListItem (listObjects) {
            var query = db.ref("lists/"+listObjects['.key']+"/indexer");
            var beforeIndex;
            var afterIndex;
            query.once("value").then(function(snapshot) {
                beforeIndex = snapshot.val();
                afterIndex = snapshot.val() -1;
                if (beforeIndex == 0) {
                    alert("Cannot go further left");
                        //listRef.child(listObjects['.key']).update({ indexer: latestIndex+1 });

                } else {
                    listRef.orderByChild("indexer").equalTo(afterIndex).once('value').then(snapshot => {
                        snapshot.forEach(function(child){
                            listRef.child(child.key).update({ indexer: beforeIndex });
                            listRef.child(listObjects['.key']).update({ indexer: afterIndex });
                        });
        

                    }).catch(err => console.log(err));
                } 
            });  
            
        },
        // moves list item right
        moveRightListItem (listObjects) {
            var query = db.ref("lists/"+listObjects['.key']+"/indexer");
            var counterQuery = db.ref("counter");
            var beforeIndex;
            var afterIndex;
            query.once("value").then(function(snapshot) {
                beforeIndex = snapshot.val();
                afterIndex = snapshot.val() +1;
                counterQuery.once("value").then(snapshot => {
                    currentTopIndex = snapshot.val();
                    if (beforeIndex == currentTopIndex) {
                        alert("Cannot go further right");

                    } else {
                        listRef.orderByChild("indexer").equalTo(afterIndex).once('value').then(snapshot => {
                            snapshot.forEach(function(child){
                                listRef.child(child.key).update({ indexer: beforeIndex });
                                listRef.child(listObjects['.key']).update({ indexer: afterIndex });
                            });

                        }).catch(err => console.log(err));
                    }
                }); 
            });        
        },
        
        //removeActualCard (actualCard, cardObject) {
        //    cardObject.activityList.splice(cardObject.activityList.indexOf(actualCard), 1)
        //},
        
        // stores image of card and adds to storageRef
        storeImage (card) {
            //alert("is it working");
            // get input element user used to select local image
            var input = document.getElementById('files');
            // have all fields in the form been completed
            if (card.newImageTitle && input.files.length > 0) {
                //alert("also working");

                var file = input.files[0];
                // get reference to a storage location and
                storageRef.child('images/' + file.name)
                          .put(file)
                          .then(snapshot => this.addImage(card.newImageTitle, snapshot.downloadURL, card));
                // reset input values so user knows to input new data
                input.value = '';
                activityRef.push({
                    activity: "image added to card",
                    time: Date()

                }).then((data, err) => { if (err) { console.log(err) }});
            }
        },
        // adds image to imagesRef
        addImage (title, url, card) {
            //alert(title);
            //alert(url);
            //alert(card.key);
            alert("Uploading...");
            // now that image has been stored in Firebase, create a reference to it in database
            imagesRef.push({
                title: card.newImageTitle,
                url: url,
                cardName: card['.key']
            });
            // reset input values so user knows to input new data
            card.newImageTitle = '';
        },
        // stores profile image to storageRef
        storeProfileImage () {
            var username = this.currentUsername;
            if(username.length == 0) {
                alert("You must be signed in to add a picture. Make a new account!")
            }
            // get input element user used to select local image
            var input = document.getElementById('yfiles');
            // have all fields in the form been completed
            if (username && input.files.length > 0) {
                //alert("also working");

                var file = input.files[0];
                // get reference to a storage location and
                storageRef.child('profiles/' + file.name)
                          .put(file)
                          .then(snapshot => this.addProfileImage(username, snapshot.downloadURL));
                // reset input values so user knows to input new data
                input.value = '';
            }
        },
        // stores background image to storageRef
        storeBackgroundImage () {
            //alert("working");
            var input = document.getElementById('xfiles');
            if (input.files.length > 0) {
                var file = input.files[0];
                storageRef.child('backgrounds/' + file.name)
                          .put(file)
                          .then(snapshot => this.addBackgroundImage(snapshot.downloadURL));
                input.value = '';
            }
            
        },
        // adds backgroundimage to storageref and backgroundref
        addBackgroundImage (url) {
            var oldBackground = this.background[0];
            if(oldBackground.picture == true) {
                var path = new URL(""+oldBackground.src+"").pathname.split(/\/|%2F/).slice(-2).join('/');
                storageRef.child(path)
                          .delete()
                          .then(() => console.log('Image deleted'))
                          .catch(err => console.log(err));
            }
            
            //alert("Uploading...");
            backgroundRef.child(this.background[0]['.key']).update({ src: url, picture: true });
            alert("finished uploading - press 'Picture Set'!");
            this.uploadComplete == true;
            
            
        }, 
        // adds profile image url to profileRef
        addProfileImage (username, url) {
            //alert(title);
            //alert(url);
            //alert(card.key);
            alert("Uploading...");
            // now that image has been stored in Firebase, create a reference to it in database
            profileRef.push({
                username: username,
                url: url
                //cardName: card['.key']
            });
            // reset input values so user knows to input new data
            //card.newImageTitle = '';
        },
        // removes image in a card
        removeImage (img) {
            imagesRef.child(img['.key']).remove();
            var path = new URL(img.url).pathname.split(/\/|%2F/).slice(-2).join('/');
            storageRef.child(path)
                        .delete()
                        .then(() => console.log('Image deleted'))
                        .catch(err => console.log(err));
            activityRef.push({
                activity: "image removed from card",
                time: Date()
                
            }).then((data, err) => { if (err) { console.log(err) }});
            
        },
        // removes profile image
        removeProfileImage (img) {
            if (confirm('Are you sure you want to remove this image?')) {
                profileRef.child(img['.key']).remove();
                var path = new URL(img.url).pathname.split(/\/|%2F/).slice(-2).join('/');
                storageRef.child(path)
                          .delete()
                          .then(() => console.log('Image deleted'))
                          .catch(err => console.log(err));
            }
        }  
    }
})

// mount
app.$mount('#trelloapp');

//filters cards for different categories
$(document).on('click', '.categoryFilterButton', function(){
    var category = $(this).attr('id');
    //alert(category);
    $('.cardLite').each(function() {
        //alert($(this).attr('title'));
        if ($(this).attr('title') == category) {
            $(this).show();
            } else { $(this).hide(); }
    });
    alert("filtered for: " + category);
});

//resets the filters and shows all the cards
$(document).on('click', '.categoryFilterReset', function(){
    //var category = $(this).attr('id');
    //alert(category);
    $('.cardLite').each(function() {
        $(this).show();
        //alert($(this).attr('title'));
        //if ($(this).attr('title') == category) {
        //    $(this).show();
        //    } else { $(this).hide(); }
    });
});


