import os
from types import SimpleNamespace


def get_html(directory):
    html = {}
    items = os.listdir(directory)
    for item in items:
        path = os.path.join(directory, item)
        name = os.path.split(path)[-1]
        if os.path.isfile(path):
            name, extension = os.path.splitext(name)
            if extension == ".html":
                with open(path, "r") as file:
                    html[name] = file.read()
        elif os.path.isdir(path):
            html[name] = get_html(path)
    return SimpleNamespace(**html)
