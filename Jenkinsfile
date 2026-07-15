pipeline{
    agent any
    stages{
        stage ('Checkout'){
            steps{
                git branch: 'main',
                url: 'https://github.com/asifaa8910-alt/.git'
            }
        }
        stage('Install Backend Dependencies'){
            steps{
               dir('backend'){
                sh 'npm install'
               }
            }
        }
        stage(' Install Frontend Dependencies'){
            steps{
                dir('frontend'){
                    sh 'npm install'
                }
            }
        }
        stage('Build Frontend'){
            steps{
                dir('frontend'){
                    sh 'npm run build'
                }
            }
        }
        stage('Build Docker Images'){
            steps{
                sh 'docker compose build'
            }
        }
        stage('Deploy Containers'){
            steps{
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
        stage('Verify Deployment'){
            steps{
                sh 'docker ps'
            }
        }
    }
    post{
        success{
            echo' Deployment Sucessfully!'
        }
        failure{
            echo 'Deployemnt Failed!'
        }
}
}