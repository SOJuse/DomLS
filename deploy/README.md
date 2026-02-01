# Деплой DomLS на VPS

## 1. VPS готов? Подключись по SSH

```bash
ssh root@ТВОЙ_IP
```

---

## 2. Установка Docker

```bash
apt update && apt upgrade -y
apt install -y docker.io docker-compose
systemctl enable docker && systemctl start docker
```

---

## 3. SSL сертификат (Let's Encrypt)

```bash
apt install -y certbot
certbot certonly --standalone -d dom-ls.ru -d www.dom-ls.ru --email твой@email.com --agree-tos -n
```

Сертификаты появятся в `/etc/letsencrypt/live/dom-ls.ru/`

---

## 4. Копируй проект на сервер

На своём компе:

```bash
scp -r /путь/к/DomLS root@ТВОЙ_IP:/root/
```

Или через git:

```bash
# На сервере
cd /root
git clone ТВОЙ_РЕПОЗИТОРИЙ DomLS
cd DomLS
```

---

## 5. Продакшен .env

```bash
cp deploy/.env.example .env
# Отредактируй .env — замени JWT_SECRET на свой
```

Содержимое .env:
```env
VITE_API_URL=https://dom-ls.ru
REACT_APP_API_URL=https://dom-ls.ru
CORS_ORIGINS=https://dom-ls.ru,https://www.dom-ls.ru
JWT_SECRET=сгенерируй-длинный-ключ
```

Сгенерировать JWT_SECRET: `openssl rand -hex 32`

---

## 6. Nginx reverse proxy

Скопируй конфиг и включи:

```bash
cp /root/DomLS/deploy/nginx-dom-ls.conf /etc/nginx/sites-available/dom-ls.ru
ln -sf /etc/nginx/sites-available/dom-ls.ru /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 7. Запуск проекта

### Вариант A: Сборка на своём ПК (рекомендуется для слабого VPS 1GB)

На своём компе (с заполненным .env):
```bash
cd DomLS
chmod +x deploy/build-and-save.sh
./deploy/build-and-save.sh
scp domls-images.tar root@ТВОЙ_IP:/root/
```

На сервере:
```bash
cd /root/DomLS
docker load -i /root/domls-images.tar
docker-compose -f deploy/docker-compose.prod.yml up -d
```

### Вариант B: Сборка на сервере

```bash
cd /root/DomLS
docker-compose up -d --build
```

---

## 8. Проверка

- https://dom-ls.ru — фронт
- https://dom-ls.ru/api — API  
- https://dom-ls.ru/admin — админка

---

## Обновление SSL (раз в 3 месяца)

```bash
certbot renew
systemctl reload nginx
```

Можно добавить в cron: `0 3 * * * certbot renew --quiet`
