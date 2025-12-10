pipeline {
    agent any
    
    stages {
        stage('Clean') {
            steps {
                deleteDir()
            }
        }
        
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/Tolotra05/testdevops.git'
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    docker compose down 2>/dev/null || true
                    docker compose build
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    docker compose up -d
                    sleep 10
                '''
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    # Backend test
                    if curl -s http://localhost:5000/api/health; then
                        echo "Backend OK"
                    else
                        echo "Backend FAIL"
                        exit 1
                    fi
                    
                    # Frontend test  
                    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8081 | grep -q 200; then
                        echo "Frontend OK"
                    else
                        echo "Frontend FAIL"
                        exit 1
                    fi
                    
                    echo "ALL TESTS PASSED"
                '''
            }
        }
    }
    
    post {
        always {
            sh 'docker compose down 2>/dev/null || true'
        }
    }
}
