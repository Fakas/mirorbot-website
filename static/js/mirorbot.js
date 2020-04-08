const FORM_ID = "mb_form";
const FILE_ID = "sound_upload";
const ludicolo = new Image();
ludicolo.src = "/static/images/ludicolo.gif";
let token;
let discord_id;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function logout() {
    document.cookie = 'user_api_token=; Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    location.reload();
}

function load_sound() {
    let player = document.getElementById("mb_announce_sound");
    let download_url = document.getElementsByName("announce_url")[0].getAttribute("content");
    try {
        player.src = download_url + "/" + discord_id + "?cb=" + new Date().getTime();
    } catch {

    }
}

function get_cookie(key) {
    let name = key + "=";
    let cookies = document.cookie.split(";")
    for (let ii = 0; ii < cookies.length; ii++) {
        let cookie = cookies[ii];
        while (cookie.charAt(0) === " ") {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length)
        }
    }
}

function prepare_uploader() {
    document.getElementById(FORM_ID).addEventListener("submit", e => {
        e.preventDefault();
    });

    document.getElementById(FILE_ID).onchange =  async function () {
        const file = document.getElementById(FILE_ID).files[0];
        const formData = new FormData();
        const display = document.getElementById("mb_upload_display");

        display.innerHTML = "Uploading...<br>"; display.appendChild(ludicolo);

        formData.append('audio_file', file);

        let url  = document.getElementsByName("announce_url")[0].getAttribute("content");
        url = url + "/" + get_cookie("user_api_token");

        let wake_up = new Date().getTime() + 1000;
        jobj = fetch(url, {
            method: 'POST',
            body: formData,
        }).then(response => {
            status = response.status;
            return response.json()
        }).then(async function(jobj) {
            console.log(jobj);
            let now = new Date().getTime();
            if (wake_up > now) {
                await sleep(wake_up - now)
            }

            load_sound();

            let message;
            if (status === "200") {
                message = "Done!"
            }
            else {
                message = jobj["message"];
            }

            display.innerHTML = message;

        });
    };

}

function set_token() {
    token = get_cookie("user_api_token");
}

async function set_user() {
    let user_url = document.getElementsByName("user_url")[0].getAttribute("content");
    let response = await fetch(
     user_url + "/" + token
    )
    let data = await response.json()
    discord_id = data["discord_id"]
}

function startup() {
    prepare_uploader();
    set_token();
    set_user().then(load_sound);
}

window.onload = startup;
