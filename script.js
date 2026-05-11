/* =========================
   AUTH SIMULATION
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem("wemixUser"));

        const creditsDisplay =
        document.getElementById("creditsDisplay");

    if (creditsDisplay && user) {
        creditsDisplay.textContent =
            `Créditos: ${user.credits}`;
    }

        const membershipBadge =
        document.getElementById("membershipBadge");

    if (membershipBadge && user) {

        const membership =
            user.membership || "FREE";

        membershipBadge.textContent =
            membership.toUpperCase();

        membershipBadge.classList.remove(
            "free",
            "plus",
            "pro",
            "admin"
        );

        membershipBadge.classList.add(
            membership.toLowerCase()
        );
    }

        /* =========================
    PROFILE DATA
    ========================= */

    const profileName =
        document.getElementById("profileName");

    if (profileName && user) {

        profileName.textContent =
            user.djName;

    }

    const publicPages = ["login.html", "register.html", "home.html", "onboarding.html"];

    const currentPage = window.location.pathname.split("/").pop();
    

    if (!user && !publicPages.includes(currentPage)) {
        window.location.href = "login.html";
    }

    if (user && (currentPage === "login.html" || currentPage === "register.html")) {
        window.location.href = "index.html";
    }

    if (currentPage === "onboarding.html" && !user) {
        window.location.href = "login.html";
    }

    /* =========================
   DYNAMIC NAVIGATION
========================= */

const mainNav =
    document.getElementById("mainNav");

if (mainNav && user) {

    // ADMIN
    if (user.membership === "ADMIN") {

        mainNav.innerHTML = `
            <a href="index.html">
                Explorar
            </a>

            <a href="admin.html">
                Admin
            </a>
        `;

    }

    // FREE
    else if (user.membership === "FREE") {

        mainNav.innerHTML = `
            <a href="index.html">
                Explorar
            </a>

            <a href="home.html">
                Precios
            </a>

            <a href="profile.html">
                Perfil
            </a>
        `;

    }

    // PLUS / PRO
    else {

        mainNav.innerHTML = `
            <a href="index.html">
                Explorar
            </a>

            <a href="downloads.html">
                Mis Descargas
            </a>

            <a href="upload.html">
                Subir Track
            </a>

            <a href="dashboard.html">
                Dashboard
            </a>

            <a href="profile.html">
                Perfil
            </a>
        `;

    }

}

/* =========================
   PAGE PERMISSIONS
========================= */

// FREE BLOCKED PAGES
const premiumPages = [
    "upload.html",
    "downloads.html",
    "dashboard.html"
];

// ADMIN ONLY
const adminPages = [
    "admin.html"
];

// FREE USER
if (
    user &&
    user.membership === "FREE" &&
    premiumPages.includes(currentPage)
) {

    window.location.href = "home.html";

}

// NON ADMIN
if (
    user &&
    user.membership !== "ADMIN" &&
    adminPages.includes(currentPage)
) {

    window.location.href = "index.html";

}

/* =========================
   ROLE UI
========================= */

const headerRight =
    document.getElementById("headerRight");

// ADMIN UI
if (
    user &&
    user.membership === "ADMIN"
) {

    if (headerRight) {

        headerRight.innerHTML = `
            <span class="membership-badge admin">
                ADMIN
            </span>
        `;

    }

}



    const container = document.getElementById("tracksContainer");

if (container) {

    const allTracks = JSON.parse(localStorage.getItem("wemixTracks")) || {};
    const tracks = allTracks[user?.email] || [];

    const trackCount = tracks.length;

    const trackCountEl = document.getElementById("trackCount");

    if (trackCountEl) {
        trackCountEl.textContent = trackCount;
    }

    const totalDownloads = tracks.reduce((acc, track) => {
        return acc + (track.downloads || 0);
    }, 0);

    const downloadsEl = document.getElementById("downloadsCount");

    if (downloadsEl) {
        downloadsEl.textContent = totalDownloads;
    }

    const followers = 100 + trackCount * 5;

    const followersEl = document.getElementById("followersCount");

    if (followersEl) {
        followersEl.textContent = followers;
    }

    // 🔥 REPUTACIÓN DINÁMICA

    const publishedTracks = tracks.filter(track => track.status === "Publicado").length;

    let reputation = "Newbie";

    if (trackCount >= 3) {
        reputation = "Pro Creator";
    }

    if (trackCount >= 10) {
        reputation = "Elite";
    }

    let progress = 0;

    if (trackCount < 3) {
        progress = (trackCount / 3) * 100;
    } else if (trackCount < 10) {
        progress = ((trackCount - 3) / 7) * 100;
    } else {
        progress = 100;
    }

    const badgeEl = document.getElementById("reputationBadge");
    const progressEl = document.getElementById("reputationProgress");

    if (badgeEl) {
        badgeEl.textContent = reputation;

        badgeEl.classList.remove("newbie", "pro", "elite");

        if (reputation === "Newbie") {
            badgeEl.classList.add("newbie");
        } else if (reputation === "Pro Creator") {
            badgeEl.classList.add("pro");
        } else {
            badgeEl.classList.add("elite");
        }
    }

    if (progressEl) {
        if (reputation === "Elite") {
            progressEl.textContent = "Nivel máximo alcanzado";
        } else if (reputation === "Pro Creator") {
            progressEl.textContent = `${Math.round(progress)}% hacia Elite`;
        } else {
            progressEl.textContent = `${Math.round(progress)}% hacia Pro`;
        }
    }

        const fillEl = document.getElementById("reputationFill");

        if (fillEl) {
            fillEl.style.width = `${progress}%`;
        }



    if (tracks.length === 0) {
        container.innerHTML = "<p>No has subido ningún track todavía.</p>";
        return;
    }

    

    tracks.forEach(track => {

        let statusClass = "pending";

        if (track.status === "Publicado") {
            statusClass = "published";
        } else if (track.status === "Rechazado") {
            statusClass = "rejected";
        }

        const trackEl = document.createElement("div");
        trackEl.classList.add("track-row");

        const isAdmin =
            user.membership === "ADMIN";
        const showActions = isAdmin && track.status === "En revisión";

trackEl.innerHTML = `

    <button 
        class="btn-play"
        data-audio="${track.audio}"
        data-title="${track.title}"
        data-type="${track.type}"
        data-bpm="${track.bpm}"
        data-key="${track.key}"
    >
        ▶
    </button>

    <span class="track-title">
        ${track.title}
    </span>

    <span>
        ${track.type}
    </span>

    <span>
        ${track.genre}
    </span>

    <span>
        ${track.bpm} BPM
    </span>

    <span>
        ${track.key}
    </span>



    

    <span class="status ${statusClass}">
        ${track.status}
    </span>

`;

        if (showActions) {
            const approveBtn = trackEl.querySelector(".approve-btn");
            const rejectBtn = trackEl.querySelector(".reject-btn");

            approveBtn.addEventListener("click", () => {
                track.status = "Publicado";
                localStorage.setItem("wemixTracks", JSON.stringify(allTracks));
                location.reload();
            });

            rejectBtn.addEventListener("click", () => {
                track.status = "Rechazado";
                localStorage.setItem("wemixTracks", JSON.stringify(allTracks));
                location.reload();
            });
        }

        container.appendChild(trackEl);
    });

}

});

/* =========================
   LOGIN
========================= */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", (e) => {

        e.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        // USUARIOS
        const users =
            JSON.parse(localStorage.getItem("wemixUsers")) || [];

        // BUSCAR USUARIO
        const user = users.find(user =>
            user.email === email &&
            user.password === password
        );

        if (!user) {
            alert("Email o contraseña incorrectos");
            return;
        }

        // LOGIN
        localStorage.setItem(
            "wemixUser",
            JSON.stringify(user)
        );

        window.location.href = "index.html";

    });

}


// LOGOUT CONFIRMATION
const logoutBtn = document.getElementById("logoutBtn");
const logoutModal = document.getElementById("logoutModal");
const cancelLogout = document.getElementById("cancelLogout");
const confirmLogout = document.getElementById("confirmLogout");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {
        logoutModal.classList.add("active");
    });

    cancelLogout.addEventListener("click", () => {
        logoutModal.classList.remove("active");
    });

    confirmLogout.addEventListener("click", () => {
        localStorage.removeItem("wemixUser");
        window.location.href = "login.html";
    });

}



/* =========================
   REGISTER
========================= */

const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {

    registerBtn.addEventListener("click", (e) => {

        e.preventDefault();

        const djName =
            document.getElementById("djName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const termsCheck =
            document.getElementById("termsCheck");

        // VALIDACIONES

        if (!djName || !email || !password) {
            alert("Completa todos los campos");
            return;
        }

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        if (!termsCheck.checked) {
            alert("Debes aceptar las normas");
            return;
        }

        // OBTENER USUARIOS
        let users =
            JSON.parse(localStorage.getItem("wemixUsers")) || [];

        // EMAIL DUPLICADO
        const existingUser = users.find(user =>
            user.email === email
        );

        if (existingUser) {
            alert("Ya existe una cuenta con este email");
            return;
        }

        // NUEVO USUARIO
        const newUser = {
            id: Date.now(),

            djName,
            email,
            password,

            role: "user",

            membership: "FREE",

            credits: 25,

            earnings: 0,

            followers: 0,

            uploadedTracks: 0,

            downloads: 0,

            createdAt: new Date().toISOString()
        };

        // GUARDAR USUARIO
        users.push(newUser);

        localStorage.setItem(
            "wemixUsers",
            JSON.stringify(users)
        );

        // LOGIN AUTOMÁTICO
        localStorage.setItem(
            "wemixUser",
            JSON.stringify(newUser)
        );

        window.location.href = "onboarding.html";

    });

}


// HEADER SCROLL EFFECT
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});


document.addEventListener("DOMContentLoaded", () => {

    const submitBtn = document.getElementById("submitTrack");
    const uploadForm = document.getElementById("upload-form");
    const uploadSuccess = document.getElementById("upload-success");

    if (!submitBtn) return;

    const fileInput = document.getElementById("audioFile");
const keyInput =
    document.getElementById("trackKey");

const keyError =
    document.getElementById("keyError");

const validKeys = [
    "1A","2A","3A","4A","5A","6A",
    "7A","8A","9A","10A","11A","12A",
    "1B","2B","3B","4B","5B","6B",
    "7B","8B","9B","10B","11B","12B"
];

if (keyInput) {

    keyInput.addEventListener("input", () => {

        let value =
            keyInput.value.toUpperCase();

        value = value.replace(/[^0-9AB]/g, "");

        keyInput.value = value;

        if (
            value.length >= 2 &&
            !validKeys.includes(value)
        ) {

            keyInput.classList.add("input-invalid");

            keyError.classList.remove("hidden");

        } else {

            keyInput.classList.remove("input-invalid");

            keyError.classList.add("hidden");

        }

    });

}

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Obtener datos del formulario
        const title = document.getElementById("trackTitle").value;
        const type = document.getElementById("trackType").value;
        const genre = document.getElementById("trackGenre").value;
        const bpm = document.getElementById("trackBpm").value;
        const key = document.getElementById("trackKey").value;
        const notes = document.getElementById("trackNotes").value;


        const fileName = fileInput.files[0]?.name || null;

        // Usuario actual
        const user = JSON.parse(localStorage.getItem("wemixUser"));

        if (!user) return;

        // Obtener todos los tracks (por usuario)
        let allTracks = JSON.parse(localStorage.getItem("wemixTracks")) || {};

        if (!allTracks[user.email]) {
            allTracks[user.email] = [];
        }

        // Crear nuevo track

        let creditCost = 1;

        if (type === "Extended") {
            creditCost = 2;
        } else if (type === "Edit") {
            creditCost = 3;
        } else if (type === "Mashup") {
            creditCost = 5;
        }
        
        const newTrack = {
            title,
            djName: user.djName,
            type,
            genre,
            bpm,
            key,
            notes,
            fileName,
            creditCost,
            audio: [
                "audio/demo1.mp3",
                "audio/demo2.mp3",
                "audio/demo3.mp3"
            ][Math.floor(Math.random() * 3)],
            status: "En revisión",
            downloads: Math.floor(Math.random() * 20),
            date: new Date().toISOString()
        };

        // Guardar
        allTracks[user.email].push(newTrack);
        localStorage.setItem("wemixTracks", JSON.stringify(allTracks));

        // Mostrar estado de éxito
        uploadForm.classList.add("hidden");
        uploadSuccess.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});

document.addEventListener("DOMContentLoaded", () => {

    const submitBtn = document.getElementById("submitTrack");
    const uploadForm = document.getElementById("upload-form");
    const uploadSuccess = document.getElementById("upload-success");

    const rightsCheck = document.getElementById("rightsCheck");
    const reviewCheck = document.getElementById("reviewCheck");

    if (!submitBtn) return;

    const user =
    JSON.parse(localStorage.getItem("wemixUser"));

    const uploadLocked =
    document.getElementById("uploadLocked");

const uploadFormContainer =
    document.getElementById("upload-form");

if (
    user &&
    user.membership === "FREE"
) {

    if (uploadLocked) {
        uploadLocked.classList.remove("hidden");
    }

    if (uploadFormContainer) {
        uploadFormContainer.classList.add("hidden");
    }

    return;
}

            const fileInput = document.getElementById("audioFile");
            const fileInfo = document.getElementById("fileInfo");

if (fileInput && fileInfo) {

    fileInput.addEventListener("change", () => {

        if (fileInput.files.length > 0) {
            fileInfo.textContent = fileInput.files[0].name;
        } else {
            fileInfo.textContent = "No hay archivo seleccionado";
        }

    });

}

    // Activar botón solo si ambos están marcados
    function validateChecks() {
        if (rightsCheck.checked && reviewCheck.checked) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    rightsCheck.addEventListener("change", validateChecks);
    reviewCheck.addEventListener("change", validateChecks);

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (submitBtn.disabled) return;

        uploadForm.classList.add("hidden");
        uploadSuccess.classList.remove("hidden");

        uploadSuccess.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });

});


/* =========================
   DASHBOARD
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const dashboard = document.querySelector(".dashboard");
    if (!dashboard) return;

    const user = JSON.parse(localStorage.getItem("wemixUser"));
    if (!user) return;

    const allTracks = JSON.parse(localStorage.getItem("wemixTracks")) || {};
    let tracks = [];

    if (user.membership === "ADMIN") {

        Object.values(allTracks).forEach(userTracks => {
            tracks = tracks.concat(userTracks);
        });

    } else {

        tracks = allTracks[user.email] || [];

    }

    // 📊 TRACKS PUBLICADOS
    const published = tracks.filter(t => t.status === "Publicado").length;
    document.getElementById("publishedCount").textContent = published;

    // 🟡 EN REVISIÓN
    const review = tracks.filter(t => t.status === "En revisión").length;
    document.getElementById("reviewCount").textContent = review;

    // 📥 DESCARGAS
    const totalDownloads = tracks.reduce((acc, t) => acc + (t.downloads || 0), 0);
    document.getElementById("downloadsTotal").textContent = totalDownloads;

    // 💰 GANANCIAS ESTIMADAS

    const earnings = tracks.reduce((acc, track) => {

        const downloads = track.downloads || 0;

        const earnedPerDownload =
            (track.creditCost || 0) * 0.08;

        return acc + (downloads * earnedPerDownload);

    }, 0);

    document.getElementById("creditsTotal").textContent =
        `${earnings.toFixed(1)}€`;

    // 🔥 ACTIVIDAD RECIENTE
    const activityContainer = document.getElementById("activityContainer");

    if (activityContainer) {

        const sorted = [...tracks].sort((a, b) => new Date(b.date) - new Date(a.date));
        const recent = sorted.slice(0, 5);

        activityContainer.innerHTML = "";

        if (recent.length === 0) {
            activityContainer.innerHTML = "<p>No hay actividad todavía.</p>";
            return;
        }

        recent.forEach(track => {

            let statusClass = "pending";

            if (track.status === "Publicado") statusClass = "published";
            if (track.status === "Rechazado") statusClass = "rejected";

            const row = document.createElement("div");
            row.classList.add("activity-row");

            row.innerHTML = `
                <span>${track.title}</span>
                <span class="activity-status ${statusClass}">${track.status}</span>
                <span>${new Date(track.date).toLocaleDateString()}</span>
            `;

            activityContainer.appendChild(row);
        });
    }

});


/* =========================
   EXPLORADOR (BIEN HECHO)
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("explorerList");
    if (!container) return;

    const allTracks = JSON.parse(localStorage.getItem("wemixTracks")) || {};

    let tracks = [];

    Object.values(allTracks).forEach(userTracks => {
        tracks = tracks.concat(userTracks);
    });

    const publishedTracks = tracks.filter(t => t.status === "Publicado");

    if (publishedTracks.length === 0) {
        container.innerHTML = "<p>No hay tracks disponibles.</p>";
        return;
    }

    container.innerHTML = "";

    publishedTracks.forEach(track => {

        // USER
const currentUser =
    JSON.parse(localStorage.getItem("wemixUser"));

// DOWNLOADS
const allDownloads =
    JSON.parse(localStorage.getItem("wemixDownloads")) || {};

const userDownloads =
    allDownloads[currentUser?.email] || [];

// YA DESCARGADO
const alreadyDownloaded =
    userDownloads.some(
        downloadedTrack =>
            downloadedTrack.title === track.title
    );

    const row = document.createElement("div");
    row.classList.add("track-row");

    row.innerHTML = `
        <button 
            class="btn-play"
            data-audio="${track.audio}"
            data-title="${track.title}"
            data-type="${track.type}"
            data-bpm="${track.bpm}"
            data-key="${track.key}"
        >
            ▶
        </button>

        <div class="track-title">
            <span>${track.title}</span>

            <a href="profile.html" class="track-creator">
                DJ ${track.djName || "User"}
                <span class="creator-badge pro">PRO</span>
            </a>
        </div>

        <span>${track.type}</span>
        <span>${track.genre}</span>
        <span>${track.bpm} BPM</span>
        <span>${track.key}</span>

<button class="${
    alreadyDownloaded
        ? "btn-redownload"
        : "btn-download"
}">
    ${
        alreadyDownloaded
            ? "Descargar"
            : `${track.creditCost} créditos`
    }
</button>
        `;
    const downloadBtn =
        row.querySelector(".btn-download, .btn-redownload");
    downloadBtn.addEventListener("click", () => {

if (alreadyDownloaded) {

    fetch(track.audio)
        .then(response => response.blob())
        .then(blob => {

            const blobUrl =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = blobUrl;

            link.download =
                `${track.title}.mp3`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(blobUrl);

        });

    return;
}



    // USUARIO ACTUAL
    let currentUser =
        JSON.parse(localStorage.getItem("wemixUser"));

    // SIN CRÉDITOS
    if (currentUser.credits < track.creditCost) {
        alert("No tienes créditos suficientes");
        return;
    }

    // RESTAR CRÉDITOS
    currentUser.credits -= track.creditCost;

    // ACTUALIZAR USUARIO ACTUAL
    localStorage.setItem(
        "wemixUser",
        JSON.stringify(currentUser)
    );

    // ACTUALIZAR EN LISTA DE USUARIOS
    let users =
        JSON.parse(localStorage.getItem("wemixUsers")) || [];

    users = users.map(user => {

        if (user.email === currentUser.email) {
            return currentUser;
        }

        return user;
    });

    localStorage.setItem(
        "wemixUsers",
        JSON.stringify(users)
    );

    // GUARDAR DESCARGA
    let downloads =
        JSON.parse(localStorage.getItem("wemixDownloads")) || {};

    if (!downloads[currentUser.email]) {
        downloads[currentUser.email] = [];
    }



    downloads[currentUser.email].push(track);

    localStorage.setItem(
        "wemixDownloads",
        JSON.stringify(downloads)
    );

    // SUMAR DOWNLOAD AL TRACK
    track.downloads =
        (track.downloads || 0) + 1;

    localStorage.setItem(
        "wemixTracks",
        JSON.stringify(allTracks)
    );

    // ACTUALIZAR UI
    const creditsDisplay =
        document.getElementById("creditsDisplay");

    if (creditsDisplay) {
        creditsDisplay.textContent =
            `Créditos: ${currentUser.credits}`;
    }

fetch(track.audio)
    .then(response => response.blob())
    .then(blob => {

        const blobUrl =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = blobUrl;

        link.download =
            `${track.title}.mp3`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(blobUrl);

    });

    alert("Track descargado correctamente");

});

    container.appendChild(row);
});

});



/* =========================
   AUDIO PLAYER
========================= */

const progressFill = document.getElementById("playerProgressFill");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const playerDetails = document.getElementById("playerDetails");

const audio = document.getElementById("mainAudio");
const player = document.getElementById("audioPlayer");

const playerTrack = document.getElementById("playerTrack");
const playerArtist = document.getElementById("playerArtist");

const playerToggle = document.getElementById("playerToggle");

let currentButton = null;

// PLAY BUTTONS
document.addEventListener("click", (e) => {

    const playBtn = e.target.closest(".btn-play");

    if (!playBtn) return;

    const audioSrc = playBtn.dataset.audio;
    const trackTitle = playBtn.dataset.title;

    // MISMO TRACK → pause/play
    if (audio.src.includes(audioSrc)) {

        if (audio.paused) {
            audio.play();
            playBtn.textContent = "❚❚";
            playerToggle.textContent = "❚❚";
        } else {
            audio.pause();
            playBtn.textContent = "▶";
            playerToggle.textContent = "▶";
        }

        return;
    }

    // RESET botón anterior
    if (currentButton) {
        currentButton.textContent = "▶";
    }

    currentButton = playBtn;

    // CARGAR TRACK
    audio.src = audioSrc;

    audio.play();

    // UI
    playBtn.textContent = "❚❚";

    playerTrack.textContent = trackTitle;
    playerDetails.textContent =
    `DJ User • ${playBtn.dataset.type} • ${playBtn.dataset.bpm} BPM • ${playBtn.dataset.key}`;
    playerToggle.textContent = "❚❚";

    player.style.display = "flex";
});

if (playerToggle && audio) {

    // PLAYER TOGGLE
    playerToggle.addEventListener("click", () => {

        if (audio.paused) {

            audio.play();

            playerToggle.textContent = "❚❚";

            if (currentButton) {
                currentButton.textContent = "❚❚";
            }

        } else {

            audio.pause();

            playerToggle.textContent = "▶";

            if (currentButton) {
                currentButton.textContent = "▶";
            }
        }
    });

    // TRACK FINISHED
    audio.addEventListener("ended", () => {

        playerToggle.textContent = "▶";

        if (currentButton) {
            currentButton.textContent = "▶";
        }
    });

    // UPDATE PROGRESS
    audio.addEventListener("timeupdate", () => {

        const progress =
            (audio.currentTime / audio.duration) * 100;

        progressFill.style.width = `${progress}%`;

        // CURRENT TIME
        const currentMinutes =
            Math.floor(audio.currentTime / 60);

        const currentSeconds =
            Math.floor(audio.currentTime % 60)
                .toString()
                .padStart(2, "0");

        currentTimeEl.textContent =
            `${currentMinutes}:${currentSeconds}`;

        // DURATION
        const durationMinutes =
            Math.floor(audio.duration / 60);

        const durationSeconds =
            Math.floor(audio.duration % 60)
                .toString()
                .padStart(2, "0");

        durationEl.textContent =
            `${durationMinutes}:${durationSeconds}`;
    });

}

/* =========================
   DOWNLOADS PAGE
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const downloadsList =
        document.getElementById("downloadsList");

    if (!downloadsList) return;

    // USER
    const user =
        JSON.parse(localStorage.getItem("wemixUser"));

    if (!user) return;

    // DOWNLOADS
    const allDownloads =
        JSON.parse(localStorage.getItem("wemixDownloads")) || {};

    const downloads =
        allDownloads[user.email] || [];

    // EMPTY
    if (downloads.length === 0) {

        downloadsList.innerHTML = `
            <p>No has descargado ningún track todavía.</p>
        `;

        return;
    }

    downloadsList.innerHTML = "";

    downloads.forEach(track => {

        const row = document.createElement("div");

        row.classList.add("track-row");

        // FECHA
        const date = new Date(track.date);

        const formattedDate =
            date.toLocaleDateString("es-ES");

        row.innerHTML = `
            <button 
                class="btn-play"
                data-audio="${track.audio}"
                data-title="${track.title}"
                data-type="${track.type}"
                data-bpm="${track.bpm}"
                data-key="${track.key}"
            >
                ▶
            </button>

            <div class="track-title">

                <span>${track.title}</span>

                <a href="profile.html" class="track-creator">
                    DJ ${track.djName || "User"}

                    <span class="creator-badge pro">
                        PRO
                    </span>
                </a>

            </div>

            <span>${track.type}</span>
            <span>${track.genre}</span>
            <span>${track.bpm} BPM</span>
            <span>${track.key}</span>

            <span>${formattedDate}</span>

            <button class="btn-redownload">
                Descargar
            </button>
        `;

        downloadsList.appendChild(row);

        const redownloadBtn =
    row.querySelector(".btn-redownload");

redownloadBtn.addEventListener("click", () => {

    fetch(track.audio)
        .then(response => response.blob())
        .then(blob => {

            const blobUrl =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = blobUrl;

            link.download =
                `${track.title}.mp3`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(blobUrl);

        });

});

    });

});

/* =========================
   MEMBERSHIP UPGRADES
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const freeBtn =
    document.getElementById("upgradeFree");

    const plusBtn =
        document.getElementById("upgradePlus");

    const proBtn =
        document.getElementById("upgradePro");

    if (!plusBtn && !proBtn) return;

    // USER
    let user =
        JSON.parse(localStorage.getItem("wemixUser"));

    // NO LOGIN
    if (!user) return;

    // FREE
    if (freeBtn) {

        freeBtn.addEventListener("click", () => {

            user.membership = "FREE";
            user.credits = 0;

            let users =
    JSON.parse(localStorage.getItem("wemixUsers")) || [];

users = users.map(u => {

    if (u.email === user.email) {
        return user;
    }

    return u;

});

localStorage.setItem(
    "wemixUsers",
    JSON.stringify(users)
);

            localStorage.setItem(
                "wemixUser",
                JSON.stringify(user)
            );

            alert(
                "Tu cuenta ahora es FREE"
            );

            location.reload();

        });

    }

    // PLUS
    if (plusBtn) {

        plusBtn.addEventListener("click", () => {

            user.membership = "PLUS";
            user.credits = 120;
            let users =
    JSON.parse(localStorage.getItem("wemixUsers")) || [];

users = users.map(u => {

    if (u.email === user.email) {
        return user;
    }

    return u;

});

localStorage.setItem(
    "wemixUsers",
    JSON.stringify(users)
);

            localStorage.setItem(
                "wemixUser",
                JSON.stringify(user)
            );

            alert(
                "Tu cuenta ha sido actualizada a PLUS"
            );

            location.reload();

        });

    }

    // PRO
    if (proBtn) {

        proBtn.addEventListener("click", () => {

            user.membership = "PRO";
            user.credits = 300;

            let users =
    JSON.parse(localStorage.getItem("wemixUsers")) || [];

users = users.map(u => {

    if (u.email === user.email) {
        return user;
    }

    return u;

});

localStorage.setItem(
    "wemixUsers",
    JSON.stringify(users)
);

            localStorage.setItem(
                "wemixUser",
                JSON.stringify(user)
            );

            alert(
                "Tu cuenta ha sido actualizada a PRO"
            );

            location.reload();

        });

    }

});

/* =========================
   ADMIN PANEL
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const container =
        document.getElementById("adminTracks");

    if (!container) return;

    const user =
        JSON.parse(localStorage.getItem("wemixUser"));

    if (!user) return;

    // SOLO ADMIN
    if (user.membership !== "ADMIN") {

        container.innerHTML =
            "<p>No tienes permisos.</p>";

        return;
    }

    // TRACKS
    const allTracks =
        JSON.parse(localStorage.getItem("wemixTracks")) || {};

    let tracks = [];

    Object.values(allTracks).forEach(userTracks => {
        tracks = tracks.concat(userTracks);
    });

    // EMPTY
    if (tracks.length === 0) {

        container.innerHTML =
            "<p>No hay tracks.</p>";

        return;
    }

    container.innerHTML = "";

    tracks.forEach(track => {

        let statusClass = "pending";

        if (track.status === "Publicado") {
            statusClass = "published";
        }

        if (track.status === "Rechazado") {
            statusClass = "rejected";
        }

        const trackEl =
            document.createElement("div");

        trackEl.classList.add("track-row");

        const showActions =
            track.status === "En revisión";

        trackEl.innerHTML = `

    <button 
        class="btn-play"
        data-audio="${track.audio}"
        data-title="${track.title}"
        data-type="${track.type}"
        data-bpm="${track.bpm}"
        data-key="${track.key}"
    >
        ▶
    </button>

    <span class="track-title">
        ${track.title}
    </span>

    <span class="track-user">
        DJ ${track.djName || "User"}
    </span>

    <span class="track-info">
        ${track.type} •
        ${track.genre} •
        ${track.bpm} BPM •
        ${track.key}
    </span>

    <span class="track-actions">

        ${
            showActions
            ? `
                <button class="approve-btn">
                    ✔
                </button>

                <button class="reject-btn">
                    ✖
                </button>

                <button class="delete-btn">
                    🗑
                </button>
            `
            : "-"
        }

    </span>

    <span class="status ${statusClass}">
        ${track.status}
    </span>

`;

        // APPROVE
        const approveBtn =
            trackEl.querySelector(".approve-btn");

        if (approveBtn) {

            approveBtn.addEventListener("click", () => {

                track.status = "Publicado";

                localStorage.setItem(
                    "wemixTracks",
                    JSON.stringify(allTracks)
                );

                location.reload();

            });

        }

        // REJECT
        const rejectBtn =
            trackEl.querySelector(".reject-btn");

        if (rejectBtn) {

            rejectBtn.addEventListener("click", () => {

                track.status = "Rechazado";

                localStorage.setItem(
                    "wemixTracks",
                    JSON.stringify(allTracks)
                );

                location.reload();

            });

        }

        // DELETE
const deleteBtn =
    trackEl.querySelector(".delete-btn");

if (deleteBtn) {

    deleteBtn.addEventListener("click", () => {

        const confirmed =
            confirm("¿Eliminar track?");

        if (!confirmed) return;

        Object.keys(allTracks).forEach(email => {

            allTracks[email] =
                allTracks[email].filter(
                    t => t !== track
                );

        });

        localStorage.setItem(
            "wemixTracks",
            JSON.stringify(allTracks)
        );

        location.reload();

    });

}

        container.appendChild(trackEl);

    });

});