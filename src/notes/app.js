const STORAGE_KEY = "pwa-box:notes";

const noteText = document.getElementById("note-text");
const saveButton = document.getElementById("save-note");
const newButton = document.getElementById("new-note");
const clearButton = document.getElementById("clear-notes");
const notesList = document.getElementById("notes-list");
const status = document.getElementById("status");

const formatDate = (value) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const loadNotes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

const saveNotes = (notes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

const setStatus = (message) => {
  status.textContent = message;
  if (message) {
    window.clearTimeout(setStatus.timeoutId);
    setStatus.timeoutId = window.setTimeout(() => {
      status.textContent = "";
    }, 2000);
  }
};

const renderNotes = () => {
  const notes = loadNotes();
  notesList.innerHTML = "";

  if (notes.length === 0) {
    const empty = document.createElement("li");
    empty.className = "note-card";
    empty.textContent = "No notes yet. Add one above.";
    notesList.appendChild(empty);
    return;
  }

  notes.forEach((note, index) => {
    const card = document.createElement("li");
    card.className = "note-card";

    const text = document.createElement("div");
    text.textContent = note.text;

    const meta = document.createElement("div");
    meta.className = "note-meta";
    meta.textContent = `Saved ${formatDate(note.createdAt)}`;

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const deleteButton = document.createElement("button");
    deleteButton.className = "ghost";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      const updated = loadNotes().filter((_, itemIndex) => itemIndex !== index);
      saveNotes(updated);
      renderNotes();
      setStatus("Note deleted.");
    });

    actions.appendChild(deleteButton);

    card.appendChild(text);
    card.appendChild(meta);
    card.appendChild(actions);
    notesList.appendChild(card);
  });
};

const addNote = () => {
  const text = noteText.value.trim();
  if (!text) {
    setStatus("Add some text first.");
    return;
  }

  const notes = loadNotes();
  notes.unshift({ text, createdAt: Date.now() });
  saveNotes(notes);
  noteText.value = "";
  renderNotes();
  setStatus("Saved.");
};

saveButton.addEventListener("click", addNote);
newButton.addEventListener("click", () => {
  noteText.value = "";
  noteText.focus();
  setStatus("Ready for a new note.");
});
clearButton.addEventListener("click", () => {
  saveNotes([]);
  renderNotes();
  setStatus("All notes cleared.");
});

renderNotes();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      // Service worker registration failures can be ignored during dev.
    });
  });
}
