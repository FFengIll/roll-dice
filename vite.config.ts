import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './', // 设置为相对路径
    server: {
        host: 'localhost',
        port: 3000,
        open: '/roll-dice/dist', // 默认打开的页面
    }
})
