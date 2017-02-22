import os

strings = [
    "install-android",
    "price",
    "store-android",
]

for strr in strings:
    os.system('python move-trans.py main:app:smartbanner-' + strr + ' main:smartbanner:' + strr)
