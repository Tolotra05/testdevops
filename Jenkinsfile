pipeline {
    agent any
    
    stages {
        stage('Clean') {
            steps {
                cleanWs()
            }
        }
        
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Tolotra05/testdevops.git'
            }
        }
        
        stage('Build Docker') {
            steps {
                sh '''
                    docker-compose down 2>/dev/null || true
                    docker-compose build
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    docker-compose up -d
                    sleep 10
                '''
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    # Test backend
                    if curl -s http://localhost:5000/api/health | grep -q healthy; then
                        echo "✅ Backend OK"
                    else
                        echo "❌ Backend failed"
                        exit 1
                    fi
                    
                    # Test frontend
                    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q 200; then
                        echo "✅ Frontend OK"
                    else
                        echo "❌ Frontend failed"
                        exit 1
                    fi
                    
                    # Test login
                    if curl -s -X POST http://localhost:5000/api/login \
                       -H "Content-Type: application/json" \
                       -d '{"username":"admin","password":"admin123"}' | grep -q success; then
                        echo "✅ Login OK"
                    else
                        echo "❌ Login failed"
                        exit 1
                    fi
                    
                    echo "🎉 All tests passed!"
                    echo "App: http://localhost:8080"
                '''
            }
        }
    }
    
    post {
        always {
            sh 'docker-compose down 2>/dev/null || true'
        }
    }
}
