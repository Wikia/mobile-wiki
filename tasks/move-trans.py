import os
import sys
import json


# Usage
# python move-trans.py <source_file_name:path> <target_file_name:path>
# Example: python move-trans.py main:app:search-label search:main:search-input-label
class Mover:

    def __init__(self):
        pass

    locales = '/Users/adamr/Wikia/mercury/front/common/public/locales'

    def move(self, source, target):
        for lang in os.listdir(self.locales):
            print lang
            translation = self.get_translation(source, lang)
            if translation:
                self.save_translation(target, lang, translation)

    def get_translation(self, source, lang):
        s = source.split(':')
        source_path = '%s/%s/%s.json' % (self.locales, lang, s[0])
        with open(source_path, 'rb+') as source_file:
            json_source = r_json_source = json.load(source_file)

            for step in s[1:-1]:
                if step in json_source:
                    json_source = json_source[step]
                else:
                    return ''
            if s[-1] in json_source:
                translation = json_source[s[-1]]

                del json_source[s[-1]]
                Mover._save_json_to_file(source_file, r_json_source)

                return translation
            return ''

    def save_translation(self, target, lang, translation):
        t = target.split(':')
        target_path = '%s/%s/%s.json' % (self.locales, lang, t[0])
        with open(target_path, 'rb+') as target_file:
            json_target = json.load(target_file)
            if not json_target:
                json_target = {}

            new_translation = json_target
            for step in t[1:-1]:
                if step not in new_translation:
                    new_translation[step] = {}
                new_translation = new_translation[step]
            new_translation[t[-1]] = translation

            Mover._save_json_to_file(target_file, json_target)

    @staticmethod
    def _save_json_to_file(file, data):
        file.seek(0)
        file.truncate()
        json_string = json.dumps(data, ensure_ascii=False, encoding='utf8', indent=2, sort_keys=True)
        file.write(json_string.encode('utf-8'))


if __name__ == "__main__":
    Mover().move(sys.argv[1], sys.argv[2])
