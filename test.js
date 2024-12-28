import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import {
  getDatabase,
  set,
  get,
  ref,
  onValue,
  child,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import * as scrt from "./script.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8XgkCQVCztRKGCQ0Cmr0mErwftfeYTG4",
  authDomain: "dbleaderboard-3a36a.firebaseapp.com",
  databaseURL: "https://dbleaderboard-3a36a-default-rtdb.firebaseio.com",
  projectId: "dbleaderboard-3a36a",
  storageBucket: "dbleaderboard-3a36a.firebasestorage.app",
  messagingSenderId: "807096461470",
  appId: "1:807096461470:web:bed78545c894b1ddc2338f",
  measurementId: "G-0V82C37234"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export function writeUserData(name, point) {
  const db = getDatabase();
  const reference = ref(db, "leaderboard/" + name);

  set(reference, {
    name: name,
    score: point,
  });
}

export function get_Point_ByName(name) {
  const db = getDatabase();
  const userRef = ref(db);

  return get(child(userRef, "leaderboard/" + name))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val().score;
      } 
    })
}
export function getUserData() {
  const db = getDatabase();
  const postsRef = ref(db, "leaderboard");

  onValue(postsRef, (snapshot) => {
    const data = snapshot.val();

    // Process the user data into an array
    let leaderboard = Object.keys(data).map((key) => {
      return { name: key, ...data[key] };
    });

    leaderboard.sort((a, b) => b.score - a.score);
    //console.log(usersArray)

    WriteScore("leaderboard", leaderboard);
  });
}

export function WriteScore(idtag, plr) {
  document.getElementById(idtag).innerHTML = "";
  let scoreText = "";
  
  for (let i = 0; i < 6; i++) {
    scoreText +=
      "Hạng " + (i + 1) + ": " + plr[i].name + "-" + plr[i].score + "<br>";
  }
  
  for (let i = 0; i < plr.length; i++) {
    if(plr[i].name === scrt.getName()){
      scoreText += ("Bạn: Hạng " + (i+1))
    }
  }
  console.log(`Player name is: ${scrt.getName()}`);
  document.getElementById(idtag).innerHTML = scoreText;
}
console.log(`Player name is: ${scrt.getName()}`);
// export function AutoRandomID() {
//   return "ID" + Math.floor(Math.random() * 500);
// }
// get_Point_ByID("Hiep4").then((point) => {
//   console.log(point);
// });


// document.getElementById("reset-btn").addEventListener("click", function () {
//   writeUserData(useridgame, GetName(), GetPoint());
// });

// document.getElementById("Board").addEventListener("click", function () {
//   writeUserData(useridgame, GetName(), GetPoint());
//   getUserData();
// });

// writeUserData("KD", 10)
getUserData();

