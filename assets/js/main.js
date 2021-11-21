const songs = [
    {
        name: "1 Phút",
        singers: "Andiez",
        path: "/music/songs/1 Phut - Andiez [Lossless_FLAC].flac",
        img: "/Music/thumbnail/1phut-tb.jpg",
    },
];
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const togglePlayBtn = $(".btn-toggle-play");
const Player = $(".player");
const Seeking = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const timerDuration = $("#timer-duration");
const timerCurrent = $("#timer-current");
const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isSeeking: false,
    currentIndex: 0,
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    songs: [
        {
            name: "1 Phút",
            singers: "Andiez",
            path: "/Music/songs/song1.flac",
            img: "/Music/thumbnail/song1.jpg",
        },
        {
            name: "9420",
            singers: "Mạch Tiểu Đâu",
            path: "/Music/songs/song2.flac",
            img: "/Music/thumbnail/song2.jpg",
        },
        {
            name: "Come and get your love",
            singers: "Redbone",
            path: "/Music/songs/song3.flac",
            img: "/Music/thumbnail/song3.jpg",
        },
        {
            name: "Một bước yêu vạn dặm đau",
            singers: "Mr.Siro",
            path: "/Music/songs/song4.flac",
            img: "/Music/thumbnail/song4.jpg",
        },
        {
            name: "Gió vẫn hát",
            singers: "Long Phạm",
            path: "/Music/songs/song5.flac",
            img: "/Music/thumbnail/song5.jpg",
        },
        {
            name: "Coming Home",
            singers: "Skyler Grey",
            path: "/Music/songs/song6.flac",
            img: "/Music/thumbnail/song6.jpg",
        },
        {
            name: "All out of love",
            singers: "Julienne Taylor",
            path: "/Music/songs/song7.flac",
            img: "/Music/thumbnail/song7.jpg",
        },
        {
            name: "500 miles",
            singers: "Noon",
            path: "/Music/songs/song8.flac",
            img: "/Music/thumbnail/song8.png",
        },
    ],
    handleEvent: function () {
        const cd = $(".cd");
        const _this = this;
        const cdWidth = cd.offsetWidth;
        //Rotata CDthumb
        const CDthumbAnimation = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 15000,
                iterations: Infinity,
            }
        );
        CDthumbAnimation.pause();
        // zoom in/out CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.body.scrollTop;
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
            cd.style.opacity = newWidth / cdWidth;
        };
        // Play pause song
        togglePlayBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        audio.onpause = function () {
            _this.isPlaying = false;
            Player.classList.remove("playing");
            CDthumbAnimation.pause();
        };
        audio.onplay = function () {
            _this.isPlaying = true;
            Player.classList.add("playing");
            CDthumbAnimation.play();
        };
        // Seek input
        Seeking.oninput = function () {
            audio.currentTime = (this.value * audio.duration) / 100;
        };
        audio.onloadeddata = function () {
            Seeking.value = 0;
            let mins = Math.floor(audio.duration / 60);
            let secs = Math.floor(audio.duration % 60);
            if (secs < 10) {
                secs = "0" + String(secs);
            }
            timerDuration.innerHTML = `/${mins}:${secs}`;
            _this.updateTimer();
        };
        audio.ontimeupdate = function () {
            if (audio.duration !== 0) {
                Seeking.value = (audio.currentTime / audio.duration) * 100;
            }
        };
        //Next/Prev Song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
        };
        prevBtn.onclick = function () {
            _this.prevSong();
            audio.play();
        };
        // Random button
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
        };
        // Repeat Button
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };
        // Next when song ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                if (_this.isRandom) {
                    _this.randomSong();
                } else {
                    _this.nextSong();
                }
            }
            audio.play();
        };
        // Click song on playlist
        playlist.onclick = function (e) {
            let inPlaySong = e.target.closest(".song:not(.active");
            if (inPlaySong && !e.target.closest(".option")) {
                _this.currentIndex = Number(inPlaySong.dataset.index);
                _this.loadCurrentSong();
                audio.play();
            }
        };
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song" data-index="${index}">
                    <div class="thumb" style="background-image: url('.${song.img}')" >
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singers}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`;
        });

        playlist.innerHTML = htmls.join("");
    },
    randomSong: function () {
        let newIndex = 0;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        if (this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
        } else {
            this.currentIndex--;
        }
        this.loadCurrentSong();
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(".${this.currentSong.img}")`;
        audio.src = "." + this.currentSong.path;
        this.activeCurrentSong();
        this.scrollActiveSong();
    },
    scrollActiveSong: function () {
        if (this.currentIndex < 2) {
            setTimeout(() => {
                $(".song.active").scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                });
            }, 250);
        } else {
            setTimeout(() => {
                $(".song.active").scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }, 250);
        }
    },
    activeCurrentSong: function () {
        let AllSong = $$(".song");
        for (song of AllSong) {
            song.classList.remove("active");
        }
        let activeSong = AllSong[this.currentIndex];
        activeSong.classList.add("active");
    },
    updateTimer: function () {
        setInterval(function () {
            let mins = Math.floor(audio.currentTime / 60);
            let secs = Math.floor(audio.currentTime % 60);
            if (secs < 10) {
                secs = "0" + String(secs);
            }
            timerCurrent.innerHTML = `${mins}:${secs}`;
        }, 1000);
    },
    start: function () {
        this.render();
        this.defineProperties();
        this.loadCurrentSong();
        this.handleEvent();
    },
};
app.start();
console.log(app.currentSong);
