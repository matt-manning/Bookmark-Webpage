// listen for auth status changes
auth.onAuthStateChanged(user => {
    console.log(user);
    if (user) {
        // get data
        let theCurrentUser = auth.currentUser;
        db.collection('users/' + theCurrentUser.uid + '/bookmarks').onSnapshot(snapshot => {
            const bookmarkData = setupBookmarks(snapshot.docs);
            registerBookmarkEventListeners(bookmarkData);
            setupUI(user);
        }, err => {
            console.log(err.message);
        });
        console.log('user logged in: ', user);
    } else {
        setupUI();
        setupBookmarks([]);
        console.log('user logged out');
    }
})

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // get user information
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    // sign up user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    });
})

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('User signed out');
    });
})

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefaundet();
    //get user information
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        console.log(cred.user);
        // close the login modal and reset the form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })
})