pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install and validate') {
            steps {
                sh '''
                    set -eu
                    node --version
                    npm ci
                    node --check app.js
                    node --check config/database.js
                '''
            }
        }

        stage('Deploy to Vercel Production') {
            when {
                expression {
                    def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH ?: ''
                    return branchName in ['main', 'origin/main', 'refs/heads/main']
                }
            }
            steps {
                withCredentials([
                    string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN'),
                    string(credentialsId: 'vercel-org-id', variable: 'VERCEL_ORG_ID'),
                    string(credentialsId: 'vercel-project-id', variable: 'VERCEL_PROJECT_ID')
                ]) {
                    sh '''
                        set -eu
                        mkdir -p .vercel
                        printf '{"orgId":"%s","projectId":"%s"}\\n' \
                            "$VERCEL_ORG_ID" "$VERCEL_PROJECT_ID" > .vercel/project.json
                        npx --yes vercel@62.1.0 pull --yes --environment=production --token="$VERCEL_TOKEN"
                        npx --yes vercel@62.1.0 build --prod --token="$VERCEL_TOKEN"
                        npx --yes vercel@62.1.0 deploy --prebuilt --prod --yes --token="$VERCEL_TOKEN"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Jenkins pipeline completed successfully.'
            echo 'Your public link: https://ecommerce-app-ebon-omega.vercel.app/'
        }
        failure {
            echo 'Jenkins pipeline failed. Review the stage logs before retrying.'
        }
    }
}
