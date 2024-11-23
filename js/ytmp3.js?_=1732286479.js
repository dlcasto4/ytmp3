var parameters, gA = !1,
    gBackend = String.fromCharCode(117, 109, 109, 110, 46, 110, 117),
    gDownload = !1,
    gFormat = "mp3",
    gVideo = !1;

function create(e) {
    return document.createElement(e)
}

function id(e) {
    return document.getElementById(e)
}

function select(e) {
    return document.querySelectorAll(e)
}

function setCookie(e) {
    var t = new Date;
    t.setTime(t.getTime() + 6048e5);
    document.cookie = "theme=" + e + "; SameSite=Lax; expires=" + t.toUTCString() + "; path=/; domain=ytmp3.la", window.location.reload()
}

function k() {
    for (var e = "", t = 0; t < gC[2].split(",").length; t++) e += (0 < gC[1] ? gC[0].split("").reverse().join("") : gC[0])[gC[2].split(",")[t]];
    return e
}

function api(t, r, o, n) {
    gA = "b", o || (o = !0, select("#progress span")[0].innerHTML = "restarting conversion");
    var e = new XMLHttpRequest;
    e.onreadystatechange = function() {
        if (4 == this.readyState && 200 == this.status) {
            var e = JSON.parse(this.responseText);
            switch (e.status) {
                case "fail":
                    error(3, t, !0);
                    break;
                case "ok":
                    r || (r = !0, select("form div:first-of-type")[0].innerHTML = e.title), download(e.link);
                    break;
                case "processing":
                    0 < e.title.length && !r && (r = !0, select("form div:first-of-type")[0].innerHTML = e.title), 0 == n && (n++, select("#progress span")[0].innerHTML = "converting video"), window.setTimeout(function() {
                        api(t, r, o, n)
                    }, 9e3)
            }
        }
    };
    var i = String.fromCharCode(114, 97, 112, 105, 100, 97, 112, 105);
    e.open("GET", "https://youtube-mp36.p." + i + ".com/dl?id=" + gVideo + "&_=" + Math.random(), !0), e.setRequestHeader("x-" + i + "-host", gE[0] + i + ".com"), e.setRequestHeader("x-" + i + "-key", gE[1]), e.send()
}

function error(e, t, r) {
    if (3 == e && !r) return api(t, !1, !1, 0), !1;
    var o = ["An backend error occurred.", "The video is blacklisted and can not be converted.", "The video is longer than 60 min (maximum supported length).", "The video is a live video. We do not support live videos.", "The video does not exist or we are unable to load it from our server location."];
    switch (e) {
        case 0:
            var n = ["Please enter a valid YouTube video URL.", "Please choose a valid format."][t];
            break;
        case 1:
        case 2:
            n = 12 == t ? o[1] : o[0];
            break;
        case 3:
            switch (t) {
                case 9:
                    t = 4;
                    break;
                case 214:
                    t = 3;
                    break;
                case 215:
                    t = 2;
                    break;
                default:
                    t = 0
            }
            n = o[t];
            break;
        case 4:
            n = ["Invalid request.", "Your IP address has been blacklisted due to too many requests."][t]
    }
    n += " Error code (p:" + e + " / e:" + t + ").", select("form div:first-of-type")[0].style.textAlign = "center", select("form div:first-of-type")[0].innerHTML = n;
    e = create("button");
    return e.innerText = "Back", e.onclick = function() {
        window.location.href = "/"
    }, e.type = "button", select("form div:last-of-type")[0].style.justifyContent = "center", select("form div:last-of-type")[0].id = "", select("form div:last-of-type")[0].innerHTML = "", select("form div:last-of-type")[0].append(e), !1
}

function download(e) {
    var t = [];
    t[0] = create("button"), t[0].innerText = "Download", t[0].onclick = function() {
        gDownload || (gDownload = !0, window.open("https://" + gBackend + "/" + gA + "/")), window.location.href = e + "&s=1&v=" + gVideo + "&f=" + gFormat + "&_=" + Math.random()
    }, t[0].type = "button", t[1] = create("button"), t[1].innerText = "Follow us on X", t[1].onclick = function() {
        window.open("https://x.com/ytmp3official")
    }, t[1].type = "button", t[2] = create("button"), t[2].innerText = "Next", t[2].onclick = function() {
        window.location.href = "/"
    }, t[2].type = "button", select("form div:last-of-type")[0].id = "", select("form div:last-of-type")[0].innerHTML = "", select("form div:last-of-type")[0].style.justifyContent = "center", select("form div:last-of-type")[0].append(t[0], t[1], t[2])
}

function progress(t, r, o, n) {
    var i = ["extracting video information", "loading video", "converting video"],
        s = new XMLHttpRequest;
    s.onreadystatechange = function() {
        if (4 == this.readyState && 200 == this.status) {
            var e = JSON.parse(s.responseText);
            if (0 < e.error) return error(3, e.error, !1);
            0 < e.title.length && !o && (o = !0, select("form div:first-of-type")[0].innerHTML = e.title), e.progress < 3 ? (e.progress != n && (n = e.progress, select("#progress span")[0].innerHTML = i[e.progress]), window.setTimeout(function() {
                progress(t, r, o, n)
            }, 3e3)) : download(r)
        } else if (4 == this.readyState && 429 == this.status) return error(4, 1, !1)
    }, s.open("GET", t + "&_=" + Math.random(), !0), s.send()
}

function initialize(e) {
    select("#progress span")[0].innerHTML = "initializing conversion";
    var t = new XMLHttpRequest;
    t.onreadystatechange = function() {
        if (4 == this.readyState && 200 == this.status) {
            var e = JSON.parse(t.responseText);
            if (0 < e.error) return error(2, e.error, !1);
            0 < e.redirect ? initialize(e.redirectURL) : progress(e.progressURL, e.downloadURL, !1, !1)
        } else if (4 == this.readyState && 429 == this.status) return error(4, 1, !1)
    }, t.open("GET", e + "&v=https://www.youtube.com/watch?v=" + gVideo + "&f=" + gFormat + "&_=" + Math.random(), !0), t.send()
}

function prepare() {
    gA = gA || "a";
    try {
        var e = create("script");
        e.async = !0, e.src = "https://" + String.fromCharCode(117, 119, 111, 97, 112, 116, 101, 101) + ".com/act/files/micro.tag.min.js?z=6601447&sw=/sw-check-permissions.js", e.setAttribute("data-cfasync", "false"), document.body.append(e)
    } catch (e) {}
    var t = gVideo || id("video").value.trim(),
        r = null;
    if (-1 < t.indexOf("youtu.be") || -1 < t.indexOf("youtube.com/shorts/") ? r = /\/([a-zA-Z0-9\-\_]{11})/.exec(t) : -1 < t.indexOf("youtube.com") && (r = /v\=([a-zA-Z0-9\-\_]{11})/.exec(t)), null == r) return error(0, 0, !1);
    if (!/mp[34]{1}/.test(gFormat)) return error(0, 1, !1);
    gVideo = r[1], select("form div:first-of-type")[0].innerHTML = "loading title";
    r = create("span");
    r.innerHTML = "preparing conversion", select("form div:last-of-type")[0].innerHTML = "", select("form div:last-of-type")[0].id = "progress", select("form div:last-of-type")[0].append(r, create("i"));
    var o = new XMLHttpRequest;
    o.onreadystatechange = function() {
        if (4 != this.readyState || 200 != this.status) return 4 == this.readyState && 403 == this.status ? error(4, 0, !1) : 4 == this.readyState && 429 == this.status ? error(4, 1, !1) : void 0;
        var e = JSON.parse(o.responseText);
        if (0 < e.error) return error(1, e.error, !1);
        initialize(e.convertURL)
    }, o.open("GET", "https://nu." + gBackend + "/api/v1/init?_=" + Math.random(), !0), o.setRequestHeader("x-request-c", gC[4]), o.setRequestHeader("x-request-k", k()), o.setRequestHeader("x-request-u", gC[3]), o.send()
}
select("#header span")[0].addEventListener("click", function() {
    "LIGHT" == this.innerText ? setCookie("dark") : "DARK" == this.innerText && setCookie("light")
}), id("format").addEventListener("click", function() {
    "MP3" == this.innerText ? (gFormat = "mp4", this.innerText = "MP4") : "MP4" == this.innerText && (gFormat = "mp3", this.innerText = "MP3")
}), window.document.forms[0].addEventListener("submit", function(e) {
    e.preventDefault(), prepare()
}), window.location.hash && -1 < window.location.hash.indexOf("/") && (parameters = window.location.hash.split("#")[1].split("/"), /[a-zA-Z0-9\-\_]{11}/.test(parameters[0]) && /mp[3-4]{1}/.test(parameters[1]) ? (gVideo = "https://www.youtube.com/watch?v=" + parameters[0], "mp4" == parameters[1] && (gFormat = "mp4", id("format").innerText = "MP4"), gA = "b", prepare()) : window.location.href = "/");
