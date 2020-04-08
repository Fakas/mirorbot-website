from flask import Flask, request, make_response, redirect
from urllib.parse import urljoin
from os import environ, path
from . import utils

try:
    api_identity = environ["SERVEY_API_IDENTITY"]
    api_mirorbot = environ["SERVEY_API_MIRORBOT"]
    login_url = environ["DISCORD_LOGIN_URL"]
except KeyError:
    raise EnvironmentError("The following environment variables must be set:"
                           "SERVEY_API_IDENTITY, SERVEY_API_MIRORBOT, DISCORD_LOGIN_URL") from None

directory = path.dirname(path.realpath(__file__))
html = utils.get_html(path.join(directory, "html"))

authenticate_url = urljoin(api_identity, "auth/discord/authenticate")
user_url = urljoin(api_identity, "/user")
announce_url = urljoin(api_mirorbot, "announce/sound")

name = "Miror Bot Website"
app = Flask(name)


@app.route("/")
@app.route("/index")
def index():
    api_key = request.cookies.get("user_api_token")
    log_button = html.snippets.logout_button if api_key else html.snippets.login_button.format(login_url)
    announce_button = html.snippets.announce_button.format("/announce" if api_key else login_url)

    response = make_response(
        html.index.index.format(
            log_button=log_button,
            announce_button=announce_button
        )
    )
    return response


@app.route("/login")
def login():
    response = make_response(
        html.login.index.format(
            discord_url=login_url,
            authenticate_url=authenticate_url
        )
    )
    return response


@app.route("/announce")
def announce():
    api_key = request.cookies.get("user_api_token")
    log_button = html.snippets.logout_button if api_key else html.snippets.login_button.format(login_url)
    announce_button = html.snippets.announce_button.format("/announce" if api_key else login_url)

    if api_key:
        response = make_response(
            html.announce.index.format(
                log_button=log_button,
                announce_button=announce_button,
                user_url=user_url,
                announce_url=announce_url,
            )
        )
    else:
        response = redirect(login_url, code=307)
    return response
