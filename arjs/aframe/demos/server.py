#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import random

PORT = random.randint(8000, 8099)
SERVER = 'localhost:{}'.format(PORT)

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Now available at http://{} - Press ctrl-c or close the window to stop.".format(SERVER))
    webbrowser.open_new('http://{}/html/'.format(SERVER))
    httpd.serve_forever()

