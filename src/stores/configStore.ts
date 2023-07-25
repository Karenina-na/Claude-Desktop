import { ref } from 'vue';
import { defineStore } from 'pinia'
import Config from '../../public/configModel'

export const ConfigStore = defineStore('ConfigStore', () => {
    let config = ref(new Config())

    function updateConfig(c: Config) {
        config = ref(c)
    }

    function updateTheme(theme: string) {
        config.value.theme = theme
    }

    function updateStayOnTop(stay_on_top: boolean) {
        config.value.stay_on_top = stay_on_top
    }

    function updateMainWindow(main_width: number, main_height: number) {
        config.value.main_width = main_width
        config.value.main_height = main_height
    }

    function updateTray(tray: boolean) {
        config.value.tray = tray
    }

    function updateTrayWindow(tray_width: number, tray_height: number) {
        config.value.tray_width = tray_width
        config.value.tray_height = tray_height
    }

    function updateUATray(ua_tray: string) {
        config.value.ua_tray = ua_tray
    }

    function getConfig() {
        return config.value
    }

    function getTheme() {
        return config.value.theme
    }

    function getStayOnTop() {
        return config.value.stay_on_top
    }

    function getMainWindow() {
        return { width: config.value.main_width, height: config.value.main_height }
    }

    function getTray() {
        return config.value.tray
    }

    function getTrayWindow() {
        return { width: config.value.tray_width, height: config.value.tray_height }
    }

    function getUATray() {
        return config.value.ua_tray
    }

    return {
        updateConfig, updateTheme, updateStayOnTop, updateMainWindow, updateTray, updateTrayWindow, updateUATray,
        getConfig, getTheme, getStayOnTop, getMainWindow, getTray, getTrayWindow, getUATray
    }
})