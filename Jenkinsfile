pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh '''
                    docker compose down 2>/dev/null || true
                    docker compose build
                '''
            }
        }
        
        stage('Deploy & Test') {
            steps {
                sh '''
                    # Démarrer
                    docker compose up -d
                    sleep 15
                    
                    # Vérifier les conteneurs
                    echo "Conteneurs:"
                    docker compose ps
                    
                    # Test backend
                    echo "Test backend:"
                    if docker compose exec -T backend curl -s http://localhost:5000/api/health; then
                        echo "✅ Backend OK"
                    else
                        echo "❌ Backend FAIL"
                        docker compose logs backend
                        exit 1
                    fi
                    
                    # Test frontend sur port 8081
                    echo "Test frontend (port 8081):"
                    if curl -s -f http://localhost:8081 > /dev/null; then
                        echo "✅ Frontend OK"
                    else
                        echo "❌ Frontend FAIL"
                        docker compose logs frontend
                        exit 1
                    fi
                    
                    echo "🎉 SUCCÈS"
                    echo "App: http://localhost:8081"
                '''
            }
        }
    }
}
