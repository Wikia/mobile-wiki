for config_file in $(find ../crowdin/ -name '*.conf'); do
     crowdin --project-config $config_file download-branch -b $1
done
