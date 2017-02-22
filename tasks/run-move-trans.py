import os

strings = [
    "categories-list-label",
    "comments-label",
    "comments-label_plural",
    "empty-label",
    "error",
    "last-edit",
    "last-edit_plural_0",
    "last-edit_plural_2",
    "other-languages",
    "redirect-empty-target",
    "replies-label",
    "replies-label_plural",
    "suggestions-label",
    "toc-label",
    "top-contributors-label",
]

for strr in strings:
    os.system('python move-trans.py main:app:article-' + strr + ' main:article:' + strr)
