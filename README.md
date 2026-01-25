![Coverage](coverage/badge.svg)

# Gameli 2.0

Это веб-приложение на **React** с использованием **Vite**, **React Router**, **React Query**, **Supabase** и поддержкой **PWA** (Progressive Web App).\
Проект включает систему аутентификации, маршрутизацию и готов к работе офлайн благодаря сервис-воркеру.

---

## Доступные скрипты

В директории проекта вы можете запускать:

### `npm run dev`

Запускает приложение в режиме разработки с быстрым HMR.\
Откройте в браузере [http://localhost:5173](http://localhost:5173).

Страница автоматически обновляется при изменении файлов.\
Также в консоли можно увидеть ошибки ESLint/Prettier.

---

### `npm run build`

Собирает приложение для продакшн в папку `dist`.\
Файлы минимизированы, React оптимизирован для максимальной производительности.

```bash
npm run build
```

---

### `npm run preview`

Позволяет протестировать **собранное приложение локально**, как в продакшн:

```bash
npm run preview
```

Откроется на [http://localhost:4173](http://localhost:4173) (по умолчанию).

---

### `npm run lint`

Проверяет весь проект на ошибки ESLint.\
Команда завершится с ошибкой, если есть ошибки или предупреждения:

```bash
npm run lint
```

---

### `npm run lint:fix`

Автоматически исправляет ошибки ESLint (если возможно):

```bash
npm run lint:fix
```

---

### `npm run prettier`

Проверяет форматирование файлов согласно Prettier.\
Проект использует кеш для ускорения проверок:

```bash
npm run prettier
```

---

### `npm run prettier:fix`

Автоматически исправляет форматирование:

```bash
npm run prettier:fix
```

---

### `npm run format`

Выполняет **lint\*\***:fix** и **prettier\***\*:fix** сразу:

```bash
npm run format
```

---

## Поддержка PWA

Приложение поддерживает **Progressive Web App**:

- Автообновление сервис-воркера
- Возможность работать офлайн
- Установка на устройства (iOS / Android)

Сервис-воркер регистрируется через **vite-plugin-pwa**, поэтому PWA работает только после сборки:

```bash
npm run build
npm run preview
```

---

## Структура проекта

```
public/          ← статические файлы (favicon, логотипы)
src/
  components/    ← компоненты React
  contexts/      ← React Context (Auth, Query)
  app/           ← маршрутизация
  index.css      ← глобальные стили
  main.jsx       ← точка входа приложения
```

---

## Используемые технологии

- React 19
- Vite
- React Router
- React Query
- Supabase
- ESLint + Prettier + Husky (pre-commit hooks)
- Progressive Web App (PWA)
