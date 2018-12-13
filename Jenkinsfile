pipeline {
  agent {
    label 'qa-executors'
  }

  stages {
    stage('npm ci') {
      options {
        timeout(time: 2, unit: 'MINUTES')
      }
      steps {
        sh 'npm ci'
      }
    }
    stage('lint') {
      options {
        timeout(time: 2, unit: 'MINUTES')
      }
      steps {
        sh 'npm run linter'
      }
    }
    stage('bundle size') {
      options {
        timeout(time: 2, unit: 'MINUTES')
      }
      steps {
        sh 'ember bundlesize:test'
      }
    }
    stage('Build and Test') {
      environment {
        COVERAGE = true
      }
      options {
        timeout(time: 5, unit: 'MINUTES')
      }
      steps {
        sh 'TEST_PORT=$EXECUTOR_NUMBER ember test'
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
  }
}
