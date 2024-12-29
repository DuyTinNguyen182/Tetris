import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import {getDatabase,set,get,ref,onValue,child,
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
    let leaderboard = Object.keys(data).map((key) => {
      return { name: key, ...data[key] };
    });
    leaderboard.sort((a, b) => b.score - a.score);
    WriteScore("leaderboard", leaderboard);
  });
}

export function WriteScore(tagName, player) {
  document.getElementById(tagName).innerHTML = "";
  let scoreText = "";
  for (let i = 0; i < 10; i++) {
    scoreText +=
      "Hạng " + (i + 1) + ": " + player[i].name + "-" + player[i].score + "<br>";
  }
  for (let i = 0; i < player.length; i++) {
    if(player[i].name === scrt.getName()){
      scoreText += ("Bạn: Hạng " + (i+1))
    }
  }
  console.log(`Player name is: ${scrt.getName()}`);
  document.getElementById(tagName).innerHTML = scoreText;
}
console.log(`Player name is: ${scrt.getName()}`);

writeUserData("Kha", 20)
getUserData();
