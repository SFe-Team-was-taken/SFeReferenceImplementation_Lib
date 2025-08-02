// import the modules
import { WorkletSynthesizer } from "../../src/index.js";
import { EXAMPLE_WORKLET_PATH } from "../examples_common.js";

document.getElementById("sound_bank_input").onchange = async (e) => {
    // check if there's a file uploaded
    if (!e.target.files[0]) {
        return;
    }
    const file = e.target.files[0];
    const sfFile = await file.arrayBuffer(); // convert to array buffer
    // create the context and add audio worklet
    const context = new AudioContext();
    await context.audioWorklet.addModule(EXAMPLE_WORKLET_PATH);
    // create the synthesizer
    const synth = new WorkletSynthesizer(context.destination);
    await synth.isReady;
    await synth.soundBankManager.addSoundBank(sfFile, "main");
    // create a 36-key piano
    const piano = document.getElementById("piano");
    for (let i = 0; i < 36; i++) {
        /**
         * @type {HTMLElement}
         */
        const key = document.createElement("td");
        key.style.background = "white";
        key.style.height = "10em";
        key.style.width = "2em";
        key.style.margin = "0.2em";
        piano.appendChild(key);
        // add mouse events
        key.onpointerdown = () => {
            // key press: play a note
            synth.noteOn(0, 46 + i, 127);
            key.style.background = "red";
        };
        key.onpointerup = () => {
            // key release: stop a note
            synth.noteOff(0, 46 + i);
            key.style.background = "white";
        };
        key.onpointerleave = key.onpointerup;
    }
};
