// import { ElevenLabsCall} from './conversation.js';

let activeCall = null;
let pc;
let audioEl = document.createElement("audio");
audioEl.autoplay = true;

export function startCall(agentId, beginConvoLabel, endConvoLabel) {

    if (activeCall === null) {
        console.log("NO active call, gonna start it");
        const button = document.getElementById("playVideoLink");
        button.textContent = endConvoLabel;
        activeCall = new window.ElevenLabsCall(agentId, beginConvoLabel);

        // activeCall.on("disconnected", () => {
        //   console.log("Call disconnected (silence or network issue)");
        //   conversationEnded(beginConvoLabel);
        // });
        //
        // activeCall.on("ended", () => {
        //   console.log("Call ended");
        //   conversationEnded(beginConvoLabel);
        // });

        activeCall.start();
    } else {
        conversationEnded(beginConvoLabel);
        // console.log("there is an active call, gonna stop it");
        // activeCall.stop();
        // // encCall();
        // activeCall = null;
        // const button = document.getElementById("playVideoLink");
        // button.textContent = beginConvoLabel;
    }
}

export function conversationEnded(beginConvoLabel) {
    if (activeCall != null) {
        console.log("there is an active call, gonna stop it");
        activeCall.stop();
        // encCall();
        activeCall = null;
        const button = document.getElementById("playVideoLink");
        button.textContent = beginConvoLabel;
    }
}

function endCall() {
    // document.getElementById("playVideoLink").disabled = false;
    // document.getElementById("endCall").disabled = true;

    if (pc) {
        pc.close();
        pc = null;
    }
}

window.startCall = startCall;
