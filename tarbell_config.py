# -*- coding: utf-8 -*-

"""
Tarbell project configuration
"""

# Need these two to turn the Google dump into nice JSON
import json
from flask import Blueprint
import locale

from tarbell.hooks import register_hook

from markupsafe import Markup


# Google spreadsheet key
SPREADSHEET_KEY = "1n4L0rZzH52SEMI8s-KhjkuVVlVSiKxfw5ldkowFkZRA"

# Exclude these files from publication
EXCLUDES = ['palette.html', '*.md', '*.ai', 'requirements.txt', 'node_modules', 'sass', 'js/src', 'package.json', 'Gruntfile.json']

# Spreadsheet cache lifetime in seconds. (Default: 4)
# SPREADSHEET_CACHE_TTL = 4

# Create JSON data at ./data.json, disabled by default
# CREATE_JSON = True

# Get context from a local file or URL. This file can be a CSV or Excel
# spreadsheet file. Relative, absolute, and remote (http/https) paths can be 
# used.
# CONTEXT_SOURCE_FILE = ""

# EXPERIMENTAL: Path to a credentials file to authenticate with Google Drive.
# This is useful for for automated deployment. This option may be replaced by
# command line flag or environment variable. Take care not to commit or publish
# your credentials file.
# CREDENTIALS_PATH = ""

# S3 bucket configuration
S3_BUCKETS = {
    # Provide target -> s3 url pairs, such as:
    #     "mytarget": "mys3url.bucket.url/some/path"
    # then use tarbell publish mytarget to publish to it
    
    "production": "graphics.chicagotribune.com/news/watchdog/superweeds",
    "staging": "apps.beta.tribapps.com/superweeds",
}

# Default template variables
DEFAULT_CONTEXT = {
   'OMNITURE': {   'domain': 'chicagotribune.com',
                    'section': 'news',
                    'sitename': 'Chicago Tribune',
                    'subsection': 'watchdog',
                    'subsubsection': '',
                    'type': 'dataproject'},
    'name': 'superweeds',
    'title': 'How weeds resist'
}

@register_hook('generate')
def merge_extra_context(site, output_root, extra_context={}):
    if extra_context is not None:
        context = site.get_context()
        context.update(**extra_context)


# blueprint = Blueprint('split_peas', __name__)

# @blueprint.app_template_filter('jsonify')
# def jsonify_filter(data):
#     return Markup(json.dumps(data))



# @blueprint.app_template_filter('split_peas')
# def split_peas(text):
#     text = text.split('\n')
#     newtext = ""
#     for line in text:
#         newtext += "<p>%s</p>" % line
#     return newtext