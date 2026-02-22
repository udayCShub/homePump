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
//const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);

let rtdbObj;
const sensorsContainer = document.querySelector('.sensorsContainer');
const logicsContainer = document.querySelector('.logicsContainer');
const operationsContainer = document.querySelector('.operationsContainer');

signInWithEmailAndPassword(auth, "udayuvrohit@gmail.com", "fantasy@12")
.then(() => {
    console.log("Logged in");
    const dataRef = ref(db, "/");
    onValue(dataRef, (snapshot) => {
        const fbData = snapshot.val()
        const sensors = fbData.sensors;
        const logics = fbData.logics;

        setUpHtml(sensors, logics);
    });
})
.catch((error) => {
    console.log(error.message);
});


function setUpHtml(sensors, logics){
    const sensorsProps = Object.keys(sensors);
    let sensorsHtml = "";
    sensorsProps.forEach((sensor)=>{
        sensorsHtml += `
            <div>
                <span>${sensor}: </span>
                <span>${sensors[sensor]} </span>
            </div>            
        `
    });
    sensorsContainer.innerHTML = sensorsHtml;

    const logicsProps = Object.keys(logics);
    let logicsHtml = "";
    logicsProps.forEach((sensor)=>{
        logicsHtml += `
            <div>
                <span>${sensor}: </span>
                <span>${logics[sensor]} </span>
            </div>            
        `
    });
    logicsContainer.innerHTML = logicsHtml;

    let operationsHtml = "<button class='callingBell'>Calling Bell</button>";
    operationsContainer.innerHTML = operationsHtml;
    operationsContainer.querySelector('.callingBell').onclick = ()=>{
        if(sensors.topTankLL & !sensors.topTankHL) fbUpdate(ref(db, "/logics"), !logics.topDemand)
    }
}

async function fbUpdate(fbRef, myVal){
    await update(fbRef, {
        topDemand : myVal
        trip : false;
    });
}
