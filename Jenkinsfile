pipeline {
    agent any
    
    stages {
        stage('Build & Deploy') {
            steps {
                sh '''
                    docker compose down 2>/dev/null || true
                    docker compose build
                    docker compose up -d
                    sleep 30
                    
                    # Vérifier seulement que les conteneurs tournent
                    docker compose ps
                    
                    echo "✅ Deployment completed"
                    echo "NOTE: Manual testing required from host machine"
                    echo "Backend: http://localhost:5000/api/health"
                    echo "Frontend: http://localhost:8081"
                '''
            }
        }
    }
}
