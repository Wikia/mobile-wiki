# Set variables
while getopts ":e:m:a:c:u:" opt; do
        case $opt in
                e)
                        ENVIRONMENT=$OPTARG
                        ;;
                m)
                        MERCURY=$OPTARG
                        ;;
                a)
                        APP=$OPTARG
                        ;;
                c)
                        CONFIG=$OPTARG
                        ;;
		u)
			USER=$OPTARG"@"
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

# Check if ENVIRONMENT is not empty
if [ -z $ENVIRONMENT ]
then
echo "Please set ENVIRONMENT like sandbox-mercury"
exit 1
fi

# Check if MERCURY is not empty
if [ -z $MERCURY ]
then
echo "MERCURY branch is empty, skipping to next step..."
else
echo "y" | ssh $USER"deploy-s3" dt lock -t mercury:$ENVIRONMENT --release
echo "y" | ssh $USER"deploy-s3" dt prep -e $ENVIRONMENT -a mercury -r mercury@$MERCURY
echo "y" | ssh $USER"deploy-s3" dt push -e $ENVIRONMENT -a mercury
fi

# Check if APP is not empty
if [ -z $APP ]
then
echo "APP branch is empty, skipping to next step..."
else
echo "y" | ssh $USER"deploy-s3" dt lock -t wikia:$ENVIRONMENT --release
echo "y" | ssh $USER"deploy-s3" dt prep -e $ENVIRONMENT -a wikia -r app@$APP
echo "y" | ssh $USER"deploy-s3" dt push -e $ENVIRONMENT -a wikia
fi

# Check if CONFIG is not empty
if [ -z $CONFIG ]
then
echo "CONFIG branch is empty, skipping to next step..."
else
echo "y" | ssh $USER"deploy-s3" dt lock -t wikia:$ENVIRONMENT --release
echo "y" | ssh $USER"deploy-s3" dt prep -e $ENVIRONMENT -a wikia -r config@$CONFIG
echo "y" | ssh $USER"deploy-s3" dt push -e $ENVIRONMENT -a wikia
fi

