import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
import { getDatabase, ref, onValue, update} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB3Of2--PqGb_fyrdm6vCe_TDKejRmTAac",
    authDomain: "pump-12bac.firebaseapp.com",
    databaseURL: "https://pump-12bac-default-rtdb.firebaseio.com",
    projectId: "pump-12bac",
    storageBucket: "pump-12bac.firebasestorage.app",
    messagingSenderId: "1045713601059",
    appId: "1:1045713601059:web:6e378988020eb519d42796",
    measurementId: "G-5JK62B3708"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const dataRef = ref(db, "/LED");

signInWithEmailAndPassword(auth, "udayuvrohit@gmail.com", "287143")
.then(() => {
    console.log("Logged in");
    onValue(dataRef, (snapshot) => {
        const fbData = snapshot.val();
        const ledBtn = document.querySelector('button');
        if(fbData.ledOn){
          ledBtn.style.backgroundColor = "green";
        }else{
          ledBtn.style.backgroundColor = "white";
        }

        ledBtn.onclick = async ()=>{
            await update(dataRef, {
                ledOn = !fbData.ledOn
            })
        }
        
    });
})
.catch((error) => {
    console.log(error.message);
    alert('wrong password!');
});
