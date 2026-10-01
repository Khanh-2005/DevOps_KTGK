pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Deployment notice') {
            steps {
                echo 'VPS deployment is disabled. Production deployments are handled by .github/workflows/deploy.yml on Vercel.'
            }
        }
    }
}
