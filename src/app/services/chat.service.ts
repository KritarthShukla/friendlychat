import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, user } from '@angular/fire/auth';
import { Firestore, collection, addDoc, serverTimestamp, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { Storage, uploadBytesResumable, ref, getDownloadURL } from '@angular/fire/storage';
import { Messaging } from '@angular/fire/messaging';
import { Router } from '@angular/router';
import { Observable, from, firstValueFrom } from 'rxjs';
import { User } from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private provider: GoogleAuthProvider){
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage,
    private messaging: Messaging,
    private router: Router
    user$: Observable<User | null>,
 
  } {
    this.user$ = onAuthStateChanged(auth);
  }

  user$: Observable<any> = user(this.auth);

  login() {
    signInWithPopup(this.auth, this.provider).then((result: any) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      this.router.navigate(['/', 'chat']);
      return credential;
    });
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/', 'login']);
      console.log('signed out');
    }).catch((error: any) => {
      console.log('sign out error: ' + error);
    });
  }

  async addMessage(textMessage: string | null, imageUrl: string | null): Promise<void | DocumentReference<DocumentData>> {
    let data: any;
    try {
      const user = await firstValueFrom(this.user$);
      if (user) {
        if (textMessage && textMessage.length > 0) {
          data = await addDoc(collection(this.firestore, 'messages'), {
            name: user.displayName,
            text: textMessage,
            profilePicUrl: user.photoURL,
            timestamp: serverTimestamp(),
            uid: user.uid
          });
        } else if (imageUrl && imageUrl.length > 0) {
          data = await addDoc(collection(this.firestore, 'messages'), {
            name: user.displayName,
            imageUrl: imageUrl,
            profilePicUrl: user.photoURL,
            timestamp: serverTimestamp(),
            uid: user.uid
          });
        }
      }
      return data;
    } catch (error) {
      console.error('Error writing new message to Firebase Database', error);
      return;
    }
  }

  async saveTextMessage(messageText: string): Promise<void> {
    // Implement saving text message logic here
  }

  async loadMessages(): Promise<DocumentData[]> {
    // Implement loading messages logic here
    return [];
  }

  async saveImageMessage(file: any): Promise<string | null> {
    try {
      const storageRef = ref(this.storage, 'images/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image to Firebase Storage', error);
      return null;
    }
  }

  async updateData(path: string, data: any): Promise<void> {
    // Implement update data logic here
  }

  async deleteData(path: string): Promise<void> {
    // Implement delete data logic here
  }

  async getDocData(path: string): Promise<DocumentData | null> {
    // Implement get document data logic here
    return null;
  }

  async getCollectionData(path: string): Promise<DocumentData[]> {
    // Implement get collection data logic here
    return [];
  }

  async uploadToStorage(path: string, input: HTMLInputElement, contentType: any): Promise<void> {
    // Implement upload to storage logic here
  }

  async requestNotificationsPermissions(): Promise<void> {
    // Implement request notifications permissions logic here
  }

  async saveMessagingDeviceToken(): Promise<void> {
    // Implement save messaging device token logic here
  }
}
