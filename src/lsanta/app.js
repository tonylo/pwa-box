const STORAGE_KEYS = {
  checklist: "pwa-box:lsanta-checklist",
};

const CHECKLIST_ITEMS = [
  "Put out cookies",
  "Fill a glass of milk",
  "Carrots for the reindeer",
  "Hang stockings",
  "Turn off the lights",
];

const TIME_ZONE = "Europe/London";

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const checklistEl = document.getElementById("checklist");
const resetList = document.getElementById("reset-list");
const toast = document.getElementById("toast");
const bellButton = document.getElementById("bell-button");
const cheerButton = document.getElementById("cheer-button");

const pad = (value) => String(value).padStart(2, "0");

const getTimeZoneOffset = (date, timeZone) => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const lookup = (type) => Number(parts.find((part) => part.type === type).value);
  const utcDate = Date.UTC(
    lookup("year"),
    lookup("month") - 1,
    lookup("day"),
    lookup("hour"),
    lookup("minute"),
    lookup("second")
  );
  return (utcDate - date.getTime()) / 60000;
};

const zonedTimeToUtc = (parts, timeZone) => {
  const guess = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0));
  const offset = getTimeZoneOffset(guess, timeZone);
  return new Date(guess.getTime() - offset * 60000);
};

const getUkDateParts = () => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  return {
    year: Number(parts.find((part) => part.type === "year").value),
    month: Number(parts.find((part) => part.type === "month").value),
    day: Number(parts.find((part) => part.type === "day").value),
  };
};

const getNextChristmasArrival = () => {
  const today = getUkDateParts();
  const currentYear = today.year;
  const thisYearArrival = zonedTimeToUtc(
    { year: currentYear, month: 12, day: 25, hour: 3, minute: 0 },
    TIME_ZONE
  ).getTime();
  if (Date.now() <= thisYearArrival) {
    return thisYearArrival;
  }
  return zonedTimeToUtc(
    { year: currentYear + 1, month: 12, day: 25, hour: 3, minute: 0 },
    TIME_ZONE
  ).getTime();
};

const getDefaultArrival = () => getNextChristmasArrival();

const renderCountdown = (timestamp) => {
  const now = Date.now();
  const remaining = timestamp - now;
  const total = Math.max(0, remaining);
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
};

const loadChecklist = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.checklist);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    return {};
  }
};

const saveChecklist = (state) => {
  localStorage.setItem(STORAGE_KEYS.checklist, JSON.stringify(state));
};

const renderChecklist = () => {
  const state = loadChecklist();
  checklistEl.innerHTML = "";

  CHECKLIST_ITEMS.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "checklist-item";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(state[index]);
    input.addEventListener("change", () => {
      const updated = { ...loadChecklist(), [index]: input.checked };
      saveChecklist(updated);
    });

    const label = document.createElement("span");
    label.textContent = item;

    li.appendChild(input);
    li.appendChild(label);
    checklistEl.appendChild(li);
  });
};

const showToast = (message) => {
  toast.textContent = message;
  if (message) {
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
      toast.textContent = "";
    }, 2000);
  }
};

const getAudioContext = () => {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  if (context.state === "suspended") {
    return context.resume().then(() => context);
  }
  return Promise.resolve(context);
};

const ringBell = () => {
  getAudioContext()
    .then((context) => {
      const gain = context.createGain();
      const osc = context.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, context.currentTime);
      gain.gain.setValueAtTime(0.35, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.7);
      osc.connect(gain).connect(context.destination);
      osc.start();
      osc.stop(context.currentTime + 0.7);
      showToast("Ring-ring! The reindeer heard you.");
    })
    .catch(() => {
      showToast("Bell rung!");
    });
};

const cheer = () => {
  getAudioContext()
    .then((context) => {
      const gain = context.createGain();
      gain.gain.setValueAtTime(0.35, context.currentTime);
      gain.connect(context.destination);

      const notes = [392, 330, 262];
      notes.forEach((frequency, index) => {
        const osc = context.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(frequency, context.currentTime);
        const startTime = context.currentTime + index * 0.22;
        osc.connect(gain);
        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
      showToast("Ho-ho-ho!");
    })
    .catch(() => {
      showToast("Ho-ho-ho!");
    });
};

const scheduleRandomCheer = () => {
  const delay = 30000 + Math.random() * 45000;
  window.setTimeout(() => {
    cheer();
    scheduleRandomCheer();
  }, delay);
};

let arrivalTimestamp = getDefaultArrival();
renderChecklist();
renderCountdown(arrivalTimestamp);

resetList.addEventListener("click", () => {
  saveChecklist({});
  renderChecklist();
  showToast("Checklist reset.");
});

bellButton.addEventListener("click", ringBell);
cheerButton.addEventListener("click", cheer);

window.setInterval(() => renderCountdown(arrivalTimestamp), 1000);

scheduleRandomCheer();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      // Ignore service worker registration errors during development.
    });
  });
}
