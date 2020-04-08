async function getApiKey(code) {
    let authenticate_url = document.getElementsByName("authenticate_url")[0].getAttribute("content");
    let json_body = {
        "code": code,
        "redirect": window.location.href.split("?")[0]
    };
    let response = await fetch(
        authenticate_url,
        {
            method: "POST",
            body: JSON.stringify(json_body),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }
    );
    let data = await response.json();
    return data["api_token"]
}

async function setApiKey(code) {
    let api_token = await getApiKey(code);
    if (api_token === undefined) {
        document.cookie = 'user_api_token=; Thu, 01 Jan 1970 00:00:01 GMT; path=/';
        alert("Could not get your token from the API! :(");
    } else {
        let expiration = new Date();
        expiration.setMonth(expiration.getMonth() + 1);
        document.cookie = "user_api_token=" + api_token + "; expires=" + expiration.toUTCString()
    }
    window.location.href = "/"
}


window.onload = function() {
    console.log("Document loaded!");
    let url = new URL(window.location.href);
    let code = url.searchParams.get("code");
    console.log("Code: " + code);
    if (code) {
        setApiKey(code).then()
    } else {
        window.location.href = document.getElementsByName("discord_url")[0].getAttribute("content");
    }
};
