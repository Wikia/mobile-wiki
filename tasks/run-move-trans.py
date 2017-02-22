import os

strings = [
    "load-error",
    "page-heading",
    "page-publish",
    "publish-error",
    "publish-error-autoblockedtext",
    "publish-error-blocked",
    "publish-error-noedit",
    "publish-error-noedit-anon",
    "publish-error-protectedpage",
    "success",
]

for strr in strings:
    os.system('python move-trans.py main:app:edit-' + strr + ' main:edit:' + strr)
