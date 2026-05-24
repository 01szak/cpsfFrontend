pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    parameters {
        choice(name: 'env', choices: ['stage', 'prod'], description: 'Wybierz środowisko')
    }

    environment {
        TARGET_DIR = "/var/www/html/${params.env}"
    }
        stage('Build') {
            steps {
                sh '''
                    npm install
                    npm run build
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    mkdir -p ${TARGET_DIR}
                    rm -rf ${TARGET_DIR}/*
                    cp -r dist/browser/* ${TARGET_DIR}/
                """
            }
        }
    }

    post {
        always {
            cleanWs()
            echo "Czyszczenie przestrzeni roboczej zakończone."
        }
        success {
            echo "✅ Frontend pomyślnie wdrożony na środowisko: ${params.env}"
        }
    }
