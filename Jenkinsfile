pipeline {
    agent any

    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${env.PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/asifaa8910-alt/letter_clinic.git'
            }
        }

        stage('Verify Environment') {
            steps {
                sh 'echo "PATH=$PATH"'
                sh 'which node'
                sh 'node --version'
                sh 'which npm'
                sh 'npm --version'
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        stage('Create Backend .env') {
    steps {
        writeFile file: 'backend/.env', text: '''
PORT=5050
MONGODB_URI=mongodb://mongodb:27017/letter_clinic
JWT_SECRET=super_secret_key_for_letter_clinic_2026
JWT_EXPIRES_IN=7d
NODE_ENV=development
'''
    }
}

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }

      stage('Deploy Containers') {
    steps {
        sh '''
        docker compose down || true

        docker rm -f letterclinic_mongodb letterclinic_frontend letter_clinicbackend 2>/dev/null || true

        docker compose up -d
        '''
    }
}

        stage('Verify Deployment') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Deployment Successfully!'
        }

        failure {
            echo 'Deployment Failed!'
        }

        always {
            cleanWs()
        }
    }
}