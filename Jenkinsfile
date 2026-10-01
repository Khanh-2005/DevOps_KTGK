pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    // Jenkins chạy trên máy Windows (không có IP public) nên dùng pollSCM: 2 phút hỏi GitHub 1 lần.
    // Khi đã có webhook (ngrok / Cloudflare Tunnel) thì đổi thành:  githubPush()
    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        IMAGE_NAME  = 'ecommerce-app'
        SERVER_HOST = '192.168.1.49'          // <-- sửa: IP public của VPS
        SERVER_USER = 'deploy'
        APP_DIR     = '/home/deploy/ecommerce'
        SSH_OPTS    = '-o StrictHostKeyChecking=accept-new'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        docker build \
                          -t $DOCKER_USER/$IMAGE_NAME:$BUILD_NUMBER \
                          -t $DOCKER_USER/$IMAGE_NAME:latest .
                    '''
                }
            }
        }

        stage('Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push $DOCKER_USER/$IMAGE_NAME:$BUILD_NUMBER
                        docker push $DOCKER_USER/$IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
                    file(credentialsId: 'prod-env-file', variable: 'PROD_ENV_FILE')
                ]) {
                    sshagent(credentials: ['server-ssh-key']) {
                        sh '''
                            set -e
                            ssh $SSH_OPTS $SERVER_USER@$SERVER_HOST "mkdir -p $APP_DIR"

                            # Đẩy compose + .env (secret) lên server
                            scp $SSH_OPTS docker-compose.prod.yml $SERVER_USER@$SERVER_HOST:$APP_DIR/docker-compose.yml
                            scp $SSH_OPTS "$PROD_ENV_FILE" $SERVER_USER@$SERVER_HOST:$APP_DIR/.env

                            # Login Docker Hub trên server (mật khẩu đi qua stdin, không lộ trên command line)
                            echo "$DOCKER_PASS" | ssh $SSH_OPTS $SERVER_USER@$SERVER_HOST "docker login -u '$DOCKER_USER' --password-stdin"

                            # Kéo image mới và chỉ recreate service nào thay đổi (DB giữ nguyên)
                            ssh $SSH_OPTS $SERVER_USER@$SERVER_HOST "
                                cd $APP_DIR &&
                                chmod 600 .env &&
                                export DOCKERHUB_USER='$DOCKER_USER' IMAGE_TAG='$BUILD_NUMBER' &&
                                docker compose pull app &&
                                docker compose up -d --remove-orphans &&
                                docker image prune -f
                            "
                        '''
                    }
                }
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                    for i in $(seq 1 30); do
                        code=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_HOST/ || true)
                        echo "Lan $i: HTTP $code"
                        if [ "$code" = "200" ]; then
                            echo "Deploy OK"
                            exit 0
                        fi
                        sleep 6
                    done
                    echo "Smoke test FAILED - kiem tra: docker compose logs app tren VPS"
                    exit 1
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
            sh 'docker image prune -f || true'
        }
        success {
            echo "Deploy thanh cong build #${env.BUILD_NUMBER}"
        }
        failure {
            echo "Build #${env.BUILD_NUMBER} that bai - xem Console Output"
        }
    }
}
