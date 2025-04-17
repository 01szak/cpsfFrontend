node {
  env.NODEJS_HOME = "${tool 'nodejs'}"
  // on linux / mac
  env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
  // on windows
  env.PATH="${env.NODEJS_HOME};${env.PATH}"
}

pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        // Checkout the code from the repository
        checkout scm
      }
    }

    stage('Build') {
      steps {
        nodejs(nodeJSInstallationName: 'nodejs') {
          sh 'npm config ls'
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }

  }

  post {
    always {
      cleanWs()  // Clean workspace after each build
    }
  }
}
