pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                sh '''
                    docker compose down 2>/dev/null || true
                    docker compose build
                    docker compose up -d
                    sleep 30
                '''
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    # Test backend depuis Jenkins
                    echo "Testing backend..."
                    if curl -s http://localhost:5000/api/health | grep -q healthy; then
                        echo "✅ Backend OK"
                    else
                        echo "❌ Backend FAIL"
                        exit 1
                    fi
                    
                    # Test frontend depuis Jenkins  
                    echo "Testing frontend..."
                    if curl -s -f http://localhost:8081; then
                        echo "✅ Frontend OK"
                    else
                        echo "❌ Frontend FAIL"
                        exit 1
                    fi
                    
                    echo ""
                    echo "🎉 DEPLOYMENT SUCCESSFUL"
                    echo "App: http://localhost:8081"
                    echo "API: http://localhost:5000"
                '''
            }
        }
    }
}
