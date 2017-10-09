 #!/bin/bash
ENV="$1"
VER="$2"
NAMESPACE="$3"

function getCommit {
    RESULT=`git describe`

    # release-74.001-17-g9b33a17bb => g9b33a17bb
    echo $RESULT | grep -o '[0-9a-z]\+$'
}



function replaceYaml {
   sed\
        -e "s/\${env}/$ENV/g"\
        -e "s/\${version}/$VER/g"\
        k8s/k8s-descriptor-template1.yaml > k8s-descriptor-"$ENV".yaml
}

getCommit
