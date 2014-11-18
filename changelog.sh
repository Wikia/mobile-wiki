#/usr/bin

curl "https://api.github.com/repos/Wikia/mercury/compare/release-$1...release-$2" -s |
jq '.commits[].commit.message' |
grep 'Merge pull' |
sed  's/^.*\(HG-[0-9]*\):\{0,1\}/[\1](https:\/\/wikia-inc\.atlassian\.net\/browse\/\1)/' |
sed 's/^".*from //' |
sed 's/\\n\\n/ /' |
sed 's/".*$//' |
sed 's/^/* /' |
uniq -ui
