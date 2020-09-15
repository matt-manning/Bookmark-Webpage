const bookmarkList = document.querySelector('#other-list');
const favoriteList = document.querySelector('#favorite-list');
const form = document.querySelector('#add-bookmark');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const setupUI = (user) => {
	if (user) {
		// account info
		const html = `<div>Logged in as ${user.email}</div>`;
		accountDetails.innerHTML = html;
		// toggle UI elements
		loggedInLinks.forEach(item => item.style.display = 'block');
		loggedOutLinks.forEach(item => item.style.display = 'none');
	} else {
		// hid account info
		accountDetails.innerHTML = '';
		// toggle UI elements
		loggedInLinks.forEach(item => item.style.display = 'none');
		loggedOutLinks.forEach(item => item.style.display = 'block');
	}
}

const setupBookmarks = (data) => {
    let bookmarksHTML = '';
    let favoritesHTML = '';
    const bookmarkData = [];
    if (data && data.length) {
        data.forEach(doc => {
            const bookmarkId = Math.floor(Math.random() * 10000000);
            const bookmark = doc.data();
            if (bookmark.favorite) {
                favoritesHTML += bookmarkHTML(bookmark, bookmarkId);
            } else {
                bookmarksHTML += bookmarkHTML(bookmark, bookmarkId);
            }
            bookmarkData.push({bookmark, bookmarkId});
        })
    }
    favoriteList.innerHTML = favoritesHTML;
    bookmarkList.innerHTML = bookmarksHTML;
    return bookmarkData;
}

const bookmarkHTML = (bookmark, bookmarkId) => {
    let html = '';
    if (bookmark.url.includes('https://') || bookmark.url.includes('http://')) {
        const li = `
            <li>
                <div class="row card-margin">
                    <div class="col s12 m12 card-padding">
                        <div class="card-panel teal card-size">
                            <img src='${"https://www.google.com/s2/favicons?domain_url=" + bookmark.url}' alt='icon' class='img-size'>
                            <a class='white-text' href='${bookmark.url}' target='_blank'>${bookmark.website}</a>
                            <button class='btn-flat btn-small right cross' id='${bookmarkId}'><i class='material-icons'>clear</i></button>
                            <button class='btn-flat waves-light btn-small right listener' id='${bookmarkId}'><i class='material-icons left'>compare_arrows</i>switch</button>
                        </div>
                    </div>
                </div>
            </li>
        `;
        html += li;
    } else {
        const li = `
            <li>
                <div class="row card-margin">
                    <div class="col s12 m12 card-padding">
                        <div class="card-panel teal card-size">
                            <img src='${"https://www.google.com/s2/favicons?domain_url=" + bookmark.url}' alt='icon' class='img-size'>
                            <a class='white-text' href='${"https://" + bookmark.url}' target='_blank'>${bookmark.website}</a>
                            <button class='btn-flat btn-small right cross' id='${bookmarkId}'><i class='material-icons'>clear</i></button>
                            <button class='btn-flat waves-light btn-small right listener' id='${bookmarkId}'><i class='material-icons left'>compare_arrows</i>switch</button>
                        </div>
                    </div>
                </div>
            </li>
        `;
        html += li;
    }
    return html;
}

// Register the addEventListeners for the switch and delete buttons on each bookmark
const registerBookmarkEventListeners = (bookmarkData) => {
    const listener = document.querySelectorAll('.listener');
    const cross = document.querySelectorAll('.cross');
    listener.forEach((btn) => {
        bookmarkData.forEach(x => {
            if (x.bookmarkId.toString() === btn.id) {
                btn.addEventListener('click', () => {
                    let theCurrentUser = auth.currentUser;
                    db.collection('users/' + theCurrentUser.uid + '/bookmarks').doc(x.bookmark.website).update({
                        website: x.bookmark.website,
                        url: x.bookmark.url,
                        favorite: !x.bookmark.favorite
                    });
                })
            }
        })
    })
    cross.forEach((btn) => {
        bookmarkData.forEach(x => {
            console.log(x.bookmark.website);
            console.log(x.bookmarkId, btn.id);
            console.log(x.bookmarkId.toString() === btn.id);
            if (x.bookmarkId.toString() === btn.id) {
                btn.addEventListener('click', () => {
                    let theCurrentUser = auth.currentUser;
                    db.collection('users/' + theCurrentUser.uid + '/bookmarks').doc(x.bookmark.website).delete();
                })
            }
        })
    })
}

// saving data
form.addEventListener('submit', (e) => {
	e.preventDefault();
	const fav = document.getElementById('fav').checked;
    let theCurrentUser = auth.currentUser;
    if (fav) {
		db.collection('users/' + theCurrentUser.uid + '/bookmarks').doc(form['website'].value).set({
			website: form['website'].value,
			url: form['url'].value,
			favorite: true
		}).catch(err=> {
			console.log(err.message);
		});
	} else {
		db.collection('users/' + theCurrentUser.uid + '/bookmarks').doc(form['website'].value).set({
			website: form['website'].value,
			url: form['url'].value,
			favorite: false
		}).catch(err => {
			console.log(err.message);
		});
	}
	form['website'].value = '';
	form['url'].value = '';
})

// materialize components
document.addEventListener('DOMContentLoaded', function() {
	var modals = document.querySelectorAll('.modal');
	M.Modal.init(modals);
})