// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUhvQctABDhoqB4B5k_-Kg3DWpSf5yG_0",
  authDomain: "parking-35b9c.firebaseapp.com",
  projectId: "parking-35b9c",
  storageBucket: "parking-35b9c.appspot.com",
  messagingSenderId: "1001028963068",
  appId: "1:1001028963068:web:8988d86b586739d9762579"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Listen for real-time updates
db.collection("parking_spaces").doc("current_status").onSnapshot((doc) => {
    if (doc.exists) {
        const freeSpots = doc.data().free_spots;
        document.querySelector('.available-spots').textContent = `${freeSpots} out of 150`;
    } else {
        console.log("No such document!");
    }
}, (error) => {
    console.log("Error getting document:", error);
});
