for config_file in $(find . -name '*.conf'); do
     crowdin --global-config $1 --project-config $config_file download-branch -b $2
done
# Return true to do not break whole flow if there are no translations
true
