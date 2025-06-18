import { BasicMIDI, MIDISequenceData } from "spessasynth_core";

/**
 * A simplified version of the MIDI, accessible at all times from the Sequencer.
 * Use getMIDI() to get the actual sequence.
 * This class contains all properties that MIDI does, except for tracks and the embedded soundfont.
 */
export class MIDIData extends MIDISequenceData
{
    
    /**
     * A boolean indicating if the MIDI file contains an embedded soundfont.
     * If the embedded soundfont is undefined, this will be false.
     * @type {boolean}
     */
    isEmbedded = false;
    
    /**
     * Constructor that copies data from a BasicMIDI instance.
     * @param {BasicMIDI} midi - The BasicMIDI instance to copy data from.
     */
    constructor(midi)
    {
        super();
        this._copyFromSequence(midi);
        
        // Set isEmbedded based on the presence of an embeddedSoundFont
        this.isEmbedded = midi.embeddedSoundFont !== undefined;
    }
}


/**
 * Temporary MIDI data used when the MIDI is not loaded.
 * @type {MIDIData}
 */
export const DUMMY_MIDI_DATA = Object.assign({
    duration: 99999,
    firstNoteOn: 0,
    loop: {
        start: 0,
        end: 123456
    },
    
    lastVoiceEventTick: 123456,
    lyrics: [],
    lyricsTicks: [],
    copyright: "",
    midiPorts: [],
    midiPortChannelOffsets: [],
    tracksAmount: 0,
    tempoChanges: [{ ticks: 0, tempo: 120 }],
    trackNames: [],
    fileName: "NOT_LOADED.mid",
    midiName: "Loading...",
    rawMidiName: new Uint8Array([76, 111, 97, 100, 105, 110, 103, 46, 46, 46]), // "Loading..."
    usedChannelsOnTrack: [],
    timeDivision: 0,
    keyRange: { min: 0, max: 127 },
    isEmbedded: false,
    isKaraokeFile: false,
    isMultiPort: false,
    RMIDInfo: {},
    bankOffset: 0,
    midiNameUsesFileName: false,
    format: 0
}, MIDIData.prototype);