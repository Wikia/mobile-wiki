import os

strings = [
    "subtitle",
    "usages-header",
    "usages-see-more-link-label",
]

for strr in strings:
    os.system('python move-trans.py main:app:file-page-' + strr + ' main:file-page:' + strr)
