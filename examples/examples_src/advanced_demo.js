// import the modules
import { Sequencer } from "../../src/sequencer/sequencer.js";
import { Synthetizer } from "../../src/synthetizer/synthetizer.js";
import { EXAMPLE_SOUNDFONT_PATH, EXAMPLE_WORKLET_PATH } from "../examples_common.js";

// load the soundfont
fetch(EXAMPLE_SOUNDFONT_PATH).then(async response =>
{
    // load the soundfont into an array buffer
    let soundFontBuffer = await response.arrayBuffer();
    document.getElementById("message").innerText = "SoundFont has been loaded!";
    
    // create the context and add audio worklet
    const context = new AudioContext();
    await context.audioWorklet.addModule(EXAMPLE_WORKLET_PATH);
    const synth = new Synthetizer(context.destination, soundFontBuffer);     // create the synthetizer
    let seq;
    
    // add an event listener for the file inout
    document.getElementById("midi_input").addEventListener("change", async event =>
    {
        // check if any files are added
        if (!event.target.files[0])
        {
            return;
        }
        // resume the context if paused
        await context.resume();
        // parse all the files
        const parsedSongs = [];
        for (let file of event.target.files)
        {
            const buffer = await file.arrayBuffer();
            parsedSongs.push({
                binary: buffer,     // binary: the binary data of the file
                altName: file.name  // altName: the fallback name if the MIDI doesn't have one. Here we set it to the file name
            });
        }
        if (seq === undefined)
        {
            seq = new Sequencer(parsedSongs, synth);                          // create the sequencer with the parsed midis
            seq.play();                                                             // play the midi
        }
        else
        {
            seq.loadNewSongList(parsedSongs); // the sequencer is already created, no need to create a new one.
        }
        seq.loop = false;                                                       // the sequencer loops a single song by default
        
        // make the slider move with the song
        let slider = document.getElementById("progress");
        setInterval(() =>
        {
            // slider ranges from 0 to 1000
            slider.value = (seq.currentTime / seq.duration) * 1000;
        }, 100);
        
        // on song change, show the name
        seq.addOnSongChangeEvent(e =>
        {
            document.getElementById("message").innerText = "Now playing: " + e.midiName;
        }, "example-time-change"); // make sure to add a unique id!
        
        // add time adjustment
        slider.onchange = () =>
        {
            // calculate the time
            seq.currentTime = (slider.value / 1000) * seq.duration; // switch the time (the sequencer adjusts automatically)
        };
        
        // add button controls
        document.getElementById("previous").onclick = () =>
        {
            seq.previousSong(); // go back by one song
        };
        
        // on pause click
        document.getElementById("pause").onclick = () =>
        {
            if (seq.paused)
            {
                document.getElementById("pause").innerText = "Pause";
                seq.play(); // resume
            }
            else
            {
                document.getElementById("pause").innerText = "Resume";
                seq.pause(); // pause
                
            }
        };
        document.getElementById("next").onclick = () =>
        {
            seq.nextSong(); // go to the next song
        };
    });
});