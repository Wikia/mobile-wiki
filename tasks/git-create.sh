# Set variables
while getopts ":u:p:" opt; do
        case $opt in
                u)
                        USERNAME=$OPTARG
                        ;;
		p)
			PASSWORD=$OPTARG
			;;
                \?)
                        echo "Invalid option: -$OPTARG"
                        exit 1
                        ;;
                :)
                        echo "Option -$OPTARG requires an argument."
                        exit 1
                        ;;
        esac
done

if [ $USERNAME -z ]
then
echo "Param -u is not set, which is github user username"
exit 1
fi

if [ $PASSWORD -z ]
then
echo "Param -p is not set, which is github user password"
exit 1
fi

git checkout dev
git pull --rebase
git fetch --prune
git branch -r | awk -F/ '/\/release/{print $2}' | xargs -I {} git push origin :{}
BRANCH=$(git tag -l | sed 's/^.\{8\}//' | sort -nr | head -1)
CHANGES=$(git diff --shortstat origin/dev release-$BRANCH | wc -w)

if [ $CHANGES -eq 0 ]
then
echo -e "\nThere is nothing new in dev. Aborting..."
exit 1
fi

BRANCH=$(echo $BRANCH | sed 's/.\{4\}$//')
let "BRANCH++"
BRANCHN=$BRANCH
BRANCH="release-"$BRANCH

git checkout -b $BRANCH
echo -e "\nCreated new branch: "$BRANCH"\n"

./tasks/changelog-update.sh -r $BRANCH
git add CHANGELOG.md
git commit -m "update changelog"
npm version $BRANCHN".0.0"
git push origin $BRANCH

git checkout dev
git pull --rebase
git branch -D $BRANCH

curl -u $USERNAME:$PASSWORD --data '{"title": "'$BRANCH'", "head": "Wikia:'$BRANCH'", "base": "dev"}' https://api.github.com/repos/wikia/mercury/pulls > temp
PR="Pull request: #"$(cat temp | grep "https://api.github.com/repos/" | grep "pulls" | grep "href" | head -1 | tr -d "[:space:][:alpha:][:punct:]")
echo -e "\n"$PR
rm temp

