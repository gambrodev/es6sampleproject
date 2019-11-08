export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        }
        this.likes.push(like);

        // PERSIST DATA IL LOCAL STORAGE
        this.persistData();

        return like;
    }

    deleteLike(id) {
        this.likes = this.likes.filter(like => like.id !== id);

        // PERSIST DATA IL LOCAL STORAGE
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(like => like.id === id) !== -1;
    }

    getNumberOfLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const likesInStorage = JSON.parse(localStorage.getItem('likes'));
        // restore likes from local storage
        if(likesInStorage) this.likes = likesInStorage;

    }
}