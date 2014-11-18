#/usr/bin

curl "https://api.github.com/repos/Wikia/mercury/compare/release-$1...release-$2" -s |
jq '.commits[].commit.message' |
grep 'Merge pull' |
sed -e 's/^.*\(HG-[0-9]*\):\{0,1\}/[\1](https:\/\/wikia-inc\.atlassian\.net\/browse\/\1)/' \
	-e 's/^".*from //' \
	-e 's/\\n/ /g' \
	-e 's/".*$//' \
	-e 's/^/* /' |
uniq -ui
