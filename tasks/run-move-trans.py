import os

strings = [
    "load-error",
    "load-more",
    "load-previous",
    "no-members",
    "subtitle",
]

for strr in strings:
    os.system('python move-trans.py main:app:category-page-' + strr + ' main:category-page:' + strr)
