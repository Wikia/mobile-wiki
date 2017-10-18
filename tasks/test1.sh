BRANCH="release-50"

if [[ "$BRANCH" == "release"* ]] && [[ "$BRANCH" == *"$((50))" ]]
then
echo "yay"
else
echo "noep"
fi