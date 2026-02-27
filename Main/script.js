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

const dataRef = ref(db, "/all");

const pswrdForm = document.querySelector('.pswrdForm');
const infoContainer = document.querySelector('.infoContainer');

pswrdForm.onsubmit = (e)=> {
    e.preventDefault();
    
    const pswrdInput = pswrdForm.querySelector('.pswrdInput');
    const pswrd = pswrdInput.value;
    signInWithEmailAndPassword(auth, "udayuvrohit@gmail.com", pswrd)
    .then(() => {
        console.log("Logged in");
        infoContainer.style.display = "block";
        pswrdForm.style.display = "none";
        onValue(dataRef, (snapshot) => {
            const fbData = snapshot.val()
            setUpApp(fbData);
        });
    })
    .catch((error) => {
        console.log(error.message);
        alert('wrong password!');
    });

    console.log(pswrd);
    pswrdInput.value = "";
}




function setUpApp(fbData){
    const topTankContainer = document.querySelector('.topTankContainer');
    const interlocksContainer = document.querySelector('.interlocksContainer');
    const motorContainer = document.querySelector('.motorContainer');
    const callBtnContainer = document.querySelector('.callBtnContainer');

    const topTank_LL = fbData.topTank_LL;
    const topTank_HL = fbData.topTank_HL;
    const topTankDemand = fbData.topTank_demand;

    topTankContainer.innerHTML = `
        <div class="section">
            <div class='heading'>Top Tank:</div>
            <div class='key'>
                <span class='tittle'>Low Level:</span>
                <span class='value'> ${topTank_LL}</span>
            </div>
            <div class='key'>
                <span class='tittle'>High Level:</span>
                <span class='value'> ${topTank_HL}</span>
            </div>
        </div>
    `;

    interlocksContainer.innerHTML = `
        <div class="section">
            <div class='heading'>Interlocks:</div>
            <div class='key'>
                <span class='tittle'>Top Tank Demand:</span>
                <span class='value'> ${topTankDemand}</span>
            </div>
            <div class='key'>
                <span class='tittle'>Bottom Tank Low Level:</span>
                <span class='value'> ${fbData.sunp_level}</span>
            </div>
        </div>
    `;

    motorContainer.innerHTML = `
        <div class="section">
            <div class='heading'>Motor: <span class="motorState">${fbData.motorOn}</span></div>
            <div class='key'>
                <span class='tittle'>Discharging:</span>
                <span class='value'> ${fbData.discharge}</span>
            </div>
            <div class='key'>
                <span class='tittle'>Trip:</span>
                <span class='value tripValue'> ${fbData.trip}</span>
            </div>
            <div class='key'>
                <span class='tittle'>Force:</span>
                <span class='value forceValue'> ${fbData.force}</span>
            </div>
        </div>
    `;

    callBtnContainer.innerHTML = "<button class='callingBell'>Calling Bell</button>";
    callBtnContainer.querySelector('.callingBell').onclick = async () => {
        try {
            await update(ref(db, 'all'), {
                force: true
            });
            console.log("Force set to true");
        } catch (error) {
            console.error(error);
        }
    };
        
    if(fbData.trip){
        const tripSpan = document.querySelector('.tripValue');
        tripSpan.classList.add('tripped');
        let visibility = true;
        setInterval(()=>{
            visibility = !visibility;
            if(visibility){
                tripSpan.style.visibility = "visible";
            }else{
                tripSpan.style.visibility = "hidden";
            }
        }, 500);
    }
}



