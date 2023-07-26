/*
 * @Author: DZL
 * @Date: 2023-07-26 10:40:54
 * @LastEditors: DZL
 * @LastEditTime: 2023-07-26 12:04:10
 * @Description: 
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/video/'
})
