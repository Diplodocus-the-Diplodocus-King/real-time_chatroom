class Chatroom {
    constructor(room, username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }
    //adding new chat document
    async addChat(message){
        // format a chat object
        const now = new Date();
        const chat = {
            message: message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        // save the chat document
        const response = await this.chats.add(chat);
        return response;
    }
    //setting up a real-time listener to get new chats
    getChats(callback){
        this.unsub = this.chats
            .where('room', '==', this.room) // method for complex quieries returns the values that meet the condition arguments(attribute/property to assess, condition, return value)
            .orderBy('created_at') // note we need to assign an index to created_at from within firebase for this to work (the error thrown will have a link)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if(change.type ==='added'){
                        //update ui with new chat
                        callback(change.doc.data());
                    }
                });
            });
    }
    //updating the username
    updateUsername(username){
        this.username = username;
        localStorage.setItem('username', username);
    }
    // updating the room
    updateRoom(room){
        this.room = room;
        if(this.unsub){
            this.unsub();
        }
        console.log('room updated');
    }
}


