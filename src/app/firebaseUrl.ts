
export const firebaseUrl ='https://angular-project-fe202-default-rtdb.firebaseio.com/';
export const firebaseRestApi = 'https://identitytoolkit.googleapis.com/v1/accounts';
export const apikey ='AIzaSyBDMQ3wQo_p-MCyHbL4U2U4ALAPWLQzx30';
export const signUp =`${firebaseRestApi}:signUp?key=${apikey}`;
export const signIn =`${firebaseRestApi}:signInWithPassword?key=${apikey}`;

export const projectIdInFirebase ='angular-project-fe202';
export const userCollection =`users`;
export const fireStoreRestApi =`https://firestore.googleapis.com/v1/projects/${projectIdInFirebase}/databases/(default)/documents/${userCollection}/`
