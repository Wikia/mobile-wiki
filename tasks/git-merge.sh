# Set variables
while getopts ":u:p:g:" opt; do
        case $opt in
                u)
                        USERNAME=$OPTARG
                        ;;
		p)
			PASSWORD=$OPTARG
			;;
		g)
			PR=$OPTARG
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

if [ $PR -z ]
then
echo "Param -g is not set, which is github pull request number"
exit 1
fi

curl -u $USERNAME:$PASSWORD -X PUT -d '{}' "https://api.github.com/repos/Wikia/mercury/pulls/"$PR
echo
echo "Pull request merged"

