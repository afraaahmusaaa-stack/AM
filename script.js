/*
  HOW THIS WORKS (in short)
  - addEventListener("keydown"/"keyup", fn): tells the page "when a key is pressed/released, run fn".
  - e (the event object) holds details about what happened; e.key is the key's name, e.g. "d".
  - document.querySelector('[data-key="d"]') finds the piano key whose data-key is "d".
  - classList.add("active") / classList.remove("active") turns the .active CSS style on/off.
  - playNote(frequency) makes a sound at that pitch (Hz).
*/

// ===== 1. KEY MAP: keyboard letter -> note name + frequency (Hz) =====
const notes = {
  a: { name: "Do",  frequency: 262 },  // C
  s: { name: "Re",  frequency: 294 },  // D
  d: { name: "Mi",  frequency: 330 },  // E
  f: { name: "Fa",  frequency: 349 },  // F
  g: { name: "Sol", frequency: 392 },  // G
  h: { name: "La",  frequency: 440 },  // A
  j: { name: "Ti",  frequency: 494 },  // B
  k: { name: "Do",  frequency: 523 }   // C (high)
};

// ===== 2. FIND THE STATUS MESSAGE =====
const status = document.querySelector("#status");

// ===== 3. SOUND HELPER =====
// Makes a note with the browser's built-in Web Audio API (no sound files needed).
let audioContext = null; // created on the first key press (browsers require a user action)

function playNote(frequency) {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.value = frequency;

  // Start at a comfortable volume, then fade out smoothly over 1 second
  volume.gain.setValueAtTime(0.3, audioContext.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);

  oscillator.connect(volume);
  volume.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 1);
}

// ===== 4. KEYDOWN: when a key is PRESSED =====
document.addEventListener("keydown", function (e) {
  // console.log(e.key);  // <-- Step 4: uncomment to test, then press keys with DevTools open (F12)

  if (!e.key) return;                              // safety: some events have no key
  if (e.ctrlKey || e.metaKey || e.altKey) return;  // leave shortcuts like Ctrl+A alone

  const key = e.key.toLowerCase();                 // so "a" and "A" (Caps Lock) both work

  if (!notes[key]) return;                         // not in the map (Q, 1, Space...) -> do nothing
  if (e.repeat) return;                            // ignore repeats while the key is held down

  const pianoKey = document.querySelector('[data-key="' + key + '"]');
  pianoKey.classList.add("active");                // light the key up

  playNote(notes[key].frequency);                  // play the sound
  status.textContent = key.toUpperCase() + " is pressed: key lights up + plays " + notes[key].name;
});

// ===== 5. KEYUP: when a key is RELEASED =====
document.addEventListener("keyup", function (e) {
  if (!e.key) return;

  const key = e.key.toLowerCase();

  if (!notes[key]) return;                         // not in the map -> do nothing

  const pianoKey = document.querySelector('[data-key="' + key + '"]');
  pianoKey.classList.remove("active");             // turn the light off

  status.textContent = "Press a key to start...";
});
