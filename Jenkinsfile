pipeline {
  agent {
    node {
        label 'qa-executors'
        customWorkspace "/var/lib/jenkins/workspace/mobile-wiki-pr-checks-2-${BRANCH_NAME}"

    }
  }

  stages {
    stage('npm ci') {
      steps {
      	nodejs('v12 LTS') {
		  sh 'npm set progress=false'
		  sh 'npm install'
        }
      }
    }
    stage('Run Tests') {
      parallel {
        stage('lint') {
          options {
            timeout(time: 5, unit: 'MINUTES')
          }
          steps {
		    nodejs('v12 LTS') {
			  sh 'npm run linter'
			}
          }
        }
        stage('bundle size') {
          options {
            timeout(time: 10, unit: 'MINUTES')
          }
          steps {
            nodejs('v12 LTS') {
              sh 'ember bundlesize:test'
            }
          }
        }
        stage('Build and Test') {
          environment {
            COVERAGE = true
          }
          options {
            timeout(time: 10, unit: 'MINUTES')
          }
          steps {
            nodejs('v12 LTS') {
              sh 'TEST_PORT=$EXECUTOR_NUMBER ember test'
            }
          }
        }
      }
    }
  }

  post {
    success {
      cobertura autoUpdateHealth: false,
        autoUpdateStability: false,
        coberturaReportFile: '**/coverage/cobertura-coverage.xml',
        conditionalCoverageTargets: '70, 0, 0',
        failUnhealthy: false,
        failUnstable: false,
        lineCoverageTargets: '80, 0, 0',
        maxNumberOfBuilds: 0,
        methodCoverageTargets: '80, 0, 0',
        onlyStable: false,
        zoomCoverageChart: false
    }
    cleanup {
        dir('node_modules') {
          deleteDir()
      }
    }
  }
}
