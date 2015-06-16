# Set variables
while getopts ":u:p:" opt; do
        case $opt in
                u)
                        USER=$OPTARG
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

git checkout dev
git pull --rebase
git fetch --prune
git branch -r | awk -F/ '/\/release/{print $2}' | xargs -I {} git push origin :{}
BRANCH=$(git tag -l | sed 's/^.\{8\}//' | sort -nr | head -1)
CHANGES=$(git diff --shortstat origin/dev release-$BRANCH | wc -w)

if [ $CHANGES -eq 0 ]
then
echo "There is nothing new in dev. Aborting"
exit 1
fi

BRANCH=$(echo $BRANCH | sed 's/.\{4\}$//')
let "BRANCH++"
BRANCH="release-"$BRANCH

git checkout -b $BRANCH
./tasks/changelog-update.sh -r $BRANCH
#git add CHANGELOG.md
#git commit -m "update changelog"
#git push origin $BRANCH

git checkout dev
git pull --rebase
git branch -D $BRANCH

# changelog
./tasks/changelog-view.sh


#curl -u $USER:$PASSWORD --data '{"title": "'$BRANCH'", "head": "Wikia:'$BRANCH'", "base": "dev"}' https://api.github.com/repos/wikia/mercury/pulls > temp
#PR_URL=$(cat temp | grep "https://api.github.com/repos/" | grep "pulls" | grep "href" | head -1 | tr -d "[:space:]" | sed -e 's/^.\{8\}//' -e 's/.\{1\}$//')


