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
                script {
                    // Build the application
                    sh 'npm run build'  // Modify this according to your build process
                }
            }
        }

        stage('Unit Test') {
            steps {
                script {
                    // Run unit tests
                    sh 'npm run test'  // Modify this according to your test process
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
