import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import Inspect from 'vite-plugin-inspect'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    resolve: {
        alias: {
            '@': pathSrc
        }
    },
    plugins: [
        vue(),
        electron({
            entry: 'electron/main.ts',
            },
        ),
        AutoImport({
            imports: ['vue'],
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    prefix: 'Icon',
                }),
            ],
            dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
        }),
        Components({
            resolvers: [
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
                ElementPlusResolver(),
            ],
            dts: path.resolve(pathSrc, 'components.d.ts'),
        }),
        Icons({
            autoInstall: true,
        }),
        Inspect(),
    ],
})
